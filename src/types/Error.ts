export default interface Error {
  name: string;
  httpCode: number;
  message: string;
  validationErrors: string[];
}
