import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../context/chatProvider';
import SideDrawer from '../../Components/chatPage/SideDrawer';
import ChatBox from '../../Components/chatPage/ChatBox';
import MyChats from '../../Components/chatPage/MyChats';
import { Box } from '@chakra-ui/react';

const Chats = () => {

  console.log("At the chat page")
  const { loginInfo } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100" }} >
      {loginInfo && <SideDrawer />}
      <Box
        // border="10px solid red"
        margin="10px auto"
        display="flex"
        justifyContent="space-between"
        w="90%"
        h="91.5vh"
        p="10px"
      >
        {loginInfo && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        {loginInfo && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  )
}

export default Chats