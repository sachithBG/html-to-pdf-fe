import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"; // Example provider
import CredentialsProvider from "next-auth/providers/credentials";
import { signInUser } from "@/app/services/authService";

let dynamicMaxAge = 60 * 60 * 24; // Default to 24 hours

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("Credentials are required");
        }

        const { email, password, rememberMe }: any = credentials;
        console.log(rememberMe, 'Remember me');
        try {
          let result: any = await signInUser(email, password, rememberMe);
          // console.log(result.data.token, 'Token received from the backend');

          if (!result.data.token) {
            throw new Error("Invalid token");
          }

          // Set maxAge based on rememberMe
          dynamicMaxAge = rememberMe + '' == 'true' ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 days or 24 hours

          // Attach the user and token to the response object
          const userWithToken = result.data;
          return userWithToken;
        } catch (error: any) {
          if (error.status === 401) {
            throw new Error("Invalid credentials");
          } else {
            throw new Error(error.response?.data?.error || 'An error occurred during signin.');
          }
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: dynamicMaxAge,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        return user;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.user = {
          id: token.user?.id,
          token: token.token,
          name: token.user?.name,
          email: token.user?.email,
          role: token.user?.role,
          avatar: token.user?.profile?.avatar,
          theme: token.user?.profile?.theme,
        };
      }
      // console.log(dynamicMaxAge, 'Dynamic max age');
      session.maxAge = dynamicMaxAge;
      session.expires = new Date(Date.now() + dynamicMaxAge * 1000).toISOString();
      return session;
    },
  },
};
