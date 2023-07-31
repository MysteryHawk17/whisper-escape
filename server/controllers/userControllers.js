const userDB = require("../Models/userModel")
const response = require("../middlewares/responseMiddleware");
const asynchandler = require("express-async-handler")
const test = (req, res) => {
    res.status(200).json({ message: "User route working fine." })
}

const getUser = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
            // {content:{$regex:req.query.search,$options:"i"}}
        ]
    }
        : {};
    const findAllUser = await userDB.find(keyword).find({ _id: { $ne: req.user._id } })
    if (!findAllUser) {
        return response.internalServerError(res, 'Failed to fetch the user');
    }
    response.successResponse(res, findAllUser, "Fetched the user successfully")
}

module.exports = { test, getUser };