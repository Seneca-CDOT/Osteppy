import {
  createMockDatabaseTestingModule,
  MockDatabaseTestingModule,
} from '../database/mock_database_testing.module';
import UsersController from './users.controller';
import UsersModule from './users.module';

describe('UsersController', () => {
  let testingModule: MockDatabaseTestingModule;
  let usersController: UsersController;

  beforeEach(async () => {
    testingModule = await createMockDatabaseTestingModule([UsersModule]);
    usersController = testingModule.get(UsersController);
  });

  test('find all users', async () => {
    expect((await usersController.findAll()).length).toBe(0);

    await usersController.createOrUpdate('123', { slackUsername: 'foo' });
    expect((await usersController.findAll()).length).toBe(1);
  });

  test('delete all users', async () => {
    await usersController.createOrUpdate('123', { slackUsername: 'foo' });
    const result = await usersController.deleteAll();
    expect(result.deletedCount).toBe(1);
  });

  test('create or update user', async () => {
    let user = await usersController.createOrUpdate('123', {
      slackUsername: 'foo',
    });
    expect(user.slackUserId).toBe('123');
    expect(user.slackUsername).toBe('foo');

    user = await usersController.createOrUpdate('123', {
      slackUsername: 'bar',
    });
    expect(user.slackUserId).toBe('123');
    expect(user.slackUsername).toBe('bar');
  });

  test('find user', async () => {
    let user = await usersController.find('123');
    expect(user).toBe(null);

    await usersController.createOrUpdate('123', {
      slackUsername: 'foo',
    });
    user = await usersController.find('123');
    expect(user?.slackUserId).toBe('123');
    expect(user?.slackUsername).toBe('foo');
  });

  afterEach(async () => {
    await testingModule.stop();
  });
});
