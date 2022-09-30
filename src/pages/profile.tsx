import { useSession, signOut } from "next-auth/react"
import { useCallback, useRef, useState } from "react"
import { Spinner } from "../components/Spinner"
import { toast } from 'react-toastify';
import { UpdateForm } from "../components/UpdateForm";
import { deleteUserEndpoint } from "../lib/deleteUser";

const profile = () => {
    const { data: session, status } = useSession()

    const deleteAccount = useCallback(
        async (): Promise<void> => {
            if (!session?.user?.email) return
            const res = await deleteUserEndpoint(session?.user?.email)
            if (res.error) toast.error(res.message)
            if (!res.error) {
                signOut()
                toast.success("Account deleted.")
            }
        }, []
    )

    return (
        <>
            {
                status === "loading" || status === "unauthenticated" || !session?.user?.name || !session?.user?.email ? (
                    <Spinner />
                ) : (
                    <div className="card w-96 bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title flex-col">
                                <span className="prose text-5xl pb-2">{session?.user?.name}</span>
                                <div className="badge badge-secondary">New user</div>
                            </h2>
                            <UpdateForm id={session?.user?.email} name={session?.user?.name} />
                            <div className="card-actions justify-end mt-5">
                                <button className="btn btn-info btn-sm gap-2" form="updateForm" type="submit">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                    Update
                                </button>
                                <label className="btn btn-error btn-sm gap-2" htmlFor="delete-modal">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    Delete
                                </label>
                            </div>
                        </div>
                        <input type="checkbox" id="delete-modal" className="modal-toggle" />
                        <div className="modal">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">You are deleting your account!</h3>
                                <p className="py-4">It is permanent, are you sure?</p>
                                <div className="modal-action">
                                    <button onClick={deleteAccount} className="btn btn-error">Just delete it!</button>
                                    <label htmlFor="delete-modal" className="btn">Nope</label>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
export default profile