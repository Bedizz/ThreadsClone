import { Avatar, Box, Button, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, VStack, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtoms";
import { Link as RouterLink } from "react-router-dom";
import { useShowToast } from "./hooks/useShowToast";

export default function UserHeader({user}) {
  const currentUser = useRecoilValue(userAtom); // this is the user logged in
  const showToast = useShowToast();
  // this following state is used to show the follow or unfollow button
    const [following,setFollowing] = useState(user.followers.includes(currentUser?._id)) 

    // this loading state is used to show the loading spinner when the user clicks the follow button
    const [loading, setLoading] = useState(false) // dont forget to add this to the follow button

    const CopyUrl = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showToast("Link copied to clipboard")
        }
        )
    }
    const handleFollow =async () => {
      if(!currentUser) {
        showToast("Please login to follow", "error")
        return;
      }
      if(loading) return;
      // this triggers the loading spinner with finally part
      setLoading(true)
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
        setLoading(false)
      }
    }


  return (
    <VStack gap={4} alignItems={"start"}>
        {/* username and avatar part */}
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>{user.name}</Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic ? (
            <Avatar name={user.name} src={user.profilePic} size={{base:"md", md:"xl"}} />)
            :
            (<Avatar name={user.name} src="https://bit.ly/broken-link" size={{base:"md", md:"xl"}} />)

          }
        </Box>
      </Flex>
      {/* --------------------- */}
      {/* ---------------------biography part------------------  */}
      <Text>{user.bio}</Text>
      // if the user is the current user, show the edit profile button
      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update" >
          <Button size={"sm"}>Edit Profile</Button>
        </Link>
      )}
      // if the user is not the current user, show the follow button
      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollow} isLoading={loading}>{ following ? "Unfollow" : "Follow"} </Button>
      )}

      {/* --------------------- */}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"}>{user.followers.length} Followers</Text>
            <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
            <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
            <Box className="icon-container">
                <BsInstagram size={24} cursor={"pointer"}/>
            </Box>
            <Box className="icon-container">
                <Menu>
                    <MenuButton>
                    <CgMoreO size={24} cursor={"pointer"}/>
                    </MenuButton>
                    <Portal>
                        <MenuList bg={"gray.dark"}>
                            <MenuItem bg={"gray.dark"} onClick={CopyUrl}>Copy Link</MenuItem>
                        </MenuList>
                    </Portal>
                </Menu>
            </Box>

        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb={"3"} cursor={"pointer"}>
            <Text fontWeight={"bold"} >Threads</Text>
        </Flex>
        <Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} color={"gray.light"} pb={"3"} cursor={"pointer"}>
            <Text fontWeight={"bold"} >Replies</Text>
        </Flex>
      </Flex>
      
    </VStack>
  );
}
