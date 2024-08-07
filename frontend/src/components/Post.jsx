import {
  Avatar,
  Box,
  Divider,
  Flex,
  Image,
  Text, 
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useShowToast } from "./hooks/useShowToast";
import {formatDistanceToNow} from 'date-fns';
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtoms";
import { postsAtom } from "../atoms/postAtoms";
import { Actions } from "./Actions";

export const Post = ({ post,postedBy }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const toast = useShowToast();
  const currentUser = useRecoilValue(userAtom)
  const [posts,setPosts] = useRecoilState(postsAtom)
  const showToast= useShowToast();


  
  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if(!window.confirm("Are you sure you want to delete this post?")) return;
      const res = await fetch(`/api/posts/${post._id}`, {
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
      setPosts(posts.filter(p => p._id !== post._id))
    } catch (error) {
      showToast("Error", error.message, "error")
    }
  }

  useEffect(() => {
    
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${postedBy}`);
        if (!res.ok) {
          const data = await res.json();
          toast("Error", data.error, "error");
          return;
        }
        const data = await res.json();
        
        setUser(data);
      
      } catch (error) {
        toast("Error", error.message, "error");
        setUser(null);
      }
    };
    getUser();
  }, [postedBy]);

  if (!user) return null;

  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
            <Avatar
            size={"md"}
            name={user.username}
            src={user.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />          
          <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies.length === 0 && <Text textAlign={"center"} fontSize={"large"}>🥱</Text>}
          {post.replies[0] && (
            <Avatar
            size={"xs"}
            name={post.replies[0].username}
            src={post.replies[0].userProfilePic}
            position={"absolute"}
            top={"0px"}
            left={"15px"}
            padding={"2px"}
          />
          )}
          {post.replies[1] &&(
            <Avatar
            size={"xs"}
            name={post.replies[1].username}
            src={post.replies[1].userProfilePic}
            position={"absolute"}
            bottom={"0px"}
            right={"-3px"}
            padding={"2px"}
          />
          )}
            {post.replies[2] && (<Avatar
              size={"xs"}
              name={post.replies[2].username}
              src={post.replies[2].userProfilePic}
              position={"absolute"}
              bottom={"0px"}
              left={"1px"}
              padding={"2px"}
            />)}
          </Box>
        </Flex>

        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user?.name}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex
              gap={4}
              alignItems={"center"}
              onClick={(e) => e.preventDefault()}
            >
              <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                {/* here addsuffix: true adds "ago" at the end of the input ==> false returns just numbers  */}
                {formatDistanceToNow(new Date(post.createdAt), {addSuffix: true})}
              </Text>
              {currentUser?._id === user._id && (<DeleteIcon size={20} onClick={handleDeletePost}/>)}
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post.img} w={"full"} />
            </Box>
          )}
          <Flex gap={3} my={1}>
            <Actions post={post}/>
          </Flex>
          
          <Divider />
        </Flex>
      </Flex>
    </Link>
  );
};

