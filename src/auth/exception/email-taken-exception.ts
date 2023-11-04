export class EmailTakenException extends Error {
  constructor(message = 'Email is already taken.') {
    super(message);
    this.name = 'EmailTakenException';
  }
}
