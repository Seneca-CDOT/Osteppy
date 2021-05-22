import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as request from 'supertest';
import AuthenticationGuard from '../authentication.guard';
import SlackRequestDto from '../dto/slack_request.dto';
import getApp from '../main';

@Injectable()
export default class DevService {
  async goToEndpoint(slackRequestDto: SlackRequestDto) {
    const {
      headers: { 'x-slack-request-timestamp': timestamp },
      body,
      rawBody,
      originalUrl,
    } = slackRequestDto;

    // extract endpoint from request
    let [endpoint] = body.text.split('\n');
    if (endpoint[0] !== '/') endpoint = `/${endpoint}`;

    // prevent circular redirection
    if (endpoint === originalUrl) {
      throw new HttpException('Circular routes', HttpStatus.BAD_REQUEST);
    }

    // generate authentication for request body without the endpoint
    const endRawBody = rawBody.replace(`${endpoint}\n`, '');
    const endSlackSignature = AuthenticationGuard.computeSlackSignature(
      timestamp,
      endRawBody,
    );

    // go to the endpoint with new authentication and request body
    const endResponse = await request(getApp().getHttpServer())
      .post(endpoint)
      .set('x-slack-request-timestamp', timestamp)
      .set('x-slack-signature', endSlackSignature)
      .send(endRawBody);

    return endResponse.text || endResponse.body;
  }
}
