import React, { useEffect, useState } from 'react'
import UserHeader from '../UserHeader'

import { useParams } from 'react-router-dom'
import { useShowToast } from '../hooks/useShowToast'
import { Flex, Spinner } from '@chakra-ui/react'
import {Post} from "../Post"
import useGetUserProfile from '../hooks/useGetUserProfile'
import { useRecoilState } from 'recoil'
import { postsAtom } from '../../atoms/postAtoms'

export const UserPage = () => {

  const {user,loading} = useGetUserProfile()
  const showToast = useShowToast()
  const {username} = useParams()
  const [posts, setPosts] = useRecoilState(postsAtom)
  const [fetchingPosts,setFechingPosts] = useState(true)
  
 
  
  const getPosts = async () => {
    setFechingPosts(true)
    try {
      const res= await fetch(`/api/posts/user/${username}`)
      const data = await res.json()
      if(data.error){
        showToast("Error",data.error,"error")
        return;
      }
      setPosts(data)
      
    } catch (error) {
      showToast("Error",error.message,"error")
      setPosts([])
      
    } finally {
      setFechingPosts(false)
    }
  }
  // Fetch user data from the backend every time the username changes
  useEffect(() => {
    getPosts()
  }
  ,[username,setPosts])
  console.log("posts is here and it is recoil state", posts);

  if(!user && loading) {
    return (
      <Flex justify="center" >
        <Spinner size={"xl"}/>
      </Flex>
    )
      
    
  }
  if(!user ) {
    return (
      <Flex justify="center" >
        <h1>User not found</h1>
      </Flex>
    
    ) }

    return (
      <>
        <UserHeader user={user}/>
        {!fetchingPosts && posts.length === 0 && <h1>No posts yet</h1>} 
        {fetchingPosts && (
          <Flex justify={"center"}>
            <Spinner size={"xl"} />
          </Flex>
        )}
        {posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy}  />
        ))}
        
      </>
    )


}
