import { Flex, Image, useColorMode,Link, Button, Center } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { userAtom } from '../atoms/userAtoms'
import { Link as RouterLink } from 'react-router-dom'
import { AiFillHome } from 'react-icons/ai'
import {  RxAvatar } from 'react-icons/rx'
import { FiLogOut } from 'react-icons/fi'
import useLogout from '../atoms/useLogout'
import { authScreenAtom } from '../atoms/authAtoms'
 

export default function Header() {
  // toogleColorMode is a function that changes the color mode of the application
  //colorMode is a string that represents the current color mode of the application
  const { colorMode,toggleColorMode } = useColorMode()
  const user = useRecoilValue(userAtom)
  const logout = useLogout()
  const setAuthScreen = useSetRecoilState(authScreenAtom)


  
  return (
      // Flex is a layout component that allows you to align items in a flex container
      <div>
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
      </div>
    );
  }
