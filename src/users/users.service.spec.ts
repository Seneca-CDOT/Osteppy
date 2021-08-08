import {
  createMockDatabaseTestingModule,
  MockDatabaseTestingModule,
} from '../database/mock_database_testing.module';
import UsersModule from './users.module';
import UsersService from './users.service';

describe('UsersService', () => {
  let testingModule: MockDatabaseTestingModule;
  let usersService: UsersService;

  beforeEach(async () => {
    testingModule = await createMockDatabaseTestingModule([UsersModule]);
    usersService = testingModule.get(UsersService);
  });

  test('find all', async () => {
    let users = await usersService.findAll();
    expect(users.length).toBe(0);

    await usersService.create('123', 'foo');
    users = await usersService.findAll();
    expect(users.length).toBe(1);
  });

  test('delete all', async () => {
    let result = await usersService.deleteAll();
    expect(result.deletedCount).toBe(0);

    await usersService.create('123', 'foo');
    result = await usersService.deleteAll();
    expect(result.deletedCount).toBe(1);
  });

  test('find', async () => {
    let user = await usersService.find('123');
    expect(user).toBe(null);

    await usersService.create('123', 'foo');
    user = await usersService.find('123');
    expect(user?.slackUserId).toBe('123');
    expect(user?.slackUsername).toBe('foo');
  });

  test('create', async () => {
    const user = await usersService.create('123', 'foo');
    expect(user.slackUserId).toBe('123');
    expect(user.slackUsername).toBe('foo');
  });

  test('update EOD', async () => {
    const eod = await usersService.updateEod('123', ['foo'], ':bar:');
    expect(eod.tasks).toEqual(['foo']);
    expect(eod.slackEmoji).toEqual(':bar:');
  });

  test('push EOD tasks', async () => {
    let eod = await usersService.pushEodTasks('123', ['foo']);
    expect(eod.tasks).toEqual(['foo']);

    eod = await usersService.pushEodTasks('123', ['bar', 'baz']);
    expect(eod.tasks).toEqual(['foo', 'bar', 'baz']);
  });

  test('pop EOD tasks', async () => {
    let eod = await usersService.popEodTasks('123', 1);
    expect(eod.tasks).toEqual([]);

    await usersService.pushEodTasks('123', ['foo', 'bar', 'baz']);
    eod = await usersService.popEodTasks('123', 1);
    expect(eod.tasks).toEqual(['foo', 'bar']);

    eod = await usersService.popEodTasks('123', 10);
    expect(eod.tasks).toEqual([]);
  });

  test('update EOD Slack emoji', async () => {
    let eod = await usersService.updateEodSlackEmoji('123', ':foo:');
    expect(eod.slackEmoji).toBe(':foo:');

    eod = await usersService.updateEodSlackEmoji('123', ':bar:');
    expect(eod.slackEmoji).toBe(':bar:');
  });

  afterEach(async () => {
    await testingModule.stop();
  });
});
