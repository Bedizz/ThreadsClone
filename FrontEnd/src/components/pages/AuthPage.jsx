import React from 'react'
import SignupCard from '../SignupCard'
import LoginCard from '../LoginCard'
import { useRecoilValue } from 'recoil'
import { authScreenAtom } from '../../atoms/authAtoms'

export default function AuthPage() {
    const authScreen = useRecoilValue(authScreenAtom)
  return (
    <div>
        {authScreen === 'login' ? <LoginCard/> : <SignupCard/>}
      
    </div>
  )
}
