import NextAuth, { DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from 'next-auth/jwt';
import { NextAuthOptions } from "next-auth"

const handler: NextAuthOptions = NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
    ],
    session: {
      strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: 
    {
      async signIn({ user, account, profile }) {
        try {
          if (account?.provider === "google") {
            // Handle Google sign-in
            const userExistsResponse: Response = await fetch(`http://localhost:8080/api/users/exists?email=${profile?.email}`);
    
            if (userExistsResponse.status === 404) {
              // Send Google user data to your backend
              const response: Response = await fetch('http://localhost:8080/api/users', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: user.email,
                  name: user.name,
                  username: user.name,
                  image: user.image,
                }),
              });
    
              if (!response.ok) {
                throw new Error('Failed to save Google user data to backend');
              }
              if (response.ok){
                const userDataResponse = await response.json();
                user.name = userDataResponse.name;
                console.log("User Data Response: ", userDataResponse)
                
              }
            }
            else{
              const userExistsDataResponse = await userExistsResponse.json();
              user.name = userExistsDataResponse.name;
            }
          } 
          // Return true if everything is successful
          return true;
    
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      },
      async session({ session, token  }) {
        if (session.user) {
          session.user.username = token.username as string
        }
        return session;
      },
     
    },
    
  });
  
  export { handler as GET, handler as POST }
