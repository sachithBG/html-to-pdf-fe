import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"; // Example provider
import CredentialsProvider from "next-auth/providers/credentials";
// import { signInUser } from "@/app/services/authService";
// export const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
// import axios from "axios";

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

        const { email, password, rememberMe, token, user }: any = credentials;
        // console.log(rememberMe, 'Remember me1');
        // console.log(rememberMe, 'Remember me1');
        // console.log(email, 'email');
        // console.log(baseURL, 'baseURL');
        try {
          // const result: any = await axios.post(`${baseURL}v1/users/login`, { email, password, rememberMe });
          // signInUser(email, password, rememberMe);
          // console.log(result.data.token, 'Token received from the backend');
          let user_ = { email, password, rememberMe, token };
          if (user) {
            user_ = {...user_, ...JSON.parse(user)};
            // console.log(user_.id, 'result');
          }
          
          // console.log(result.id, 'result');
          if (!token) {//result.data.token
            throw new Error("Invalid token");
          }

          // Set maxAge based on rememberMe
          dynamicMaxAge = rememberMe + '' == 'true' ? 60 * 60 * 24 * 30 : 60 * 60 * 24; // 30 days or 24 hours

          // Attach the user and token to the response object

          return {
            token: token,
            user: user_, // Returning the user data
          } as any;
        } catch (error: any) {
          console.error(error);
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
      console.log(dynamicMaxAge, 'Dynamic max age');
      session.maxAge = dynamicMaxAge;
      session.expires = new Date(Date.now() + dynamicMaxAge * 1000).toISOString();
      return session;
    },
  },
  // pages: {
  //   error: '/auth/error' // Custom error page to handle sign-in errors
  // },
};
