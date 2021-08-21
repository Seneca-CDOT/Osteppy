import { Injectable, Logger } from '@nestjs/common';
import { scheduleJob } from 'node-schedule';
import * as fs from 'fs';
import { join } from 'path';
import * as shelljs from 'shelljs';
import Domain from './system_domains.dts';
import Service from './system_services.dts';
import SlackService from '../slack/slack.service';
import { SLACK } from '../configuration';

const pathToPortFile = `../../config_files/${SLACK.DOMAINS_FILE_NAME}`;

@Injectable()
export default class SystemService {
  private readonly logger = new Logger(SystemService.name);

  private isPortWatchingScheduled = false;

  constructor(private slackService: SlackService) {}

  /**
   * Promisify shelljs
   * https://gist.github.com/davidrleonard/2962a3c40497d93c422d1269bcd38c8f
   */
  shellAsync(cmd: string) {
    return new Promise((resolve, reject) => {
      shelljs.exec(cmd, { silent: true }, (code, stdout, stderr) => {
        if (code !== 0) return reject(new Error(stderr));
        return resolve(stdout);
      });
    });
  }

  parseDomain(domainData: string) {
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

    return { domain, services: ports };
  }

  formatMessage(domains: Domain[]) {
    const header = '# Unregistered Opened Ports\n';
    const tag = '```';

    // Header
    let formattedMessage = `${tag}${header}`;

    domains.forEach((domain) => {
      // Domain name
      formattedMessage += `- Domain: ${domain.domain}\n  ${
        domain.services.length > 1 ? 'Ports ' : 'Port  '
      }: `;

      // Ports
      domain.services.forEach((service) => {
        formattedMessage += `${service.port} `;
      });

      formattedMessage += '\n';
    });

    formattedMessage += tag;

    return formattedMessage;
  }

  async portCheck() {
    this.logger.log('Initializing port watching');

    // Get domains' data from the json file
    let storedDomains;
    try {
      storedDomains = JSON.parse(
        fs.readFileSync(join(__dirname, pathToPortFile), 'utf-8'),
      );

      this.logger.log(`${SLACK.DOMAINS_FILE_NAME} successfully loaded`);
    } catch (err) {
      this.logger.log(err);

      const tag = '```';
      await this.slackService.web.chat.postMessage({
        channel: SLACK.PORT_CHECKER_CHANNEL,
        text: `${tag} # Error: There was an error opening ${SLACK.DOMAINS_FILE_NAME}${tag}`,
      });

      return;
    }

    // Scan ports using the stored data
    const scannedDomains: string[] = await Promise.all(
      storedDomains.map(({ domain }: Domain) =>
        this.shellAsync(`nmap -p- ${domain}`),
      ),
    );

    const domainsToReport: Domain[] = [];
    storedDomains.forEach(({ domain, services }: Domain, index: number) => {
      const unregisteredPorts: Service[] = [];
      const storedPorts = services.map(({ port }: { port: number }) => port);

      const parsedDomain = this.parseDomain(scannedDomains[index]);
      parsedDomain.services.forEach((service) => {
        if (!storedPorts.includes(service.port))
          unregisteredPorts.push({ port: service.port });
      });

      if (unregisteredPorts.length)
        domainsToReport.push({ domain, services: unregisteredPorts });
    });

    await this.slackService.web.chat.postMessage({
      channel: SLACK.PORT_CHECKER_CHANNEL,
      text: this.formatMessage(domainsToReport),
    });
  }

  schedulePortWatching() {
    this.logger.log('Schedule Port Watching');
    if (this.isPortWatchingScheduled) return;

    // schedule every hour at minute 0
    scheduleJob('0 * * * *', () => this.portCheck());
    this.isPortWatchingScheduled = true;
  }
}
