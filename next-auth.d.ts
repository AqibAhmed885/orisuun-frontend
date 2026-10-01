import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string; // Add accessToken
    user: {
      email?: string;
      name?: string;
      image?: string;
    };
  }

  interface JWT {
    accessToken?: string; // Add accessToken
    idToken?: string; // Add idToken
    email?: string;
    name?: string;
    picture?: string;
  }
}
