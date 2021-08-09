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
    let eod = await userEodsService.updateEod('123', {
      tasks: ['foo'],
      slackEmoji: ':bar:',
    });
    expect(eod.tasks).toEqual(['foo']);
    expect(eod.slackEmoji).toEqual(':bar:');

    eod = await userEodsService.updateEod('123', {
      tasks: ['bar'],
    });
    expect(eod.tasks).toEqual(['bar']);
    expect(eod.slackEmoji).toEqual(':bar:');

    eod = await userEodsService.updateEod('123', {
      slackEmoji: ':foo:',
    });
    expect(eod.tasks).toEqual(['bar']);
    expect(eod.slackEmoji).toEqual(':foo:');
  });

  test('push EOD tasks', async () => {
    let eod = await userEodsService.pushEodTasks('123', ['foo']);
    expect(eod.tasks).toEqual(['foo']);

    eod = await userEodsService.pushEodTasks('123');
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

    eod = await userEodsService.popEodTasks('123');
    expect(eod.tasks).toEqual(['foo', 'bar']);

    eod = await userEodsService.popEodTasks('123', 10);
    expect(eod.tasks).toEqual([]);
  });

  afterEach(async () => {
    await testingModule.stop();
  });
});
