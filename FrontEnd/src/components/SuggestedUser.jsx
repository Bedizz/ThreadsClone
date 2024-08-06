import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import useFollowUnfollow from './hooks/useFollowUnfollow'

const SuggestedUser = ({user}) => {
const { following,loading,handleFollow } = useFollowUnfollow(user)
  return (
    <>
                <Flex gap={2} alignItems={"center"} justifyContent={"space-between"} >
                    {/* LeftSide */}
                <Flex gap={2} as={Link} to={`${user.username}`}>
                    <Avatar  src={user.profilePic} />
                    <Box>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            {user.name} 
                        </Text>
                        <Text color={"gray.light"} fontSize={"sm"}>
                            {user.username} 
                        </Text>
                    </Box>
                </Flex>
                {/* //rightside */}
                <Button
                size={"sm"}
                color={following ? 'black' : "white"}
                bg={following ? 'white' : "blue.400"}
                onClick={handleFollow}
                isLoading={loading}
                _hover = {{
                    color: following ? "black" : "white",
                    opacity: "0.8",

                }}
                 >
                    {following ? "Following" : "Follow"}
                    
                </Button>

            </Flex>
      
    </>
  )
}

export default SuggestedUser

