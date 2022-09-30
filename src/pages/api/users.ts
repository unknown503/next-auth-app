import type { NextApiRequest, NextApiResponse } from 'next'
import UserModel from "../../lib/model/User"
import ConnectMongo from '../../lib/db'
import { getToken } from "next-auth/jwt"

type UsersType = {
  error?: boolean,
  message?: string,
  users?: any[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<UsersType>) {
  if (req.method !== "GET") return
  const token = await getToken({ req })
  if (!token) {
    res.status(200).json({ error: true, message: "Authentication failed" })
    return
  }

  await ConnectMongo()
  const users = await UserModel.find({}, { "password": 0, "__v": 0 }).exec()
  res.status(200).json({ users })
}
