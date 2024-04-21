import jwt from "jsonwebtoken";
import Role from "@/models/Role";
import User from "@/models/User";
import logger from "@/config/winston";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const PASSWORD_RESET_SECRET = process.env.PASSWORD_RESET_SECRET;
const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE;
const REFRESH_TOKEN_LIFE = process.env.REFRESH_TOKEN_LIFE;
const PASSWORD_RESET_LIFE = process.env.PASSWORD_RESET_LIFE;

export const generateAccessToken = async (user: User, sessionId: string) => {
  const role = await Role.findByPk(user.roleId);
  const roleName = role ? role.name : "User";

  const access_token = jwt.sign(
    { id: user.id, role: roleName, session: sessionId },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_LIFE,
    }
  );
  logger.info(`Access token generated for user: ${user.email}`);
  return access_token;
};

export const generateRefreshToken = async (user: User, sessionId: string) => {
  const role = await Role.findByPk(user.roleId);
  const roleName = role ? role.name : "User";

  const refresh_token = jwt.sign(
    { id: user.id, role: roleName, session: sessionId },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_LIFE,
    }
  );
  logger.info(`Refresh token generated for user: ${user.email}`);
  return refresh_token;
};

export const generatePasswordResetToken = async (user: User) => {
  const password_reset_token = jwt.sign(
    { id: user.id },
    PASSWORD_RESET_SECRET,
    {
      expiresIn: PASSWORD_RESET_LIFE,
    }
  );
  logger.info(`Password reset token generated for user: ${user.email}`);
  return password_reset_token;
};
