import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import CreateUserDto from './dto/create_user.dto';
import UpdateUserDto from './dto/update_user.dto';
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

  @Post(':slackUserId')
  create(
    @Param('slackUserId') slackUserId: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    const { slackUsername } = createUserDto;
    return this.usersService.create(slackUserId, slackUsername);
  }

  @Get(':slackUserId')
  find(@Param('slackUserId') slackUserId: string) {
    return this.usersService.find(slackUserId);
  }

  @Put(':slackUserId')
  update(
    @Param('slackUserId') slackUserId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { slackUsername } = updateUserDto;
    return this.usersService.update(slackUserId, slackUsername);
  }
}
