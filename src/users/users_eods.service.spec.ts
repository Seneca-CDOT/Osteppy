import {
  createMockDatabaseTestingModule,
  MockDatabaseTestingModule,
} from '../database/mock_database_testing.module';
import UsersModule from './users.module';
import UsersService from './users.service';
import UsersEodsService from './users_eods.service';

describe('UsersEodsService', () => {
  let testingModule: MockDatabaseTestingModule;
  let usersEodsService: UsersEodsService;
  let usersService: UsersService;

  beforeEach(async () => {
    testingModule = await createMockDatabaseTestingModule([UsersModule]);
    usersEodsService = testingModule.get(UsersEodsService);
    usersService = testingModule.get(UsersService);
  });

  afterEach(async () => {
    await testingModule.stop();
  });

  test('archive EOD for all users', async () => {
    await usersService.pushEodTasks('123', ['foo']);
    await usersService.pushEodTasks('456');
    await usersService.pushEodTasks('789', ['bar', 'baz']);

    const { nModified } = await usersEodsService.archiveAllUsersEods();
    expect(nModified).toBe(2);

    const user123 = await usersService.findOrCreate('123');
    const user456 = await usersService.findOrCreate('456');
    const user789 = await usersService.findOrCreate('789');

    expect(user123.eod.tasks).toEqual([]);
    expect(user456.eod.tasks).toEqual([]);
    expect(user789.eod.tasks).toEqual([]);

    expect(user123.eods[0].tasks).toEqual(['foo']);
    expect(user456.eods).toEqual([]);
    expect(user789.eods[0].tasks).toEqual(['bar', 'baz']);
  });
});
