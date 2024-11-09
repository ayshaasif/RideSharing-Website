const User = require('../../models/User');
const bcrypt = require('bcrypt')

const handleNewUser = async(req, res) => {
    console.log("handle new user");
    const {username ,name,email, phone_number, password} = req.body;
    if (!username || !password) return res.status(400).json({'message':"username and password are required"});

    const duplicate = await User.findOne({username : username}).exec();
    if(duplicate) return res.sendStatus(409);
    try {
        const hashedPwd = await bcrypt.hash(password , 10);
        const result = await User.create({
            "username" : username,
            "name": name,
            "email" : email,
            "phone_number" :phone_number,
            "password" : hashedPwd
        });

        console.log(result)
        res.status(201).json({"message" :"new user created! "});
    }catch(err){
        res.status(500).json({"message" : err.message});
    }
}

module.exports = { handleNewUser }