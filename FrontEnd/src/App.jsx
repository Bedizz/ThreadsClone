import { Container } from '@chakra-ui/react'
import { Navigate, Route, Routes } from 'react-router-dom'
import {UserPage} from "./components/pages/UserPage"
import PostPage from "./components/pages/PostPage";
import Header from "./components/Header"
import Homepage from './components/pages/HomePage';
import AuthPage from './components/pages/AuthPage';
import { useRecoilValue } from 'recoil';
import { userAtom } from './atoms/userAtoms';
import UpdateProfilePage from './components/pages/UpdateProfilePage';
import { CreatePost } from './components/CreatePost';


function App() {
  const user = useRecoilValue(userAtom)

  
  

  return (
    <Container maxW="620px">
      <Header/>
      <Routes>
        <Route path="/" element={user ? <Homepage/> : <Navigate to="/auth"/> } />
        <Route path="/auth" element={!user ? <AuthPage/> : <Navigate to="/"/>} />
        <Route path="/update" element={user ? <UpdateProfilePage/> : <Navigate to="/"/>} />
        <Route path="/:username" element={user ? <UserPage/>: <Navigate to="/"/>} />
        <Route path="/:username/post/:pid" element={user ? <PostPage/> :<Navigate to="/"/> }  />
        
      </Routes>
    {/* {user && <LogoutButton/>} */}
    {user && <CreatePost/>}
    </Container>
  )
}

export default App
