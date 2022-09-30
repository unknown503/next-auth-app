import { Title } from "./index"
import Link from 'next/link'
import { useSession, signOut } from "next-auth/react"

export const Navbar = () => {
    const { data: session, status } = useSession()

    const logoutHandler = (): void => {
        signOut()
    }

    return (
        <div className="navbar bg-gray-700 rounded-b-lg text-gray-50">
            <div className="container mx-auto">
                <div className="flex-1">
                    <Link href="/" className="btn btn-ghost normal-case">{Title}</Link>
                </div>
                <div className="flex-none">
                    <ul className="menu menu-horizontal p-0">
                        <li><Link href="/">Inicio</Link></li>
                        {
                            !session && status !== "loading" &&
                            <>
                                <li><Link href="/login">Login</Link></li>
                                <li><Link href="/signup">Signup</Link></li>
                            </>
                        }
                        {
                            session &&
                            <>
                                <li><Link href="/users">Users</Link></li>
                                <li tabIndex={0}>
                                    <a>
                                        {session.user?.name}
                                        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
                                    </a>
                                    <ul className="p-2 bg-base-100 text-gray-800">
                                        <li><Link href="/profile">Profile</Link></li>
                                        <li><button onClick={logoutHandler}>Logout</button></li>
                                    </ul>
                                </li>
                            </>
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}
