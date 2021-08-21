# UsersModule

This module is responsible for managing the `users` MongoDB collection.

## Services

- [`UsersService`](users.service.ts): provides basic CRUD methods for querying users or modifying a user.
- [`UsersEodsService`](users_eods.service.ts): provides methods which process EODs across all users.

## Controllers

The defined endpoints are exposed in `development mode` only, and should be used just for debugging.

- `[GET] /users`: find all users.
- `[DELETE] /users`: delete all users.
- `[GET] /users/:slackUserId`: find user by Slack user ID.

- `[PATCH] /users/:slackUserId/eod/tasks/push-many`: push EOD tasks of a user.

  ```ts
  // request body
  {
    tasks: string[]; // tasks to push
  }
  ```

- `[PATCH] /users/:slackUserId/eod/tasks/pop-many`: pop EOD tasks of a user.
  ```ts
  // request body
  {
    numTasks: number; // number of tasks to pop
  }
  ```
