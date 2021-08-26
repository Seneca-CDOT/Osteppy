import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Domain, DomainSchema } from './schemas/domain.schema';
import SystemController from './system.controller';
import SystemService from './system.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Domain.name, schema: DomainSchema }]),
  ],
  controllers: [SystemController],
  providers: [SystemService],
  exports: [SystemService],
})
export default class SystemModule {}
