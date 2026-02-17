import type { JobPosition } from '@/types/JobPosition'
import type { UserData } from '../types/UserData'
import { SkeletonText } from './ui/skeletonText'
import { useEffect, useState } from 'react'
import PositionCard from './PositionCard'

type OpenPositionsProps = {
    userData: UserData | null,
    BASE_URL: string
}

export default function OpenPositions({
    userData,
    BASE_URL
}: OpenPositionsProps) {

    const [jobPositions, setJobPositions] = useState<JobPosition[] | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!userData) return

        async function fetchJobPositions() {
            try {
                setLoading(true)
                const res = await fetch(`${BASE_URL}/api/jobs/get-list`)
                if (!res.ok) {
                    const error = await res.text()
                    setError(error)
                    return
                }
                const data: JobPosition[] = await res.json()
                setJobPositions(data)
            } catch (error) {
                console.error(error)
                setError(error as string)
            } finally {
                setLoading(false)
            }
        }
        fetchJobPositions()
    }, [userData])

    if (!userData || loading) {
        return (
            <div className='mt-8 grid grid-cols-3 gap-4'>
                {new Array(9).fill(0).map((_el, i) => <SkeletonText key={i}/>)}
            </div>
        )
    }

    return (
        <>
            { error && error }
            <div className="flex flex-wrap justify-between gap-4 mt-4">
                { jobPositions?.map(position => (
                    <PositionCard 
                        key={position.id}
                        id={position.id}
                        title={position.title}
                        BASE_URL={BASE_URL}
                        userData={userData}
                    />
                ))}
            </div>
        </>
    )
}