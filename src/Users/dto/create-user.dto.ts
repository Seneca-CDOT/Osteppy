export default class CreateUserDto {
  readonly userId: string;

  readonly userName: string;

  readonly eods: string[];

  eodStatus: boolean;

  constructor(userId: string, userName: string, eod: string) {
    this.userId = userId;
    this.userName = userName;
    this.eods = [];
    this.eodStatus = true;

    this.eods.push(eod);
  }
}
