export default class UploadResponse {
  httpCode: number;
  message: string;
  url: string;

  constructor(httpCode: number, message: string, url: string) {
    this.httpCode = httpCode;
    this.message = message;
    this.url = url;
  }
}
