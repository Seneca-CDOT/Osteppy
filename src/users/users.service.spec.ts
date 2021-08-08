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

  afterEach(async () => {
    await testingModule.stop();
  });
});
