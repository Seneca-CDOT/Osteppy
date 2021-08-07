import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import CreateOrUpdateUserDto from './dto/create_or_update_user.dto';
import UsersService from './users.service';

@Controller('users')
export default class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Delete()
  deleteAll() {
    return this.usersService.deleteAll();
  }

  @Get(':slackUserId')
  find(@Param('slackUserId') slackUserId: string) {
    return this.usersService.find(slackUserId);
  }

  @Patch(':slackUserId')
  createOrUpdate(
    @Param('slackUserId') slackUserId: string,
    @Body() createOrUpdateUserDto: CreateOrUpdateUserDto,
  ) {
    const { slackUsername } = createOrUpdateUserDto;
    return this.usersService.createOrUpdate(slackUserId, slackUsername);
  }
}
