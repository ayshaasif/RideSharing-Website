const User = require('../../models/User');

const getAllUsers = async(req,res)=>{
    const users = await User.find();
    if (!users)  
        return res.status(204).json({"message": "No User found..."})
    res.status(201).json(users)
}

const getUser = async(req,res)=>{
    if (!req?.params?.id){
        return res.status(400).json({"message":"Id parameter is required"});
    }
    const user = await User.findOne({_id : req.params.id}).exec();
    if (!user){
        return res.status(400).json({"message":`User Id ${req.params.id} not found`})
    }
    res.json(user);
}

const updateUser = async(req, res)=>{
    if (!req?.params?.id){
        return res.status(400).json({"message":"Id parameter is required"});
    }
    const user = await User.findOne({_id : req.params.id}).exec();
    if (!user){
        return res.status(400).json({"message":`User Id ${req.params.id} not found`})
    }

    if(req.body?.username) user.username = req.body.username;
    if(req.body?.password) user.username = req.body.password;
    if(req.body?.profile_picture) user.username = req.body.profile_picture;
}

const deleteUser = async(req, res) => {
    if (!req?.params?.id){
        return res.status(400).json({"message":"Id parameter is required"});
    }
    const user = await User.findOne({_id : req.params.id}).exec();
    if (!user){
        return res.status(400).json({"message":`User Id ${req.params.id} not found`})
    }

    const result = await user.deleteOne({_id: req.body.id});
    res.json(result)
}

module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser

}