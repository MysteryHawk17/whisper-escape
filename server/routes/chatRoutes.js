const { test } = require("../controllers/chatControllers");


const router=require("express").Router();




router.get("/test",test);



module.exports=router;