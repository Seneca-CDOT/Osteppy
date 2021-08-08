import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import UsersService from './users.service';
import UserEodsService from './user_eods.service';

@Controller('users')
export default class UsersController {
  constructor(
    private usersService: UsersService,
    private userEodsService: UserEodsService,
  ) {}

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

  @Patch(':slackUserId/eod/tasks/push-many')
  pushEodTasks(
    @Param('slackUserId') slackUserId: string,
    @Body('tasks') tasks: string[],
  ) {
    return this.userEodsService.pushEodTasks(slackUserId, tasks);
  }

  @Patch(':slackUserId/eod/tasks/pop-many')
  popEodTask(
    @Param('slackUserId') slackUserId: string,
    @Body('numTasks') numTasks: number,
  ) {
    return this.userEodsService.popEodTasks(slackUserId, numTasks);
  }
}
