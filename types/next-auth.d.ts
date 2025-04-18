import "next-auth";
import { DefaultSession } from "next-auth";

// Extend the User interface to include the role
declare module "next-auth" {
  interface User {
    role: "admin" | "lawyer" | "guest" | "";
  }

  // Extend the Session interface to include the user object with role and id
  interface Session {
    user: {
      id: string;
      role: "admin" | "lawyer" | "guest" | "";
    } & DefaultSession["user"];
  }

  // If needed, you can also extend the JWT type
  // interface JWT {
  //   sub: string;
  //   role: "admin" | "lawyer" | "guest" | "";
  // }
}
