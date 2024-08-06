import { Flex, Image, useColorMode,Link, Button, Center, Container, Box } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { userAtom } from '../atoms/userAtoms'
import { Link as RouterLink } from 'react-router-dom'
import { AiFillHome } from 'react-icons/ai'
import {  RxAvatar } from 'react-icons/rx'
import { FiLogOut } from 'react-icons/fi'
import useLogout from '../atoms/useLogout'
import { authScreenAtom } from '../atoms/authAtoms'
import { BsFillChatQuoteFill } from 'react-icons/bs'
import { MdOutlineSettings } from 'react-icons/md'
 

export default function Header() {
  // toogleColorMode is a function that changes the color mode of the application
  //colorMode is a string that represents the current color mode of the application
  const { colorMode,toggleColorMode } = useColorMode()
  const user = useRecoilValue(userAtom)
  const logout = useLogout()
  const setAuthScreen = useSetRecoilState(authScreenAtom)


  
  return (
    <Box position={"relative"} w="full" >
       {/* Container is a layout component that allows you to align items in a flex container */}
      <Container maxW="620px">
        {user ? (
          <Flex justifyContent={"space-between"} mt={6} mb="12">
            <Link as={RouterLink} to={"/"}>
              <AiFillHome size={24} />
            </Link>
  
            <Image
              cursor={"pointer"}
              w={6}
              alt='Threads Logo'
              onClick={toggleColorMode}
              src={colorMode === "light" ? "/dark-logo.svg" : "/light-logo.svg"}
            />
  
            <Flex alignItems={"center"} gap={4}>
              <Link as={RouterLink} to={`/${user.username}`}>
                <RxAvatar size="24" />
              </Link>
              <Link as={RouterLink} to={`/chat`}>
                <BsFillChatQuoteFill size="20" />
              </Link>
              <Link as={RouterLink} to={`/settings`}>
                <MdOutlineSettings size="20" />
              </Link>
              <Button size={"xs"} onClick={logout}>
                <FiLogOut size={20} />
              </Button>
            </Flex>
          </Flex>
        ) : (
          <Flex justifyContent={"center"} mt={10}>
          <Image
            cursor={"pointer"}
            w={6}
            alt='Threads Logo'
            onClick={toggleColorMode}
            src={colorMode === "light" ? "/dark-logo.svg" : "/light-logo.svg"}
          />
          </Flex>
        )}
      </Container>
      </Box>
    );
  }
