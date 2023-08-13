const express = require("express")
const app = express();
const port = process.env.PORT || 5000
const connectDB = require("./db/connect")
const cors = require('cors')
const bodyParser = require("body-parser")


//routes import
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes");
//middlewares import
app.use(cors({
    origin:"*"
}))
// app.use(cors({
//     origin: ["http://localhost:3000", "https://whisperscape.vercel.app", "https://whisper-escape-t3v5-git-main-mysteryhawk17.vercel.app", "https://whisper-escape-t3v5-mysteryhawk17.vercel.app"]
// }))
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//routes import 
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/message", messageRoutes)


//default server route
app.get("/", (req, res) => {
    res.status(200).json({ message: "Chat server is working perfectly." })
})



//db connect

connectDB();


//listening to server

const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})


// const io = require('socket.io')(server, {
//     pingTimeout: 60000,
//     cors: {
//         origin: ["http://localhost:3000", "https://whisperscape.vercel.app", "https://whisper-escape-t3v5-git-main-mysteryhawk17.vercel.app", "https://whisper-escape-t3v5-mysteryhawk17.vercel.app"]
//     }
// })
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*"
        // origin: "https://whisperscape.vercel.app"
    }
});

io.on('connection', (socket) => {
    // console.log("Connected to socket.io")    
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        // console.log(userData._id)
        socket.emit('connected')
    })
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room:", room);
    });
    socket.on("typing", (room) => {
        socket.in(room).emit("typing")
    });
    socket.on("stop typing", (room) => {
         socket.in(room).emit("stop typing")
    });

    socket.on("send message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chatBelong;
        // console.log(newMessageRecieved)
        if (!chat.users) { return console.log("Chat.user not defined") }
        chat.users.forEach(user => {
            if (user._id === newMessageRecieved.sender._id) {
                return
            }
            socket.in(user._id).emit("message recieved", newMessageRecieved)
        });
    })
    socket.off("setup", (userData) => {
        console.log('Disconnected')
        socket.leave(userData._id)
    })
})




