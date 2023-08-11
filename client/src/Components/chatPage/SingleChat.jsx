import React from 'react'
import { ChatState } from '../../context/chatProvider'
import { Box, Text } from "@chakra-ui/layout";
import { IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { fullUserData, getSender } from '../logics/chatLogic';
import Profile from '../model/Profile';
import UpdateGroupChat from '../model/UpdateGroupChat';
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { loginInfo, selectedChat, setSelectedChat } = ChatState();
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
          Messages here
        </Box>
      </>) : <Box display="flex" alignItems="center" justifyContent="center" h="100%">
        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
          Click on a user to start chatting
        </Text>
      </Box>


      }
    </>
  )
}

export default SingleChat