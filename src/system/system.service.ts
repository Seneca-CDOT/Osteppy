import { WebClient } from '@slack/web-api';
import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { join } from 'path';
import * as shelljs from 'shelljs';
import Domain from './system_domains';
import Service from './system_services';
import { DomainDocument } from './schemas/domain.schema';
import { SLACK } from '../configuration';

const pathToPortFile = `../../config_files/${SLACK.DOMAINS_FILE_NAME}`;

@Injectable()
export default class SystemService {
  private readonly logger = new Logger(SystemService.name);

  private readonly web = new WebClient(SLACK.BOT_USER_TOKEN);

  /**
   * Promisify shelljs
   * https://gist.github.com/davidrleonard/2962a3c40497d93c422d1269bcd38c8f
   */
  static shellAsync(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      shelljs.exec(cmd, { silent: true }, (code, stdout, stderr) => {
        if (code !== 0) return reject(new Error(stderr));
        return resolve(stdout);
      });
    });
  }

  static parseDomain(domainData: string) {
    // Extract the domain
    const domainRegex = /([a-z0-0]*\.[a-z0-9]*|[a-z0-9]*)\.cdot\.systems/;
    const domain = domainData.match(domainRegex);

    // Extract ports
    const lines = domainData.split('\n');
    const openPorts = lines.filter((line) => line.includes('open'));

    const ports = openPorts.map((port) => {
      return {
        port: parseInt(port.split('/')[0], 10),
      };
    });

    return { domain: domain?.length ? domain[0] : '', services: ports };
  }

  static formatMessage(domains: Domain[], isRegistered: boolean) {
    const prefix = isRegistered ? '' : '<!here>\n';
    const header = isRegistered
      ? '# Registered Services\n'
      : '# Unregistered Opened Ports\n';
    const tag = '```';
    const portColumnWidth = 5;

    // Header
    let formattedMessage = `${tag}${header}`;

    if (isRegistered) {
      domains.forEach((domain) => {
        const domainName = domain.domain.replace('.cdot.systems', '');
        formattedMessage += `${domainName}:\n`;
        // Ports
        domain.services.forEach((service) => {
          formattedMessage += service.port.toString().padEnd(portColumnWidth);

          formattedMessage += `${service.service}\n`;
        });
        formattedMessage += '\n';
      });
    } else {
      domains.forEach((domain) => {
        // Domain name
        formattedMessage += `- Domain: ${domain.domain}\n  ${
          domain.services.length > 1 ? 'Ports ' : 'Port  '
        }:`;

        // Ports
        domain.services.forEach((service) => {
          formattedMessage += ` ${service.port}`;
        });
        formattedMessage += '\n';
      });
    }

    formattedMessage += tag;
    formattedMessage = prefix + formattedMessage;

    return formattedMessage;
  }

  constructor(
    @InjectModel(Domain.name) private DomainModel: Model<DomainDocument>,
  ) {}

  private async loadDomainsFromFile() {
    try {
      return JSON.parse(
        fs.readFileSync(join(__dirname, pathToPortFile), 'utf-8'),
      );
    } catch (err) {
      this.logger.log(err);

      const tag = '```';
      await this.web.chat.postMessage({
        channel: SLACK.PORT_CHECKER_CHANNEL,
        text: `${tag} # Error: There was an error opening ${SLACK.DOMAINS_FILE_NAME}${tag}`,
      });

      return [];
    }
  }

  async findAll() {
    this.logger.log('Find all Domains');
    const domains = await this.DomainModel.find();

    return domains.map((domain) => {
      return {
        domain: domain.domain,
        services: domain.services.map(({ port, service }) => ({
          port,
          service,
        })),
      };
    });
  }

  async portCheck() {
    this.logger.log('Initializing port watching');

    // Get domains' data from the database
    const storedDomains: Domain[] = await this.findAll();

    // Scan ports using the stored data
    const scannedDomains: string[] = await Promise.all(
      storedDomains.map(({ domain }) => {
        // Info about -Pn option
        // https://nmap.org/book/man-host-discovery.html
        return SystemService.shellAsync(`nmap -Pn ${domain}`);
      }),
    );

    const domainsToReport: Domain[] = [];
    storedDomains.forEach(({ domain, services }: Domain, index: number) => {
      const unregisteredPorts: Service[] = [];
      const storedPorts = services.map(({ port }: { port: number }) => port);

      const parsedDomain = SystemService.parseDomain(scannedDomains[index]);
      parsedDomain.services.forEach((service) => {
        if (!storedPorts.includes(service.port))
          unregisteredPorts.push({ port: service.port });
      });

      if (unregisteredPorts.length)
        domainsToReport.push({ domain, services: unregisteredPorts });
    });

    if (domainsToReport.length)
      await this.web.chat.postMessage({
        channel: SLACK.PORT_CHECKER_CHANNEL,
        text: SystemService.formatMessage(domainsToReport, false),
      });
  }

  async loadDomains() {
    this.logger.log('loading domains');
    this.DomainModel.deleteMany({}, async () => {
      this.DomainModel.insertMany(await this.loadDomainsFromFile());
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  schedulePortWatching() {
    this.portCheck();
  }
}
