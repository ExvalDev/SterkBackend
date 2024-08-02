export default class MessageResponse {
  httpCode: number;
  message: string;

  constructor(httpCode: number, message: string) {
    this.httpCode = httpCode;
    this.message = message;
  }
}
