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

  test('find all users', async () => {
    expect((await usersService.findAll()).length).toBe(0);

    await usersService.createOrUpdate('123', 'foo');
    expect((await usersService.findAll()).length).toBe(1);
  });

  test('delete all users', async () => {
    await usersService.createOrUpdate('123', 'foo');
    const result = await usersService.deleteAll();
    expect(result.deletedCount).toBe(1);
  });

  test('create or update user', async () => {
    let user = await usersService.createOrUpdate('123', 'foo');
    expect(user.slackUserId).toBe('123');
    expect(user.slackUsername).toBe('foo');

    user = await usersService.createOrUpdate('123', 'bar');
    expect(user.slackUserId).toBe('123');
    expect(user.slackUsername).toBe('bar');
  });

  test('find user', async () => {
    let user = await usersService.find('123');
    expect(user).toBe(null);

    await usersService.createOrUpdate('123', 'foo');
    user = await usersService.find('123');
    expect(user?.slackUserId).toBe('123');
    expect(user?.slackUsername).toBe('foo');
  });

  afterEach(async () => {
    await testingModule.stop();
  });
});
