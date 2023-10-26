import * as bcrypt from 'bcrypt';

export class Password {
  /**
   * Hashes a password using bcrypt.
   * @param password - The plain text password to hash.
   * @returns A promise that resolves to the hashed password.
   */
  static async toHash(password: string): Promise<string> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error(`Error hashing password`);
    }
  }

  /**
   * Compares a stored hashed password with a supplied plain text password.
   * @param storedPassword - The stored hashed password.
   * @param suppliedPassword - The supplied plain text password.
   * @returns A promise that resolves to a boolean indicating whether the passwords match.
   */
  static async compare(
    storedPassword: string,
    suppliedPassword: string,
  ): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(suppliedPassword, storedPassword);
      return isMatch;
    } catch (error) {
      throw new Error(`Error comparing password`);
    }
  }
}
