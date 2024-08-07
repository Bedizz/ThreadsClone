import { useRecoilState } from 'recoil'
import { userAtom } from './userAtoms'
import { useShowToast } from '../components/hooks/useShowToast'

const useLogout = () => {
const [user, setUser] = useRecoilState(userAtom)
const showToast = useShowToast
()
    const handleLogout = async() => {

        try {
            localStorage.removeItem('user-threads')
            //fetch request to server to logout
            const res = await fetch ("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            
            })
            const data = await res.json();
            if(data.error) return toast("Error", data.error, "error")
            setUser(null)
            
        } catch (error) {
            toast("Error", data.error, "error")
        }
    }
  return handleLogout
}

export default useLogout
