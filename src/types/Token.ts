const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE;
const REFRESH_TOKEN_LIFE = process.env.REFRESH_TOKEN_LIFE;

const calculateTokenExpiry = (tokenLife: string) => {
  const unit = tokenLife.slice(-1);
  const value = parseInt(tokenLife.slice(0, -1), 10);

  let milliseconds;
  switch (unit) {
    case "h": // Hours
      milliseconds = value * 60 * 60 * 1000;
      break;
    case "d": // Days
      milliseconds = value * 24 * 60 * 60 * 1000;
      break;
    case "w": // Weeks
      milliseconds = value * 7 * 24 * 60 * 60 * 1000;
      break;
    case "y":
      milliseconds = value * 365 * 24 * 60 * 60 * 1000;
      break;
    default:
      throw new Error("Unsupported duration unit");
  }

  return new Date(Date.now() + milliseconds).toString();
};

export default class TokenResponse {
  message: string;
  access_token: string;
  access_token_expires: string;
  refresh_token: string;
  refresh_token_expires: string;

  constructor(message: string, access_token: string, refresh_token: string) {
    this.message = message;
    this.access_token = access_token;
    this.access_token_expires = calculateTokenExpiry(ACCESS_TOKEN_LIFE);
    this.refresh_token = refresh_token;
    this.refresh_token_expires = calculateTokenExpiry(REFRESH_TOKEN_LIFE);
  }
}
