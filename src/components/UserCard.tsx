import type { UserData } from '../types/UserData'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

type UserCardProps = {
    userData: UserData | null,
    setUserData: Dispatch<SetStateAction<UserData | null>>,
    BASE_URL: string,
    MAIL: string
}

export default function UserCard({
    userData,
    setUserData,
    BASE_URL,
    MAIL
}: UserCardProps) {

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    
    useEffect(() => {
        async function fetchUserData() {
        try {
            setLoading(true)

            const res = await fetch(`${BASE_URL}/api/candidate/get-by-email?email=${MAIL}`)
            if (!res.ok) {
                const error = await res.text()
                setError(error)
                return
            }

            const data: UserData = await res.json()
            setUserData(data)
        } catch (error) {
            console.error(error)
            setError(error as string)
        } finally {
            setLoading(false)
        }
        }
        fetchUserData()
    }, [])

    if (!userData) {
        return (
            <>
                { loading && 'Fetching user data' }
                { error && error }
            </>
        )
    }
  
    const { lastName, firstName, email } = userData

    return (
        <div className='flex gap-4 text-sm'>
            <p>
                <span className='text-secondaryText'>Candidate:</span> <span className='font-semibold'>{lastName}, {firstName}</span>
            </p>
            <p><span className='text-secondaryText'>Email:</span> <span className='font-semibold'>{email}</span></p>
        </div>
    )
}