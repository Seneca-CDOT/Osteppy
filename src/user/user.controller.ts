import { Controller, Post, Req } from '@nestjs/common';
import SlackRequestDto from '../dto/slack_request.dto';
import UserService from './user.service';

@Controller('user')
export default class UserController {
  constructor(private userService: UserService) {}

  // User should not be created manually.
  // This route is for development purpose only.
  @Post('create')
  create(@Req() slackRequestDto: SlackRequestDto) {
    const { text } = slackRequestDto.body;
    const [userId, userName] = text.split(' ');
    return this.userService.create(userId, userName);
  }

  @Post('find-all')
  findAll() {
    return this.userService.findAll();
  }

  @Post('find-one')
  findOne(@Req() slackRequestDto: SlackRequestDto) {
    const { text } = slackRequestDto.body;
    const userId = text.match(/<@(\w+)[^>]*>/)?.[1];
    return this.userService.findOne(userId);
  }

  @Post('delete-all')
  deleteAll() {
    return this.userService.deleteAll();
  }
}
