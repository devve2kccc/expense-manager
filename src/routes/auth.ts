import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const UserSchema = z.object({
  name: z.string().min(4, {
    message: "Must provide an name!",
  }),
  email: z.string().email({
    message: "Must provide an valid email!",
  }),
  password: z.string().min(4, {
    message: "Password require more than 4 characters!",
  }),
});

const LoginSchema = UserSchema.omit({ name: true });

const auth = new Hono();

auth.post("/register", zValidator("json", UserSchema), async (c) => {
  const { name, email, password } = await c.req.valid("json");

  try {
    const userExist = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (userExist !== null) {
      return c.json({ message: "Email already registed!" }, 400);
    }

    const passwordHash = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 4, // number between 4-31
    });

    const user = await db
      .insert(users)
      .values({ name, email, passwordHash })
      .returning();

    return c.json(user, 201);
  } catch (error) {
    return c.json({ message: "Error Creating the User!" });
  }
});

export default auth;
