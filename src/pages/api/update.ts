import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { hashPassword } from '../../lib/auth'
import ConnectMongo from '../../lib/db'
import UserModel from "../../lib/model/User"

interface IResponse {
    error?: boolean,
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<IResponse>) {
    if (req.method !== "PATCH") return
    const { id, newName, newPassword } = req.body
    const token = await getToken({ req })
    if (!token) {
        res.status(200).json({ error: true, message: "Authentication failed" })
        return
    }
    try {
        await ConnectMongo()
        const isPasswordEmpty = newPassword.length === 0
        const user = await UserModel.findOne({ _id: id }).exec()
        user.name = newName
        if (!isPasswordEmpty) {
            const hashedPassword = await hashPassword(newPassword)
            user.password = hashedPassword
        }
        user.save()
        if (user) res.status(200).json({ message: "Information updated" })
    } catch (err: any) {
        res.status(500).json({ error: true, message: err.message })
    }
}
