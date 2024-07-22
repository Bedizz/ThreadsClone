import { Avatar, Divider, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Portal, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import Actions from './Actions';

export default function Comment({reply,lastReply}) {


  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} size={"sm"}/>
        <Flex gap={1} w={"full"} flexDirection={"column"}>
            <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                <Text fontSize={"sm"}>{reply.username}</Text>         
        </Flex>
                <Text>{reply.text}</Text>
      </Flex>
      </Flex>
      {!lastReply ? <Divider/> : null}
    </>
  )
}
