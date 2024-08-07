import {  Box, Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { useShowToast } from "../hooks/useShowToast";
import { Post } from "../Post";
import { useRecoilState } from "recoil";
import { postsAtom } from "../../atoms/postAtoms";
import SuggestedUsers from "../SuggestedUsers";


export default function Homepage() {

	const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();

      // how to fetch feeds
  const getFeeds = async () => {
    setLoading(true);
    //without that, when we go to another page and come back, we will see the old posts
    setPosts([]);
    try {
      const res = await fetch("/api/posts/feeds");
      const data = await res.json();
      // check if the response is ok
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setPosts(data);
    } catch (error) {
      return showToast("Error", error.message, "error")}
      finally {
        setLoading(false);
      } 
    }


  useEffect(() => { 

    
    
    getFeeds();
  }, [setPosts]);


  return (
    // alignitems start is for the suggested users because it covers how many users we have and shapes itself accordingly
    <Flex gap={"10"} alignItems={"start"}>
    <Box flex={70}>
    <Flex gap='10' alignItems={"flex-start"}>
    <Box flex={70}>
    {loading && (
      <Flex justify={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    ) }
    {!loading &&  posts.length=== 0 && <h1>Follow some users to see what's going on</h1>}
    {posts.map((post) => ( <Post key={post._id} post={post} postedBy={post.postedBy}  />  ))}
    </Box>
		</Flex>
    </Box>
    {/* // here we can hide the suggested users on mobile */}
    <Box flex={30} display={{
      base: "none",
      md: "block",
    }} >
      <SuggestedUsers/>
    </Box>

    </Flex>
  );
}
