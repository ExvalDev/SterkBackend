import { Role } from "@/types/Role";
import { HTTP403Error } from "@/utils/error";

const CheckRole = (roles: Role[]) => (req, res, next) => {
  if (!req.body.user) {
    throw new HTTP403Error("Authentication required");
  }

  const userRole = req.body.user.role;
  if (!roles.includes(userRole)) {
    throw new HTTP403Error(
      "You do not have permission to access this resource"
    );
  }

  next();
};
export default CheckRole;
