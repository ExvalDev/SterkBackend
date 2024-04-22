import transporter from "@/config/nodemailer";
import logger from "@/config/winston";
import User from "@/models/User";
import fs from "fs";
import Handlebars from "handlebars";
import path from "path";

const SENDER = process.env.MAIL_USER;

class MailService {
  static async sendRegistrationMail(user: User) {
    try {
      const filePath = path.join(
        __dirname,
        "..",
        "static",
        "emails",
        "templates",
        "registrationMailTemplate.html"
      );
      const source = fs.readFileSync(filePath, "utf8");
      const template = Handlebars.compile(source);
      const replacements = {
        userName: user.name,
        userEmail: user.email,
      };
      const htmlToSend = template(replacements);
      await transporter.sendMail({
        from: `"TrainTrack" <${SENDER}>`,
        to: user.email,
        subject: "Thank you for registering with TrainTrack",
        html: htmlToSend,
      });

      logger.info(`Mail Verification Link sent to: ${user.email}`);
    } catch (error) {
      logger.error(error.message);
    }
  }

  static async sendResetPasswordMail(user: User, token: string) {
    try {
      const filePath = path.join(
        __dirname,
        "..",
        "static",
        "emails",
        "templates",
        "forgotPasswordMailTemplate.html"
      );
      const source = fs.readFileSync(filePath, "utf8");
      const template = Handlebars.compile(source);
      const replacements = {
        userName: user.name,
        resetLink: token,
      };
      const htmlToSend = template(replacements);
      await transporter.sendMail({
        from: `"TrainTrack" <${SENDER}>`,
        to: user.email,
        subject: "Reset Password",
        html: htmlToSend,
      });

      logger.info(`Password Reset Link sent to: ${user.email}`);
    } catch (error) {
      logger.error(error.message);
    }
  }
}

export default MailService;
