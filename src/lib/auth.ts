import { hash, compare } from "bcryptjs"

const salt: number = 12

export const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword = await hash(password, salt)
    return hashedPassword
}

export const comparePassword = async (password: string | undefined, hashedPassword: string | undefined): Promise<boolean> => {
    if (!password || !hashedPassword) return false
    const isSamePassword = await compare(password, hashedPassword)
    return isSamePassword
}
