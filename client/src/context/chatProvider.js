import { useNavigate } from "react-router-dom";

const { createContext, useContext, useState, useEffect } = require("react");


const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [loginInfo, setLoginInfo] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const loginData = JSON.parse(localStorage.getItem("loginData"))
        if (loginData) {
            setLoginInfo(loginData?.data?.data);
        }
        if (!loginData) {
            navigate('/')
        }
    }, [navigate])

    return <ChatContext.Provider value={{ loginInfo, setLoginInfo, selectedChat, setSelectedChat, chats, setChats }}>{children}</ChatContext.Provider>
}

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;