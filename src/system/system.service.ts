import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export default class SystemService {
  private logger = new Logger(SystemService.name);

  async sendMessage() {
    return 'this is the message';
  }
}
