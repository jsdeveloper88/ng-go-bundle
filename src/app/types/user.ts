export class User {
  constructor(
    public id: string = '',
    public beingUpd: boolean = false,
    public firstName?: string,
    public lastName?: string,
    public email?: string
    // public active: boolean = false
  ) {}
}
