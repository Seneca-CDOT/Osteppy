import {
  createMockDatabaseTestingModule,
  MockDatabaseTestingModule,
} from '../database/mock_database_testing.module';
import UsersModule from './users.module';
import UserEodsService from './user_eods.service';

describe('UserEodsService', () => {
  let testingModule: MockDatabaseTestingModule;
  let userEodsService: UserEodsService;

  beforeEach(async () => {
    testingModule = await createMockDatabaseTestingModule([UsersModule]);
    userEodsService = testingModule.get(UserEodsService);
  });

  test('update EOD', async () => {
    const eod = await userEodsService.updateEod('123', ['foo'], ':bar:');
    expect(eod.tasks).toEqual(['foo']);
    expect(eod.slackEmoji).toEqual(':bar:');
  });

  test('push EOD tasks', async () => {
    let eod = await userEodsService.pushEodTasks('123', ['foo']);
    expect(eod.tasks).toEqual(['foo']);

    eod = await userEodsService.pushEodTasks('123', ['bar', 'baz']);
    expect(eod.tasks).toEqual(['foo', 'bar', 'baz']);
  });

  test('pop EOD tasks', async () => {
    let eod = await userEodsService.popEodTasks('123', 1);
    expect(eod.tasks).toEqual([]);

    await userEodsService.pushEodTasks('123', ['foo', 'bar', 'baz']);
    eod = await userEodsService.popEodTasks('123', 1);
    expect(eod.tasks).toEqual(['foo', 'bar']);

    eod = await userEodsService.popEodTasks('123', 10);
    expect(eod.tasks).toEqual([]);
  });

  test('update EOD Slack emoji', async () => {
    let eod = await userEodsService.updateEodSlackEmoji('123', ':foo:');
    expect(eod.slackEmoji).toBe(':foo:');

    eod = await userEodsService.updateEodSlackEmoji('123', ':bar:');
    expect(eod.slackEmoji).toBe(':bar:');
  });

  afterEach(async () => {
    await testingModule.stop();
  });
});
