export interface UserInterface {
  id: number,
  username: string,
  name: string,
  email: string
}

export default class User {
  static count = 0;
  static all: UserInterface[] = [];
}