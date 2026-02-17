import type { UserData } from "@/types/UserData"
import { useActionState, useState } from "react"

type APIResponse = {
    ok: boolean
}

type PositionCardProps = {
    id: string,
    title: string,
    BASE_URL: string,
    userData: UserData
}

type ActionState = { error?: string } | null

export default function PositionCard({
    id,
    title,
    BASE_URL,
    userData
}: PositionCardProps) {

    const [success, setSuccess] = useState<boolean>(false)
    const [error, submitAction, isPending] = useActionState<ActionState, FormData>(
        async (_previousState, formData: FormData) => {
            try {
                const repository = formData.get('repository')?.toString()
                if (!repository)
                    return { error: 'Must include the repository' }
                if (repository.length < 19)
                    return { error: 'The URL length is not valid' }

                const res = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }, 
                    body: JSON.stringify({
                        uuid: userData.uuid,
                        jobId: id,
                        candidateId: userData.candidateId,
                        repoUrl: repository
                    })
                })

                if (!res.ok) {
                    const error = await res.text()
                    return { error }
                }

                const data: APIResponse = await res.json()
                if (!data.ok)
                    return { error: 'The submit was ok, but was not successfully.' }

                setSuccess(true)
            
                return null
            } catch {
                return { error: 'Unexpected error occurred.' }
            }
        }, null)

    return (
        <div className="border-[0.5px] border-secondaryText p-8">
            <p className="text-secondaryText text-sm">ID: {id}</p>
            <p className="font-semibold mt-2! mb-4! text-lg">{title}</p>
            <form 
                action={submitAction}
                className="flex flex-col"
            >
                <label 
                    htmlFor="repository"
                    className="text-secondaryText mb-2!"
                >Github Repository</label>
                <input 
                    type="text"
                    id="repository"
                    name="repository"
                    placeholder="https://github.com/..."
                    className="border-b-1 border-secondaryText focus:outline-none focus:border-b-2 focus:border-gray-400"
                />
                {
                    !success ? (
                        <button 
                            className="w-[300px] bg-primaryText text-white mt-4! p-2 cursor-pointer hover:bg-[#282828]"
                        >
                            {isPending ? 'Submiting Application' : 'Submit Application'}
                        </button>
                    ) : (
                        <div
                            className="w-[300px] bg-green-200 text-white mt-4! p-2"
                        >
                            Application submitted
                        </div>
                    )
                }

                { error && <p className="text-red-300">{error.error}</p>}
            </form>
        </div>
    )
}