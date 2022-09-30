import { useCallback } from "react"
import { IUser } from "../types/User.type"
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'
import { deleteUserEndpoint } from "../lib/deleteUser";

interface IUserRow {
    userData: IUser,
    index: number,
    myId?: string | null,
    filterUser: (id: string) => void
}

export const UserRow = (data: IUserRow) => {
    const { _id, name, user }: IUser = data.userData
    const router = useRouter()

    const deleteUser = useCallback(
        async (): Promise<void> => {
            data.filterUser(_id)
            const res = await deleteUserEndpoint(_id)
            if (res.error) toast.error(res.message)
            if (!res.error) toast.success(res.message)
        }, []
    )

    return (
        <tr className="hover">
            <th>{data.index + 1}</th>
            <td>{_id}</td>
            <td>{name}</td>
            <td>
                {user}
                <br />
                <span className="badge badge-neutral badge-sm">User</span>
            </td>
            <th>
                {
                    data.myId !== _id ?
                        <button className="btn btn-error btn-xs" onClick={deleteUser}>Delete</button>
                        : <button className="btn btn-success btn-xs" onClick={() => router.push("/profile")}>Profile</button>
                }
            </th>
        </tr>
    )
}
