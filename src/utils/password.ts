import bcrypt from "bcryptjs";

/**
 * Password utility
 */
export class PasswordUtil {
  static async hash(password: string) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  }

  static async compare(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
