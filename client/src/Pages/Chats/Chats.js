import React from 'react'
// import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../context/chatProvider';
import SideDrawer from '../../Components/chatPage/SideDrawer';
import ChatBox from '../../Components/chatPage/ChatBox';
import MyChats from '../../Components/chatPage/MyChats';
import { Box } from '@chakra-ui/react';

const Chats = () => {
  // const navigate = useNavigate();
  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("loginData"));
  //   if (user) navigate("/chats");
  //   else navigate('/')
  // }, [navigate])
  console.log("At the chat page")
  const { loginInfo } = ChatState();
  return (
    <div style={{ width: "100" }} >
      {loginInfo && <SideDrawer />}
      <Box
        // border="10px solid red"
        margin="10px auto"
        display="flex"
        justifyContent="space-between"
        w="80%"
        h="91.5vh"
        p="10px"
      >
        {loginInfo && <MyChats />}
        {loginInfo && <ChatBox />}
      </Box>
    </div>
  )
}

export default Chats