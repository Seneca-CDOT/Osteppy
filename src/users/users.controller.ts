import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import UsersService from './users.service';

@Controller('users')
export default class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Delete()
  async deleteAll() {
    return this.usersService.deleteAll();
  }

  @Get(':slackUserId')
  async find(@Param('slackUserId') slackUserId: string) {
    return this.usersService.find(slackUserId);
  }

  @Patch(':slackUserId/eod/tasks/push-many')
  async pushEodTasks(
    @Param('slackUserId') slackUserId: string,
    @Body('tasks') tasks: string[],
  ) {
    return this.usersService.pushEodTasks(slackUserId, tasks);
  }

  @Patch(':slackUserId/eod/tasks/pop-many')
  async popEodTask(
    @Param('slackUserId') slackUserId: string,
    @Body('numTasks') numTasks: number,
  ) {
    return this.usersService.popEodTasks(slackUserId, numTasks);
  }
}
