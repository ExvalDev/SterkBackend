import jwt from "jsonwebtoken";
import Role from "@/models/Role";
import User from "@/models/User";
import logger from "@/config/winston";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE;
const REFRESH_TOKEN_LIFE = process.env.REFRESH_TOKEN_LIFE;

export const generateAccessToken = async (user: User) => {
  const role = await Role.findByPk(user.roleId);
  const roleName = role ? role.name : "User";

  const access_token = jwt.sign(
    { id: user.id, role: roleName },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_LIFE,
    }
  );
  logger.info(`Access token generated for user: ${user.email}`);
  return access_token;
};

export const generateRefreshToken = async (user: User) => {
  const role = await Role.findByPk(user.roleId);
  const roleName = role ? role.name : "User";

  const refresh_token = jwt.sign(
    { id: user.id, role: roleName },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_LIFE,
    }
  );
  logger.info(`Refresh token generated for user: ${user.email}`);
  return refresh_token;
};
