
const {test, getUser } = require("../controllers/userControllers");
const { checkLogin } = require("../middlewares/authMiddlewars");

const router=require("express").Router();




router.get("/test",test)
router.get("/getuser",checkLogin,getUser)

module.exports=router;