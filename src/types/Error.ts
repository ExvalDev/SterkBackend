export default interface Error {
  name: string;
  httpCode: number;
  description: string | string[];
}
