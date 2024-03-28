import passport from "passport";
import LocalStrategy from "passport-local";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { HTTP401Error, HTTP404Error } from "@/util/error";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      session: false,
    },
    async (
      email: string,
      password: string,
      done: (
        error: any,
        user?: any,
        options?: passport.AuthenticateOptions
      ) => void
    ) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
          throw new HTTP404Error("Authentication failed. User not found.");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new HTTP401Error("Authentication failed. Wrong password.");
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
