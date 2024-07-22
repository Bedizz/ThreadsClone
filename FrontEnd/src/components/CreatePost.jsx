import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { usePreviewImage } from "./hooks/usePreviewImage";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtoms";
import { useShowToast } from "./hooks/useShowToast";
import { postsAtom } from "../atoms/postAtoms";
import { useParams } from "react-router-dom";

const  MAX_CHARS = 500

export const CreatePost = () => {
    const showToast = useShowToast()
   const user = useRecoilValue(userAtom)
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [postText, setPostText] = useState("");
   const { handleImageChange, previewImage, setPreviewImage } =
   usePreviewImage();
   const imageRef = useRef(null);
   const [remainingChar, setRemainingChar] = useState(MAX_CHARS)
   const [loading, setLoading] = useState(false)
   const [posts,setPosts] = useRecoilState(postsAtom)
   const {username} = useParams()


  const handleTextChange = (e) => {
    const text = e.target.value;
    if(text.length > MAX_CHARS) {
      const truncatedText = text.slice(0,MAX_CHARS)
      setPostText(truncatedText)
      setRemainingChar(0)
    } else {
        setPostText(text)
        setRemainingChar(MAX_CHARS - text.length)
    }
  };
  const handlePost = async() => {
    if(loading) return;
    setLoading(true)
    try {
        const res = await fetch("/api/posts/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({postedBy: user._id , text: postText, img: previewImage})
        })
        const data = await res.json()
        if(data.error) {
            console.log(data.error)
            return
        }
        console.log(data)
        showToast("Success","Post created successfully","success")
        if(username === user.username) {
          setPosts([data,...posts])
        }
        onClose()
        setPostText("")
        setPreviewImage(null)
    } catch (error) {
        showToast("An error occured", "error")
        console.log(error)
        
    }finally{
        setLoading(false)

    
    }
  }
  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={10}
        leftIcon={<AddIcon />}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
      >
        Create Post
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Write something..."
                onChange={handleTextChange}
                value={postText}
              />

              <Text
                fontSize={"xs"}
                fontWeight={"bold"}
                textAlign={"right"}
                m={"1"}
                color={"gray.900"}
              >
                {remainingChar}/{MAX_CHARS}
              </Text>
              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>
            {previewImage && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <img src={previewImage} alt="preview" />
                <CloseButton
                  position={"absolute"}
                  right={2}
                  top={2}
                  onClick={() => setPreviewImage(null)}
                  bg={"gray.800"}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>

            <Button colorScheme="blue" onClick={handlePost} isLoading={loading}>Post</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
