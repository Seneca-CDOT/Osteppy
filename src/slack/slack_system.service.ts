import { Injectable, Logger } from '@nestjs/common';
import SlackRequestDto from './slack_request.dts';
import SystemService from '../system/system.service';

import Domain from '../system/system_domains';

@Injectable()
export default class SlackSystemService {
  private readonly logger = new Logger(SlackSystemService.name);

  constructor(private systemService: SystemService) {}

  async listPorts({ text }: SlackRequestDto) {
    const storedDomains: Domain[] = await this.systemService.findAll();
    if (!storedDomains.length) {
      const tag = '```';
      return `${tag} # There are no registered ports${tag}`;
    }

    let formattedList;
    if (text.length) {
      // eslint-disable-next-line no-param-reassign
      text = !text.includes('.cdot.systems')
        ? `${text.trim()}.cdot.systems`
        : text;

      formattedList = SystemService.formatMessage(
        storedDomains.filter((domain: Domain) => domain.domain === text.trim()),
        true,
      );
    } else {
      formattedList = SystemService.formatMessage(storedDomains, true);
    }

    return formattedList;
  }
}
