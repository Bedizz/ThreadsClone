import {
	Flex,
	Image,
	Input,
	InputGroup,
	InputRightElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spinner,
	useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { useShowToast } from "./hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import { BsFillImageFill } from "react-icons/bs";
import { usePreviewImage } from "./hooks/usePreviewImage";


const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const showToast = useShowToast();
  //here we need userId so we need selectedConversationAtom
  const selectedConversation = useRecoilValue(selectedConversationAtom);

  // We need this to update last message in the left part
  const setConversations = useSetRecoilState(conversationsAtom);

  const imageRef= useRef(null);
  const { onClose } = useDisclosure();
  const {handleImageChange,previewImage,setPreviewImage} = usePreviewImage()
  const [isSending,setIsSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !previewImage) {
      return showToast("Please enter a message or an image");
    }
    if(isSending) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
          image: previewImage,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      // here we updated the messages state by spreading the previous messages and adding the new message
      setMessages((messages) => [...messages, data]);
      // --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      // here we called setConversations and mapped through the conversations and found the one that matches the selectedConversation and updated the lastMessage
      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
      setPreviewImage("");
      setMessageText("");
      // --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    } catch (error) {
      useShowToast("Error", error.message, "error");
    } finally {
      setIsSending(false);
    }
  };
  return (
    <Flex gap={2} alignItems={"center"}>
      <form onSubmit={handleSendMessage} style={{flex:95}}>
        <InputGroup>
          <Input
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
            w={"full"}
            placeholder="Type a message"
          />
          <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
            <IoSendSharp />
          </InputRightElement>
        </InputGroup>
      </form>
      <Flex flex={5} cursor={"pointer"}>
        {/* // this is a good example. the image icon that will trigger the imageRef when clicked and will take the action of hidden input type file */}
        <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
        <Input type={"file"} hidden ref={imageRef} onChange={handleImageChange} />
      </Flex>
      <Modal
        isOpen={previewImage}
        onClose={() => {
          onClose();
          setPreviewImage("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={"full"} >
              <Image
                src={previewImage}
              />
            </Flex>
            <Flex justifyContent={"flex-end"} my={2}>
              {!isSending ? (
                <IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
              ) : (
                <Spinner size={"md"} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MessageInput;
