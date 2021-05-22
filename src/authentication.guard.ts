import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import * as formUrlencoded from 'form-urlencoded';
import { SLACK } from './configuration';
import SlackRequestDto from './dto/slack_request.dto';

@Injectable()
export default class AuthenticationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<SlackRequestDto>();

    return (
      AuthenticationGuard.guardSlackCommand(request) &&
      AuthenticationGuard.guardSlackWorkspace(request)
    );
  }

  // Ensure request is from Slack, using signed secrets:
  // https://api.slack.com/authentication/verifying-requests-from-slack
  static guardSlackCommand(request: SlackRequestDto) {
    const {
      headers: {
        'x-slack-request-timestamp': requestTimestamp,
        'x-slack-signature': signature,
      },
      body,
    } = request;

    const rawBody = formUrlencoded(body);
    const computedSignature = AuthenticationGuard.computeSlackSignature(
      requestTimestamp,
      rawBody,
    );

    return computedSignature === signature;
  }

  // Ensure request is from specific workspace
  static guardSlackWorkspace(request: SlackRequestDto) {
    const { team_id } = request.body;
    return team_id === SLACK.TEAM_ID;
  }

  static computeSlackSignature(requestTimestamp: string, rawBody: string) {
    const baseString = [
      AuthenticationGuard.SLACK_AUTH_VERSION,
      requestTimestamp,
      rawBody,
    ].join(':');

    const hashedString = createHmac('sha256', SLACK.SIGNING_SECRET)
      .update(baseString)
      .digest('hex');

    const computedSignature = `${AuthenticationGuard.SLACK_AUTH_VERSION}=${hashedString}`;
    return computedSignature;
  }

  static SLACK_AUTH_VERSION = 'v0';
}
