import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/avatar';
import { Button } from '@chakra-ui/button';
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify'
import { Spinner } from "@chakra-ui/spinner";
import 'react-toastify/dist/ReactToastify.css';
import { ChatState } from '../../context/chatProvider';
import Profile from '../model/Profile'
import ChatLoading from './ChatLoading'
import axios from 'axios'
import {
  useDisclosure,
  Input,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import UserListItem from '../userComponents/UserListItem';
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { loginInfo, setSelectedChat, chats, setChats } = ChatState()
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("loginData")
    navigate("/")
  }
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true)
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${loginInfo.token}`
        }
      }
      const data = { userId: userId };
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/chats/accesschat`, data, config)
      if (!chats.find((c) => c._id === response?.data?.data?._id)) { setChats([response?.data?.data, ...chats]) }
      console.log(response?.data?.data)
      setSelectedChat(response?.data?.data)
      setLoadingChat(false);
      setSearch('')
      setSearchResult([])
      onClose()
    } catch (e) {
      toast.error("Failed to fetch chats", {
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
  const handleSearch = async () => {
    if (!search) {
      toast.warning("Search cannot be empty", {
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
    try {
      setLoading(true)
      const config = {
        headers: {
          authorization: `Bearer ${loginInfo.token}`
        }
      }
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/getuser?search=${search}`, config)
      setLoading(false);
      setSearchResult(response?.data?.data)
      console.log(response?.data)
      console.log(searchResult)
    }
    catch (error) {
      toast.error("Failed to load the search result", {
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
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg='white'
        w='100%'
        p='5px 10px 5px 10px'
        borderRadius="10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
          <Button variant="ghost" onClick={onOpen}>
            <i class="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">Search User</Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Whisper-Escape
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" />
            </MenuButton>
            {/* {<MenuList></MenuList>} */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" cursor="pointer" name={loginInfo?.user?.name} src={loginInfo?.user?.image} />
            </MenuButton>
            <MenuList>
              <Profile user={loginInfo?.user}>
                <MenuItem>My Profile</MenuItem>
              </Profile>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}

      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>Search User</DrawerHeader>

          <DrawerBody>
            <Box display='flex' pb={2}>
              <Input
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={(e) => { if (e.target.value === '') { setSearchResult([]) } setSearch(e.target.value) }}
              />
              <Button
                onClick={handleSearch}
              >
                Go
              </Button>
            </Box>
            {loading ? <><ChatLoading /></> : (searchResult?.map((e) => {
              return (<UserListItem
                key={e._id}
                user={e}
                handleFunction={() => accessChat(e._id)}
              />)
            }))}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <ToastContainer />
    </>
  )
}

export default SideDrawer