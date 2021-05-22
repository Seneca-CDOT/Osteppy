import { Injectable, NestMiddleware } from '@nestjs/common';
import { urlencoded } from 'body-parser';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export default class BodyParserMiddleware implements NestMiddleware {
  // Parse while still keep raw body in a different property
  // for later uses such as in authentication guard
  private parser = urlencoded({
    extended: true,
    verify(req: Request, res: Response, buf: Buffer) {
      Object.defineProperty(req, 'rawBody', {
        value: buf.toString(),
      });
    },
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.parser(req, res, next);
  }
}
