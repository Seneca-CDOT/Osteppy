import { CanActivate, Injectable } from '@nestjs/common';
import { NODE_ENV } from './configuration';

@Injectable()
export default class DevelopmentModeGuard implements CanActivate {
  canActivate() {
    return NODE_ENV === 'development';
  }
}
