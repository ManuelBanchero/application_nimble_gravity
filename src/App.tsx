import { useState } from 'react'
import type { UserData } from './types/UserData'
import UserCard from './components/UserCard'
import OpenPositions from './components/OpenPositions'
import Divider from './components/Divider'

const BASE_URL = import.meta.env.VITE_BASE_URL
const MAIL = import.meta.env.VITE_MAIL

function App() {
  const [userData, setUserData] = useState<UserData | null>(null)

  return (
    <section className="container">
        <h1 className="text-[50px] font-bold">Nimble Gravity Application</h1>
        <UserCard 
          userData={userData}
          setUserData={setUserData}
          BASE_URL={BASE_URL}
          MAIL={MAIL}
        />

        <h2 className='text-xl mt-4! font-semibold'>Open Positions</h2>

        <Divider className='mt-2'/>

        <OpenPositions 
          userData={userData}
          BASE_URL={BASE_URL}
        />
    </section>
  )
}

export default App
