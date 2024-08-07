import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import React, {  useEffect } from "react";
import Comment from "../Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useNavigate, useParams } from "react-router-dom";
import { useShowToast } from "../hooks/useShowToast";
import { DeleteIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../../atoms/userAtoms";
import Actions from "../Actions";
import { postsAtom } from "../../atoms/postAtoms";

export default function PostPage() {

  const {user,loading} = useGetUserProfile()
  const showToast = useShowToast()
  const {pid} = useParams()
  const currentUser = useRecoilValue(userAtom)
  const [posts,setPosts] = useRecoilState(postsAtom)
  const navigate = useNavigate();

  const currentPost = posts[0];

  const handleDeletePost = async () => {
    try {
     
      if(!window.confirm("Are you sure you want to delete this post?")) return;
      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", data.message, "success");
      navigate("/")

    } catch (error) {
      showToast("Error", error.message, "error")
    }
  }
  

  const getPosts = async () => {
    try {
      const res = await fetch(`/api/posts/${pid}`)
      const data = await res.json()
      
      if(data.error){
        showToast("Error",data.error,"error")
        return;
      }
      console.log(data);
      setPosts([data])
      
    } catch (error) {
      showToast("Error",error.message,"error")
    }
  }


  useEffect(() => {
    getPosts()
    
  },[pid,setPosts])
  


  if (!user && loading) {
    return (
      <Flex justify="center">
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if(!currentPost) return null;



  return (
    <>
      <Flex >
        <Flex w={"full"} alignItems={"center"} gap={3} >
          {/* in order to get an access to public file, we need to add / in src part. */}
          <Avatar size={"md"} name={user?.name} src={user?.profilePic} />
          <Flex>
            <Text fontSize={"sm"}>{user?.username}</Text>
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Flex>
        </Flex>
        <Flex
              gap={4}
              alignItems={"center"}
              onClick={(e) => e.preventDefault()}
            >
              <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                {/* here addsuffix: true adds "ago" at the end of the input ==> false returns just numbers  */}
                {formatDistanceToNow(new Date(currentPost.createdAt), {addSuffix: true})}
              </Text>
              {currentUser?._id === user._id && (<DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost}/>)}
            </Flex>  
      </Flex>
      <Text mt={5}>{currentPost.text}</Text>
      {currentPost.img && ( <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
            <Image src={currentPost.img} w={"full"}/>
        </Box>)}
        <Flex gap={3} my={3}>
          <Actions post={currentPost}/>
        </Flex>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"} fontSize={"sm"}>{currentPost.replies.length} replies</Text>
          <Box borderRadius={"full"} w={0.5} h={0.5} bg={"gray.light"} ></Box>
          <Text color={"gray.light"} fontSize={"sm"}>{currentPost.likes.length}  likes</Text>
        </Flex>
        <Divider my={4}/>
        <Flex justifyContent={"space-between"}>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"2xl"}>👋</Text>
            <Text color={"gray.light"}> Get the app to like,reply and post</Text>
          </Flex>
          <Button>Get</Button>
        </Flex>
        <Divider my={4}/>
        {currentPost.replies.map((reply) => (
          <Comment 
          key={reply._id}
          reply={reply}
          // how to check if the last reply is the last one and if it is the last one, then don't show the divider
          lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
          />
          ))}
        
    </>
  );
}
