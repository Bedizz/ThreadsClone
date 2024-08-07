import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import SuggestedUser from './SuggestedUser'
import { useShowToast } from './hooks/useShowToast'

const SuggestedUsers = () => {
    const [loading, setLoading] = useState(false)
    const [suggestedUsers, setSuggestedUsers] = useState([])
const showToast= useShowToast()
console.log(suggestedUsers);


const getSuggestedUsers = async () => {
    setLoading(true)
    try {
        const res = await fetch("/api/users/suggested")
        const data = await res.json()
        if(data.error){
            showToast("Error", data.error, "error")
            return
        }
        setSuggestedUsers(data)
    } catch (error) {
        showToast("Error", error.message, "error")
    } finally {
        setLoading(false)
    }
}

useEffect(() => {
    getSuggestedUsers()

},[])

  return (
    <>
      <Text mb={4} fontWeight={"bold"}>
      Suggested Users
      </Text>
      <Flex direction={"column"} gap={4}>
        {!loading && (
            suggestedUsers.map( user => <SuggestedUser key={user._id} user={user} />)
        )}
        {loading && [...Array(5)].map((_,i) => (
            <Flex key={i} gap={2} alignItems={"center"} p={1} borderRadius={"md"}>
                <Box>
                    <SkeletonCircle size="10" />
                </Box>
                {/* //username and fullname of skeleton */}
                <Flex w={"full"} flexDirection={"column"} gap={2}>
                    <Skeleton height="8px" width="90px" />
                    <Skeleton height="8px" width="90px" />
                </Flex>
                {/* // Follow the skeleton part */}
                <Flex>
                    <Skeleton height="20px" width="60px" />
                </Flex>
            </Flex>
        ))}

      </Flex>
    </>
  )
}

export default SuggestedUsers
