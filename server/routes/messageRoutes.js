const { test, createMessage, getAllChatMessages } = require('../controllers/messageController');

const router = require('express').Router();
const {checkLogin}=require("../middlewares/authMiddlewars")


router.get("/test", test);
router.post("/create",checkLogin,createMessage)
router.get("/getallchatmessages/:chatId",checkLogin,getAllChatMessages)


module.exports = router;