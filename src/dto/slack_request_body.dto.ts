export default class SlackRequestBodyDto {
  constructor(
    public text: string,
    public user_id: string,
    public use_name: string,
    public team_id: string,
  ) {}
}
