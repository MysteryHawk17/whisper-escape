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
import io from 'socket.io-client'
import axios from 'axios'
import { Player } from '@lottiefiles/react-lottie-player';
import animation from '../../animation/animation_ll9ngf7e.json'

const ENDPOINT = process.env.REACT_APP_BACKEND_URL;
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { loginInfo, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false)
  const [isTyping, setisTyping] = useState()
  useEffect(() => {
    socket = io.connect(ENDPOINT);
    socket.emit('setup', loginInfo?.user)
    socket.on('connected', () => {
      console.log("connected to socket")
      setSocketConnected(true)
    })
    socket.on("typing", () => { setisTyping(true) });
    socket.on("stop typing", () => { setisTyping(false) });
    // return () => {
    //   socket.disconnect();
    // };
  }, [])

  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      // console.log("here")
      socket.emit('stop typing', selectedChat._id)
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
        // console.log(response)
        socket.emit("send message", response?.data?.data)
        setMessages([...messages, response?.data?.data])
        setFetchAgain(!fetchAgain)
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
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (e.target.value === '') {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }
    // console.log('h')
    if (socketConnected === false) return
    // console.log('h2');
    if (!typing) {
      setTyping(true);
      console.log('emitted')
      socket.emit('typing', selectedChat._id)
    }
    var lastTypingTime = new Date().getTime();
    var timer = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timer && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timer)

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
      socket.emit('join chat', selectedChat._id)
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
    selectedChatCompare = selectedChat;
  }, [selectedChat])

  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      setFetchAgain(!fetchAgain)
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chatBelong._id) {
        //give notification
        console.log('hererere')
      }
      else {
        console.log('first')
        setMessages([...messages, newMessageRecieved])
        // console.log(messages)
      }
    })
  })

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

            {isTyping ? <Player
              src={animation}
              className="player"
              loop
              autoplay
              width={12}
              style={{ marginBottom: 15, marginLeft: 0, width: '30px' }}
            />
              : <></>}
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