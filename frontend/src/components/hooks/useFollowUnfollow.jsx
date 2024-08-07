import  { useState } from 'react'
import { useShowToast } from './useShowToast'
import { useRecoilValue } from 'recoil'
import { userAtom } from '../../atoms/userAtoms'

const useFollowUnfollow = (user) => {

    const currentUser = useRecoilValue(userAtom)
    // this following state is used to show the follow or unfollow button
    const [following,setFollowing] = useState(user.followers.includes(currentUser?._id))
    // this loading state is used to show the loading spinner when the user clicks the follow button
    const [updating,setUpdating]   = useState(false)
    const showToast = useShowToast();
    




    const handleFollow =async () => {
        if(!currentUser) {
          showToast("Please login to follow", "error")
          return;
        }
        if(updating) return;
        // this triggers the loading spinner with finally part
        
        setUpdating(true)
        try {
            const res = await fetch(`/api/users/follow/${user._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"}
  
            })
            const data = await res.json();
            if(data.error) {
              showToast("An error occured", "error")
              return;
            }
  
        
            if(following) {
              showToast("Success", `Unfollowed ${user.name}`,  "success")
              user.followers.pop(); //simulate removing from followers
  
            } else {
              showToast("Success", `Followed ${user.name}`,  "success")
              user.followers.push(currentUser?._id) //simulate adding to followers
            }
            setFollowing(!following)
            
            
        } catch (error) {
          showToast("An error occured", "error")
          
        } finally {
            setUpdating(false)
        }
      }
  return {handleFollow,updating,following}
}

export default useFollowUnfollow
