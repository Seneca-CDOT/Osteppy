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

    await usersService.findOrCreate('123');
    users = await usersService.findAll();
    expect(users.length).toBe(1);
  });

  test('delete all', async () => {
    let result = await usersService.deleteAll();
    expect(result.deletedCount).toBe(0);

    await usersService.findOrCreate('123');
    result = await usersService.deleteAll();
    expect(result.deletedCount).toBe(1);
  });

  test('find', async () => {
    let user = await usersService.find('123');
    expect(user).toBe(null);

    await usersService.findOrCreate('123');
    user = await usersService.find('123');
    expect(user?.slackUserId).toBe('123');
  });

  test('find or create', async () => {
    const user = await usersService.findOrCreate('123');
    expect(user).toEqual(
      expect.objectContaining({
        slackUserId: '123',
        slackUsername: '',
        eods: [],
        eod: {
          date: new Date(0),
          tasks: [],
          slackEmoji: '',
        },
      }),
    );
  });

  test('update EOD', async () => {
    let eod = await usersService.updateEod('123', {
      tasks: ['foo'],
      slackEmoji: ':bar:',
    });
    expect(eod.tasks).toEqual(['foo']);
    expect(eod.slackEmoji).toEqual(':bar:');

    eod = await usersService.updateEod('123', {
      tasks: ['bar'],
    });
    expect(eod.tasks).toEqual(['bar']);
    expect(eod.slackEmoji).toEqual(':bar:');

    eod = await usersService.updateEod('123', {
      slackEmoji: ':foo:',
    });
    expect(eod.tasks).toEqual(['bar']);
    expect(eod.slackEmoji).toEqual(':foo:');
  });

  test('push EOD tasks', async () => {
    let eod = await usersService.pushEodTasks('123', ['foo']);
    expect(eod.tasks).toEqual(['foo']);

    eod = await usersService.pushEodTasks('123');
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

    eod = await usersService.popEodTasks('123');
    expect(eod.tasks).toEqual(['foo', 'bar']);

    eod = await usersService.popEodTasks('123', 10);
    expect(eod.tasks).toEqual([]);
  });

  afterEach(async () => {
    await testingModule.stop();
  });
});
