import bcrypt from "bcrypt";

/**
 * Hash a plain text password using bcrypt.
 * @param plainPassword The password in plain text.
 * @param saltRounds Number of salt rounds for bcrypt (default: 10).
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(
  plainPassword: string,
  saltRounds = 10
): Promise<string> {
  return bcrypt.hash(plainPassword, saltRounds);
}

export const generateRandomKey = async (length = 32) => {
  return await crypto.randomUUID();
};

/**
 * Compare a plain text password with a hashed password.
 * @param plainPassword The input password in plain text.
 * @param hashedPassword The previously hashed password from the database.
 * @returns A promise that resolves to true if the passwords match.
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
