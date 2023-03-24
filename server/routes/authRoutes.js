const { test, createUser, loginUser } = require("../controllers/authControllers");
const upload=require('../utils/multer')
const router=require("express").Router();




router.get("/test",test)
router.post("/register",upload.single('image'),createUser)
router.post("/login",loginUser)



module.exports=router;