import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user?.password) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          stripePlan: user.stripePlan,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      const typedToken = token as typeof token & { id?: string; stripePlan?: string };
      if (user) {
        typedToken.id = user.id;
        typedToken.stripePlan = user.stripePlan;
      }
      return typedToken;
    },
    session({ session, token }) {
      const typedToken = token as typeof token & { id?: string; stripePlan?: string };
      if (session.user && token.sub) {
        session.user.id = typedToken.id ?? token.sub;
        session.user.stripePlan = typedToken.stripePlan;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
