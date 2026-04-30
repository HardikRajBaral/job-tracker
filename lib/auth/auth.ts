import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { initializeUserBoard } from "../init-user-board";
import connectDB from "../db";

const mongooseInstance = await connectDB();
const client = mongooseInstance.connection.getClient();
const db = client.db();

export const auth = betterAuth({
  baseURL: {
    // Resolve auth origin from request host for preview/prod deployments.
    allowedHosts: ["localhost:3000", "127.0.0.1:3000", "*.vercel.app"],
    fallback: process.env.BETTER_AUTH_URL,
  },
  database: mongodbAdapter(db, {
    client,
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60, // 7 days
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (user.id) {
            await initializeUserBoard(user.id);
          }
        },
      },
    },
  },
});

export async function getSession(headersList?: HeadersInit) {
  const result = await auth.api.getSession({
    headers: headersList ?? (await headers()),
  });

  return result;
}

export async function signOut() {
  const result = await auth.api.signOut({
    headers: await headers(),
  });
  if (result.success) {
    redirect("/sign-in");
  }
  return result;
}
