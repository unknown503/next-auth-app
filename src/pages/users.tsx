import { NextPage } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../types/User.type';
import { UserRow } from '../components/UserRow';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { Spinner } from '../components/Spinner';

const TableHeader: FC = () => {
  const header: string[] = ["#", "Id", "Name", "User", "Actions"];
  return (
    <>
      {
        header.map((h) => (
          <th key={uuidv4()}>{h}</th>
        ))
      }
    </>
  )
}

const Title = ({ text }: { text: string }) => <h2 className='prose text-5xl mb-8 mt-4'>{text}</h2>

const users: NextPage = () => {
  const [Users, setUsers] = useState<IUser[]>([])
  const shouldFetch = useRef<boolean>(true)
  const { data: session } = useSession()

  const deleteUser = (): void => setUsers(state => state.filter(user => user._id !== session?.user?.email))

  const FetchUsers = useCallback(
    async () => {
      const data = await fetch("http://127.0.0.1:4000/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const jsonData = await data.json()
      const users = await jsonData.users
      return users
    }, []
  )

  useEffect(() => {
    if (shouldFetch.current) FetchUsers().then(setUsers).catch(toast.error)

    return () => { shouldFetch.current = false }
  }, [shouldFetch, FetchUsers]);


  return (
    <>
      <Title text="Users" />
      {

        Users.length === 0 ?
          <div className="mt-4">
            <Spinner />
          </div>
          :
          <div className="overflow-x-auto w-full border-2 rounded-lg">
            <table className="table w-full table-zebra">
              <thead>
                <tr>
                  <TableHeader />
                </tr>
              </thead>
              <tbody>
                {
                  Users.map((user, index) =>
                    <UserRow key={user._id} userData={user} index={index} filterUser={deleteUser} myId={session?.user?.email} />
                  )
                }
              </tbody>
              <tfoot>
                <tr>
                  <TableHeader />
                </tr>
              </tfoot>
            </table>
          </div>
      }
    </>

  )
}


export default users;
