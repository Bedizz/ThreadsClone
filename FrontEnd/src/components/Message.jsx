import { Avatar, Box, Flex, Text,Image, Skeleton } from "@chakra-ui/react";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { userAtom } from "../atoms/userAtoms";
import { BsCheck2All } from "react-icons/bs";

const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          {/* // here we are checking if the message has text or image and displaying it accordingly for the user */}
          {/* // give true and false to the conditions in other to display the message */}
          {message.text && (
            <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
            <Text color={"white"} >
              {message.text}
            </Text>
            <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
              <BsCheck2All size={16}/>
            </Box>
            </Flex>
          )}
          {/* // when the image is not rendered %100, it doesnt scrool down the page. to prevent that, we use original image with skeleton and we connect the image with imageLoaded state. when its rendered %100, we set the imageLoaded to true and we render second image with the same source. */}
          {message.image && !imageLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.image} hidden onLoad={()=> setImageLoaded(true)} alt="Message Image" borderRadius={4}/>
                <Skeleton isLoaded={imageLoaded} w={"200px"} h={"200px"} />
            </Flex>
          )}
            {message.image && imageLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.image}  alt="Message Image" borderRadius={4}/>
              <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
              <BsCheck2All size={16}/>
            </Box>
                
            </Flex>
          )}
            <Avatar src={user.profilePic} w={7} h={7} />
          
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar src={selectedConversation.userProfilePic} w={7} h={7} />
          {/* // here we are checking if the message has text or image and displaying it accordingly for the opposite user */}
            {message.text && (
                        <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"}>
                        {message.text}{" "}
                      </Text>
            )}
            {message.image && !imageLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.image} hidden onLoad={()=> setImageLoaded(true)} alt="Message Image" borderRadius={4}/>
                <Skeleton isLoaded={imageLoaded} w={"200px"} h={"200px"} />
            </Flex>
          )}
            {message.image && imageLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.image}  alt="Message Image" borderRadius={4}/>              
            </Flex>
          )}
            
          
        </Flex>
        
      )}
    </>
  );
};

export default Message;
Message;
