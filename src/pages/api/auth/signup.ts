import { NextApiRequest, NextApiResponse } from "next"
import { hashPassword } from "../../../lib/auth"
import ConnectMongo from "../../../lib/db"
import UserModel from "../../../lib/model/User"

interface ISignupResponse {
    error?: boolean,
    message: string,
    newUser?: any
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ISignupResponse>) => {
    if (req.method !== "POST") return
    const { name, user, password, repassword } = req.body
    await ConnectMongo()

    const uniqueUser = await UserModel.findOne({ user })
    if (uniqueUser) {
        res.status(400).json({ error: true, message: "User already taken" })
        return
    }
    if (password !== repassword) {
        res.status(400).json({ error: true, message: "Passwords are not the same" })
        return
    }

    const hashedPassword = await hashPassword(password)

    const newUser = new UserModel({
        name, user, password: hashedPassword
    })
    await newUser.save()
    res.status(200).json({ message: "User created", newUser })
}
export default handler