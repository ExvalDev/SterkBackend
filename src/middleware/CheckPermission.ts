import User from "@/models/User";
import { Role } from "@/types/enums/Role";
import { HTTP403Error } from "@/utils/error";
import { Request } from "express";

const ERROR_MESSAGE = "You do not have permission to access this resource";

const checkPermission = async (
  req: Request,
  requestedResourceOwnerId: number
) => {
  const requester = req.body.user;
  switch (req.body.user.role) {
    case Role.ADMIN:
      return true;
    case Role.STUDIO_OWNER: {
      if (requester.studioId === requestedResourceOwnerId) {
        return true;
      }
      throw new HTTP403Error(ERROR_MESSAGE);
    }
    case Role.USER: {
      if (requester.id === requestedResourceOwnerId) {
        return true;
      }
      throw new HTTP403Error(ERROR_MESSAGE);
    }
    default:
      throw new HTTP403Error(ERROR_MESSAGE);
  }
};

export default checkPermission;
