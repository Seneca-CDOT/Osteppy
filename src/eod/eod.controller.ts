import { Controller, Post } from '@nestjs/common';
import EodService from './eod.service';

@Controller('eod')
export default class EodController {
  constructor(private eodService: EodService) {}

  @Post('create')
  create() {
    return this.eodService.create();
  }
}
