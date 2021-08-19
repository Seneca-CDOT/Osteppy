import { Injectable, Logger } from '@nestjs/common';
import { scheduleJob } from 'node-schedule';
import { ChatPostMessageResponse } from '@slack/web-api';
import * as fs from 'fs';
import { join } from 'path';
import * as shelljs from 'shelljs';
import Domain from './system_domains.dts';
import SlackService from '../slack/slack.service';

const pathToPortFile = '../../config_files/domains.json';

@Injectable()
export default class SystemService {
  private readonly logger = new Logger(SystemService.name);

  private readonly slackChannel = 'C023BLCKARG';

  private isPortWatchingScheduled = false;

  constructor(private slackService: SlackService) {}

  readDomainsFile() {
    let data;
    try {
      data = fs.readFileSync(join(__dirname, pathToPortFile), 'utf-8');
    } catch (err) {
      this.logger.log(err);
    }

    return JSON.parse(data || '');
  }

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

  async portCheck() {
    this.logger.log('Initializing port watching');

    const storedDomains = this.readDomainsFile();
    this.logger.log('Ports file successfully loaded');

    const scannedDomains: string[] = await Promise.all(
      storedDomains.map(({ domain }: Domain) =>
        this.shellAsync(`nmap -p- ${domain}`),
      ),
    );

    const promises: Promise<ChatPostMessageResponse>[] = [];

    storedDomains.forEach(({ domain, services }: Domain, index: number) => {
      const storedPorts = services.map(({ port }: { port: number }) => port);

      const parsedDomain = this.parseDomain(scannedDomains[index]);

      parsedDomain.services.forEach((service) => {
        if (!storedPorts.includes(service.port)) {
          promises.push(
            this.slackService.web.chat.postMessage({
              channel: this.slackChannel,
              text: `Domain: ${domain}, Port ${service.port} not listed`,
            }),
          );

          this.logger.log(`Domain: ${domain}, Port ${service.port} not listed`);
        }
      });
    });

    await Promise.all(promises);
  }

  schedulePortWatching() {
    this.logger.log('Schedule Port Watching');
    if (this.isPortWatchingScheduled) return;

    // schedule every hour
    scheduleJob('0 * * * *', () => this.portCheck());
    this.isPortWatchingScheduled = true;
  }
}
