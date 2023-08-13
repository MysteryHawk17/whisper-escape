import React, { useState, useEffect } from 'react'
import { ChatState } from '../../context/chatProvider';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { Box, Stack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from './ChatLoading'
import { getSender } from '../logics/chatLogic';
import GroupChatModal from '../model/GroupChatModal';
const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const [loading,setLoading]=useState(false);
  const { loginInfo, selectedChat, setSelectedChat,chats, setChats } = ChatState();
  const fetchChats = async () => {
    setLoading(true)
    try {
      const config = {
        headers: {
          authorization: `Bearer ${loginInfo.token}`
        }
      }
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chats/fetchchats`, config)
      // console.log(response?.data?.data)
      setChats(response?.data?.data)
    }
    catch (e) {
      // console.log(e.response.status)
      if(e.response.status===401){
        localStorage.removeItem("loginData");
        toast.error("Token expired. Please login.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
      }
      else{
      toast.error("Failed to load chats", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    }


    }
    finally{
      setLoading(false);
    }
  }
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("loginData")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "35%" }}
      borderRadius="lg"
      borderWidth="1px">
      <Box
        // border="10px solid red"

        p={3}
        fontSize={{ base: "18px", md: "25px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "15px", md: "10px", lg: "15px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {loading?<ChatLoading/>:chats?.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat?._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser?.data?.data?.user, chat?.users)
                    : chat?.chatName}
                </Text>
                {chat?.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat?.latestMessage?.sender?.name} : </b>
                    {chat?.latestMessage?.content?.length > 50
                      ? chat?.latestMessage?.content?.substring(0, 51) + "..."
                      : chat?.latestMessage?.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
      <ToastContainer />
    </Box>
  )
}

export default MyChats