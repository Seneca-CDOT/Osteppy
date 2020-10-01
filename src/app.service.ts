import { Injectable } from '@nestjs/common';

@Injectable()
class AppService {
  private readonly GREETING = 'Hello World!';

  getHello(): string {
    return this.GREETING;
  }
}

export default AppService;
