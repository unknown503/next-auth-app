import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import ConnectMongo from "../../lib/db"
import UserModel from "../../lib/model/User"

interface IResponse {
    error?: boolean,
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<IResponse>) {
    if (req.method !== "DELETE") return
    const { id } = req.body
    const token = await getToken({ req })
    if (!token) {
        res.status(200).json({ error: true, message: "Authentication failed" })
        return
    }
    try {
        await ConnectMongo()
        const result = await UserModel.findByIdAndDelete(id).exec()
        if (result) res.status(200).json({ message: `User ${result.user} deleted` })
        if (!result) res.status(400).json({ error: true, message: "That user doesn't exist." })
    } catch (err: any) {
        res.status(500).json({ error: true, message: err.message })
    }
}
