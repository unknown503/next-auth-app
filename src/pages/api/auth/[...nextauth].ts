import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { comparePassword } from "../../../lib/auth"
import ConnectMongo from "../../../lib/db"
import UserModel from "../../../lib/model/User"

export const nextAuthOptions: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                user: { label: "User", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials): Promise<any> {
                if (!credentials?.user || !credentials?.password) throw new Error("There was an error!")
                await ConnectMongo()
                const existingUser = await UserModel.findOne({ user: credentials.user })
                if (!existingUser) throw new Error("Incorrect credentials!")
                const samePassword = await comparePassword(credentials?.password, existingUser.password)

                if (!samePassword) throw new Error("Incorrect credentials!")
                return { name: existingUser.name, email: existingUser.id }
            },
        })
    ],
    pages: {
        signIn: "/login"
    },
}

export default NextAuth(nextAuthOptions)
