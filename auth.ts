import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { api } from "./lib/api";
import bcrypt from "bcryptjs";
import { ILawyerDoc } from "./database/lawyer.model";
import { SignInSchema } from "./lib/validations";
import { IAccountDoc } from "./database/account.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const { data: existingLawyerAccount } = (await api.accounts.getByProvider(
            email
          )) as ActionResponse<IAccountDoc>;

          if (!existingLawyerAccount) return null;

          const { data: existingLawyer } = (await api.lawyers.getById(
            existingLawyerAccount.userId.toString()
          )) as ActionResponse<ILawyerDoc>;

          if (!existingLawyer) return null;

          const isValidPassword = await bcrypt.compare(
            password,
            existingLawyerAccount.password!
          );

          if (isValidPassword) {
            return {
              id: existingLawyer.id,
              name: existingLawyer.name,
              email: existingLawyer.email,
              role: existingLawyer.role,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      const { data: lawyer } = await api.lawyers.getById(token.sub as string) as ActionResponse<ILawyerDoc>;
      if (lawyer) {
        session.user.role = lawyer.role;
      } else {
        session.user.role = "guest";
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } =
          (await api.accounts.getByProvider(
            account.type === "credentials"
              ? token.email!
              : account.providerAccountId
          )) as ActionResponse<IAccountDoc>;
        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if (userId) token.sub = userId.toString();
      }

      return token;
    },
    async signIn({ user, account }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      const lawyerInfo = {
        name: user.name!, // Assuming the name is available
        email: user.email!,
        username: user.name!.toLowerCase().replace(/\s+/g, ""), // Example of creating username from name
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      };

      const { success } = (await api.auth.oAuthSignIn({
        user: lawyerInfo,
        provider: account.provider as "google",  // You can extend to other providers
        providerAccountId: lawyerInfo.providerAccountId,
      })) as ActionResponse;

      if (!success) return false;

      return true;
    },
  },
});
