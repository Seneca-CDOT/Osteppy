import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import SlackRequestDto from './slack_request.dts';
import SlackService from './slack.service';
import Domain from '../system/system_domains';
import { SLACK } from '../configuration';

const pathToPortFile = `../../config_files/${SLACK.DOMAINS_FILE_NAME}`;

@Injectable()
export default class SlackSystemService {
  private readonly logger = new Logger(SlackSystemService.name);

  static formatList(list: Domain[]) {
    const tag = '```';
    const header = '# Registered Services\n';

    const portColumnWidth = 5;

    // Header
    let formattedList = `${tag}${header}`;

    list.forEach((domain: Domain) => {
      const domainName = domain.domain.replace('.cdot.systems', '');
      formattedList += `${domainName}:\n`;
      // Ports
      domain.services.forEach((service) => {
        formattedList += service.port.toString().padEnd(portColumnWidth);

        formattedList += `${service.service}\n`;
      });

      formattedList += '\n';
    });

    formattedList += tag;

    return formattedList;
  }

  constructor(private slackService: SlackService) {}

  async listPorts({ text }: SlackRequestDto) {
    let storedDomains;

    try {
      storedDomains = JSON.parse(
        fs.readFileSync(join(__dirname, pathToPortFile), 'utf-8'),
      );

      this.logger.log(`${SLACK.DOMAINS_FILE_NAME} successfully loaded`);
    } catch (err) {
      this.logger.log(err);

      const tag = '```';
      return `${tag} # Error: There was an error opening ${SLACK.DOMAINS_FILE_NAME}${tag}`;
    }

    let formattedList;
    if (text.length) {
      // eslint-disable-next-line no-param-reassign
      text = !text.includes('.cdot.systems')
        ? `${text.trim()}.cdot.systems`
        : text;

      formattedList = SlackSystemService.formatList(
        storedDomains.filter((domain: Domain) => domain.domain === text.trim()),
      );
    } else {
      formattedList = SlackSystemService.formatList(storedDomains);
    }

    return formattedList;
  }
}
