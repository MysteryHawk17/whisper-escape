const { test, accessChat, fetchChats, createGroupChat, renameGroup, addPeopleToGroup, removePeople } = require("../controllers/chatControllers");


const router = require("express").Router();
const { checkLogin } = require("../middlewares/authMiddlewars")


router.get("/test", test);
router.post('/accesschat', checkLogin, accessChat)
router.get("/fetchchats", checkLogin, fetchChats)
router.post("/groupchat/create", checkLogin, createGroupChat)
router.put("/groupchat/rename", checkLogin, renameGroup)
router.put("/groupchat/addpeople", checkLogin, addPeopleToGroup);
router.put("/groupchat/removepeople", checkLogin, removePeople);


module.exports = router;