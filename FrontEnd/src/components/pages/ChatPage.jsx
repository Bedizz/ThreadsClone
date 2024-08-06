import { SearchIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Conversation from '../Conversation'
import MessageContainer from '../MessageContainer'
import {useShowToast} from "../hooks/useShowToast"
import { useRecoilState, useRecoilValue } from 'recoil'
import { conversationsAtom, selectedConversationAtom } from '../../atoms/messagesAtom'
import {GiConversation} from "react-icons/gi"
import { userAtom } from '../../atoms/userAtoms'
import { useSocket } from '../../context/SocketContext'


const ChatPage = () => {
    const showToast = useShowToast()
    const [loadingConversations,setLoadingConversations] = useState(true)
    const [conversations,setConversations] = useRecoilState(conversationsAtom)
    const [selectedConversation,setSelectedConversation] = useRecoilState(selectedConversationAtom)
    const [searchingUser,setSearchingUser] = useState(false)
    const [searchText,setSearchText] = useState("")
    const currentUser = useRecoilValue(userAtom)
    const {socket,onlineUsers} = useSocket()


    useEffect(()=> {
        socket?.on("messagesSeen",({conversationId}) => {
            setConversations(prev => {
                const updatedConversations = prev.map(conversation => {
                    if(conversation._id === conversationId) {
                        return {
                            ...conversation,
                            lastMessage: {
                                ...conversation.lastMessage,
                                seen: true
                            }
                        }
                    }
                    return conversation
                })
                return updatedConversations
            })
        })
    },[socket,setConversations])


    const getConversations = async () => {
        try {
            const res = await fetch("/api/messages/conversations")
            const data = await res.json()
            if(data.error) return showToast("Error",error.message,"error")
            setConversations(data)
        } catch (error) {
            showToast("Error", error.message,"error")
        } finally {
            setLoadingConversations(false)
        }

    }
    const handleConversationSearch = async (e) => {
        e.preventDefault();
        setSearchingUser(true)
        try {
            const res = await fetch(`/api/users/profile/${searchText}`)
            const searchedUser = await res.json();
            if(searchedUser.error){ 
                return showToast("Error",searchedUser.error,"error")
            }
            // here we check if the user searches his own name and tries to start a conversation with himself
            // this const helps people to understand the logic of the code
            const messagingHimself = searchedUser._id === currentUser._id
            if(messagingHimself) {
                showToast("Error","You cannot start a conversation with yourself","error") 
                setSearchingUser(false)
                return;
            }
            // here we check if the user has already started a conversation with the searched user
            // this const helps people to understand the logic of the code
            const conversationExists = conversations.find(con => con.participants[0]._id === searchedUser._id )

            if(conversationExists) {
                setSelectedConversation({
                    // _id: conversations.find(con => con.participants[0]._id === searchedUser._id)._id, alternative way to get the conversation id
                    _id: conversationExists._id,
                    userId : searchedUser._id,
                    username: searchedUser.username,
                    profilePic: searchedUser.profilePic
                })
                return;
            }

            const mockConversation = {
                mock: true,
                lastMessage: {
                    text: "",
                    sender:"",
                },
                _id:Date.now(),
                participants: [
                    {
                        _id: searchedUser._id,
                        username: searchedUser.username,
                        profilePic: searchedUser.profilePic
                    },
                ],
            };

            setConversations((prevConvs) =>[...prevConvs, mockConversation] )


            
        } catch (error) {   
            showToast("Error",error.message,"error")
            
        } finally {
            setSearchingUser(false)
            setSearchText("")
        }
    }


    useEffect(()=> {
        getConversations() 

    },[setConversations])
  return (
    <Box position={"absolute"}  left={"50%"} w={{
        base: "100%",
        md: "80%",
        lg: "750px"
    }}
    p={4} 
    transform={"translateX(-50%)"} >
        <Flex 
        gap={4}
        // to do it responsive,use an object 
        flexDirection={{
            base: "column",
            md: "row"
        }}
        maxW={{
            sm:"400px",
            md:"full"
        }}
        //it will take it to the center in small screens
        mx={"auto"}>
            <Flex flex={30} flexDirection={"column"} maxW={{ sm: "250px", md:"full"}} mx={"auto"}>
                <Text fontWeight={700} color={useColorModeValue("gray.600","gray.400")}>
                Conversations
                </Text>
                <form onSubmit={handleConversationSearch}>
                    <Flex alignItems={"center"} gap={2}>
                        <Input placeholder="Search a user" onChange={(e) => setSearchText(e.target.value)} value={searchText}  />
                        <Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}><SearchIcon/></Button>  
                    </Flex>
                </form>
                {loadingConversations &&  [1,2,3,4,5].map((item) => (
                <Flex key={item} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"} >
                    <Box>
                        <SkeletonCircle size="10" />
                    </Box>
                    <Flex w={"full"} flexDirection={"column"} gap={3}>
                        <Skeleton h={"10px"} w={"80px"}/>
                        <Skeleton h={"8px"} w={"90%"}/>
                    </Flex>
                </Flex>    
                ))}
                {!loadingConversations && (
                    conversations.map((conversation)=> (
                        <Conversation key={conversation._id} isOnline={onlineUsers.includes(conversation.participants[0]._id)} conversation={conversation} />
                        
                    ))
                )}
            </Flex>
            {!selectedConversation._id && (
                <Flex 
                flex={70}
                borderRadius={"md"}
                p={2}
                flexDirection={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                height={"400px"}>
                    <GiConversation size={200}/>
                    <Text>Select a conversation to start messaging</Text>
                </Flex>
            )}
            {selectedConversation._id && (
                <MessageContainer />
            )}
            

        </Flex>
      
    </Box>
  )
}

export default ChatPage
