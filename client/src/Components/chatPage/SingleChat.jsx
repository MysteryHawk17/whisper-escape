import React, { useState, useEffect } from 'react'
import { ChatState } from '../../context/chatProvider'
import { Box, Text } from "@chakra-ui/layout";
import { FormControl, IconButton, Input, Spinner } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { fullUserData, getSender } from '../logics/chatLogic';
import Profile from '../model/Profile';
import UpdateGroupChat from '../model/UpdateGroupChat';
import ScrollableChat from './ScrollableChat';
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { loginInfo, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

  }
  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      console.log("here")
      try {
        const data = {
          chatId: selectedChat._id,
          content: newMessage
        }
        const config = {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${loginInfo.token}`
          }
        }
        setNewMessage("")
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/message/create`, data, config);
        console.log(response)

        setMessages([...messages, response?.data?.data])
        // setFetchAgain(!fetchAgain)
      } catch (error) {
        console.log(error)
        if (error.response.status === 401) {
          // localStorage.removeItem("loginData");
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
        else {
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
    }
  }
  const fetchChats = async () => {
    if (!selectedChat) {
      return
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${loginInfo.token}`
        }
      }
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/message/getallchatmessages/${selectedChat._id}`, config);
      console.log(response?.data)
      setMessages(response?.data?.data)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response.status === 401) {
        // localStorage.removeItem("loginData");
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
      else {
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
  }
  useEffect(() => {
    fetchChats()
  }, [selectedChat])

  // console.log(loginInfo.user)
  return (
    <>
      {selectedChat ? (<>
        <Text
          fontSize={{ base: "28px", md: "30px" }}
          pb={3}
          px={2}
          w="100%"
          fontFamily="Work sans"
          display="flex"
          justifyContent={{ base: "space-between" }}
          alignItems="center"
        >
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<ArrowBackIcon />}
            onClick={() => setSelectedChat("")}
          />
          {!selectedChat.isGroupChat ? (
            <>
              {getSender(loginInfo.user, selectedChat.users)}
              <Profile
                user={fullUserData(loginInfo.user, selectedChat.users)}
              />
            </>
          ) : (
            <div style={{ display: 'flex', justifyContent: "space-between", width: "100%" }}>
              {selectedChat.chatName.toUpperCase()}
              <UpdateGroupChat
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchChats={fetchChats}
              />
            </div>
          )}
        </Text>
        <Box
          display='flex'
          flexDirection='column'
          justifyContent="flex-end"
          p={3}
          bg="#E8E8E8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {loading ? (
            <Spinner
              size="xl"
              w={20}
              h={20}
              alignSelf="center"
              margin="auto"
            />
          ) : (
            <div className="messages">
              <ScrollableChat messages={messages} />
            </div>
          )}
          <FormControl
            onKeyDown={sendMessage}
            id="first-name"
            isRequired
            mt={3}
          >
            <Input
              variant="filled"
              bg="#E0E0E0"
              placeholder="Enter a message.."
              value={newMessage}
              onChange={typingHandler}
            />
          </FormControl>
        </Box>
      </>) : <Box display="flex" alignItems="center" justifyContent="center" h="100%">
        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
          Click on a user to start chatting
        </Text>
      </Box>


      }
      <ToastContainer />
    </>
  )
}

export default SingleChat