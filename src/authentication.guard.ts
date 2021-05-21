import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { CommandRequest } from './types/slack';

@Injectable()
export default class AuthenticationGuard implements CanActivate {
  // eslint-disable-next-line class-methods-use-this
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<CommandRequest>();

    return (
      AuthenticationGuard.guardSlackCommand(request) &&
      AuthenticationGuard.guardSlackWorkspace(request)
    );
  }

  // Uses signed secrets:
  // https://api.slack.com/authentication/verifying-requests-from-slack
  static guardSlackCommand(request: CommandRequest) {
    const {
      headers: {
        'x-slack-request-timestamp': requestTimestamp,
        'x-slack-signature': signature,
      },
      rawBody,
    } = request;

    const baseString = [
      AuthenticationGuard.SLACK_AUTH_VERSION,
      requestTimestamp,
      rawBody,
    ].join(':');

    const hashedString = createHmac(
      'sha256',
      process.env.SLACK_SIGNING_SECRET || '',
    )
      .update(baseString)
      .digest('hex');

    const computedSignature = `${AuthenticationGuard.SLACK_AUTH_VERSION}=${hashedString}`;

    return computedSignature === signature;
  }

  static guardSlackWorkspace(request: CommandRequest) {
    const {
      body: { team_id },
    } = request;

    return team_id === process.env.SLACK_TEAM_ID;
  }

  static SLACK_AUTH_VERSION = 'v0';
}
