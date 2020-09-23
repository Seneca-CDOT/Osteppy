export class CreateUserDto {
  readonly user_id: string;
  readonly user_name: string;
  readonly eods: string[];
  eod_status: boolean;

  constructor(userId: string, userName: string, eod: string) {
    this.user_id = userId;
    this.user_name = userName;
    this.eods = [];
    this.eod_status = true;

    this.eods.push(eod);
  }
}
