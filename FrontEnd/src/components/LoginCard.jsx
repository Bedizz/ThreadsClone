import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
  } from '@chakra-ui/react'
  import { useState } from 'react'
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import {  useSetRecoilState } from 'recoil'
import { authScreenAtom } from '../atoms/authAtoms'
import { useShowToast } from './hooks/useShowToast'
import { userAtom } from '../atoms/userAtoms'
  
  export default function LoginCard() {
    const [showPassword, setShowPassword] = useState(false)
    const showtoast = useShowToast()
    const [loading, setLoading] = useState(false)
    const setAuthScreen = useSetRecoilState(authScreenAtom)
    const setUser = useSetRecoilState(userAtom)
    const [form,setForm] = useState({
      username: "",
      password: ""
    })
    
    const handleLogin = async () => {
      if(loading) return;
      setLoading(true)
      try {
        const res = await fetch("/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        })
        const data = await res.json()
        if(data.error) return showtoast("Error", data.error, "error")
        localStorage.setItem("user-threads", JSON.stringify(data))
        setUser(data)
      } catch (error) {
        return showtoast("Error", data.error, "error")
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
              Login
            </Heading>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.dark')}
            boxShadow={'lg'}
            p={8}
            w={{
                base:"full",
                sm:"400px"
            }}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input type="text" onChange={(e) => setForm({...form, username: e.target.value})} 
                value={form.username} />
              </FormControl>
              <FormControl  isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? 'text' : 'password'} onChange={(e)=> setForm({...form, password: e.target.value})}
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
                  
                  size="lg"
                  bg={useColorModeValue("gray.600","gray.700")}
                  color={'white'}
                  _hover={{
                    bg: useColorModeValue("gray.700","gray.800"),
                  }}
                  onClick={handleLogin}
                  isLoading={loading}>
                  Login
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Don't have an account? <Link color={'blue.400'} onClick={()=> setAuthScreen("signup")}>Sign Up</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    )
  }