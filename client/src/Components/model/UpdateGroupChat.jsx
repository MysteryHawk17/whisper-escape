import React from 'react'
import { ViewIcon } from "@chakra-ui/icons";
import { ToastContainer, toast } from 'react-toastify'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    Box,
    IconButton,
    Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../context/chatProvider";
import GroupMemberItem from '../userComponents/GroupMemberItem'
import UserListItem from "../userComponents/UserListItem";
const UpdateGroupChat = ({ fetchAgain, setFetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { selectedChat, setSelectedChat, loginInfo } = ChatState();
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const handleRename = async () => {
        setRenameLoading(true)

        try {
            const data = {
                chatId: selectedChat._id,
                newName: groupChatName
            }
            console.log(loginInfo.token)
            const config = {
                headers: {
                    authorization: `Bearer ${loginInfo.token}`
                }
            }
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/chats/groupchat/rename`,
                data,
                config)
            console.log("jereaejr")
            console.log(response)
            console.log(fetchAgain)
            setFetchAgain(!fetchAgain)
            console.log(fetchAgain)
        } catch (error) {
            if (error.response.status === 401) {
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
            else {
                toast.error("Failed to rename chat", {
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
        setGroupChatName("")
        setRenameLoading(false)
    };
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
    };
    const handleAddUser = async (user) => {
        setLoading(true)
        if (selectedChat.users.find((u) => u._id === user._id)) {
            toast.error("User already exists.", {
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

        if (selectedChat.groupAdmin._id !== loginInfo.user._id) {
            toast.error("Only Admin can add to the group", {
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
        console.log(user)
        const data = {
            chatId: selectedChat._id,
            userId: user._id
        }
        const config = {
            headers: {
                authorization: `Bearer ${loginInfo.token}`
            }
        }
        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/chats/groupchat/addpeople`,
                data,
                config)
            console.log(response?.data?.data)
            setSelectedChat(response?.data?.data);
            setFetchAgain(!fetchAgain)
            setLoading(false);
        }
        catch (error) {
            if (error.response.status === 401) {
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
            else {
                toast.error("Failed to add people", {
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

    };
    const handleRemove = async (user) => {
        setLoading(true)
        if (selectedChat.groupAdmin._id !== loginInfo.user._id && user._id !== loginInfo.user._id) {
            toast.error("Cannot remove other people. Not admin", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
            setLoading(false)
            return;
        }
        const data = {
            chatId: selectedChat._id,
            userId: user._id
        }
        const config = {
            headers: {
                authorization: `Bearer ${loginInfo.token}`
            }
        }
        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/chats/groupchat/removepeople`,
                data,
                config)

            loginInfo.user._id === user._id ? setSelectedChat() : setSelectedChat(response?.data?.data);
            setFetchAgain(!fetchAgain);

        } catch (error) {
            if (error.response.status === 401) {
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
            else {
                toast.error("Failed to remove people", {
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
        setLoading(false)

    }
    return (<>
        <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

        <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader
                    fontSize="35px"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent="center"
                >
                    {selectedChat.chatName}
                </ModalHeader>

                <ModalCloseButton />
                <ModalBody display="flex" flexDirection="column" alignItems="center">
                    <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                        {selectedChat.users.map((u) => (
                            <GroupMemberItem
                                key={u._id}
                                user={u}
                                admin={selectedChat.groupAdmin}
                                handleFunction={() => handleRemove(u)}
                            />
                        ))}
                    </Box>
                    <FormControl display="flex">
                        <Input
                            placeholder="Chat Name"
                            mb={3}
                            value={groupChatName}
                            onChange={(e) => { console.log(e.target.value); setGroupChatName(e.target.value) }}
                        />
                        <Button
                            variant="solid"
                            colorScheme="teal"
                            ml={1}
                            isLoading={renameloading}
                            onClick={handleRename}
                        >
                            Update
                        </Button>
                    </FormControl>
                    <FormControl>
                        <Input
                            placeholder="Add User to group"
                            mb={1}
                            onChange={(e) => { if (e.target.value === '') { setSearchResult([]) } handleSearch(e.target.value) }}
                        />
                    </FormControl>

                    {loading ? (
                        <Spinner size="lg" />
                    ) : (
                        searchResult?.map((user) => (
                            <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleAddUser(user)}
                            />
                        ))
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => handleRemove(loginInfo.user)} colorScheme="red">
                        Leave Group
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        <ToastContainer />
    </>
    )
}

export default UpdateGroupChat