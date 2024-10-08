import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import { authScreenAtom } from '../atoms/authAtoms'
import { useShowToast } from './hooks/useShowToast'
import { userAtom } from '../atoms/userAtoms'

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false)
  const toast = useShowToast()
  const [loading, setLoading] = useState(false)
  const setUser = useSetRecoilState(userAtom)
  const setAuthScreen = useSetRecoilState(authScreenAtom)
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  })

  const handleForm = async () => {
    if(loading) return;
    setLoading(true)
    try {
        
        const res = await fetch("/api/users/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        })
        const data = await res.json()
        console.log(data)
        if(data.error) return toast("Error",data.error, "error")       
        toast("Success",data.newUser, "success")
           
              // if we want to redirect the client to login screen after signup
            //   setAuthScreen("login")
        
        localStorage.setItem("user-threads",JSON.stringify(data.newUser) )
        setUser(data)
    } catch (error) {
        console.log(error)
    }finally{
        setLoading(false)
    }
  }

  return (
  
    <Flex
      align={'center'}
      justify={'center'}
      >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl  isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input type="text" onChange={(e)=> setForm({...form, name : e.target.value})}
                  value={form.name} />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel >Username</FormLabel>
                  <Input type="text" onChange={(e)=> setForm({...form, username : e.target.value})} 
                  value={form.username} />
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" onChange={(e)=> setForm({...form, email : e.target.value})} 
              value={form.email} />
            </FormControl>
            <FormControl  isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} onChange={(e)=> setForm({...form, password : e.target.value})} 
                value={form.password}/>
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue("gray.600","gray.700")}
                color={'white'}
                _hover={{
                  bg: useColorModeValue("gray.700","gray.800"),
                  
                }}
                onClick={handleForm}
                isLoading={loading}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link color={'blue.400'} onClick={()=> setAuthScreen("login")}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}