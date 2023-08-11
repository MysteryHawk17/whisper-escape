import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import {
    Box,
    useDisclosure,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    FormControl,
    Input
} from '@chakra-ui/react'
import { AddIcon } from "@chakra-ui/icons";
import { ChatState } from '../../context/chatProvider';
import UserListItem from '../userComponents/UserListItem'
import ChatLoading from '../chatPage/ChatLoading'
import axios from 'axios'
import UserBadgeItem from '../userComponents/GroupMemberItem';
const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUser, setSelectedUser] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const { loginInfo, chats, setChats } = ChatState();

    const handleSearch = async (e) => {
        setSearch(e);
        console.log(e)
        if (search === '') {
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
            setSearchResult([]);
            return
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
            // console.log(response?.data?.data)
            // console.log(searchResult)
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
    const handleSubmit = async () => {
        if (!groupChatName || selectedUser.length <= 1) {
            toast.warning("Group name cannot be empty and group chat require more than 2 people", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
            return;
        }

        try {
            const data = {
                users: selectedUser,
                chatName: groupChatName
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${loginInfo.token}`,
                },
            };
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/chats/groupchat/create`,
                data,
                config
            );
            // console.log(response?.data?.data)
            const newChat = response?.data?.data
            setChats([newChat,...chats ])

            onClose();
            toast.success("Group chat created successfully", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
        } catch (error) {
            toast.error("Failed to create group", {
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
    const handleGroup = (userToAdd) => {
        if (selectedUser.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setSelectedUser([...selectedUser, userToAdd]);
    };
    const handleDelete = (delUser) => {
        setSelectedUser(selectedUser.filter((sel) => sel._id !== delUser._id));
    };
    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal onClose={onClose} isOpen={isOpen} isCentered >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >Create Group chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display='flex' flexDir="column" alignItems="center">
                        <FormControl>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users eg: John, Piyush, Jane"
                                mb={1}
                                onChange={(e) => { if (e.target.value === '') { setSearchResult([]) } handleSearch(e.target.value) }}
                            />
                        </FormControl>
                        <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedUser.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>
                        {loading ? (
                            <ChatLoading />
                            // <div>Loading...</div>
                        ) : (
                            searchResult
                                ?.slice(0, 5)
                                .map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleGroup(user)}
                                    />
                                ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <ToastContainer />
        </>
    )
}

export default GroupChatModal