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
const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { loginInfo, selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${loginInfo.token}`
        }
      }
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chats/fetchchats`, config)
      console.log(response?.data?.data)
      setChats(response?.data?.data)
    }
    catch (e) {
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
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("loginData")));
    fetchChats();
    // eslint-disable-next-line
  }, []);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
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

        <Button
          d="flex"
          fontSize={{ base: "15px", md: "10px", lg: "15px" }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>

      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats?.map((chat) => (
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
    </Box>
  )
}

export default MyChats