const User = require('../../models/User');

const handleLogin = async(req, res) => {
    const {usr, pwd} =  req.body;
    if (!usr || !pwd) return res.status(400).json({"message":"Username and password are required"})

    const foundUser = await User.findOne({username:usr}).exec();
    if (!foundUser) return res.sendStatus(401);
    const match = await bcrypt.compare(pwd, foundUser.password);
    if(match){
        const roles = Object.values(foundUser.roles)
        accesspayload = {
            "UserInfo":{
                "username":foundUser.username,
                "roles":roles
            }
        }
        ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
        optional =  {expiresIn : '30s'}

        const accessToken = jwt.sign(
            accesspayload,
            ACCESS_TOKEN_SECRET,
            optional
        );

        refreshpayload = {
            "username":foundUser.username,
        }
        REFRESH_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
        ref_optional =  {expiresIn : '1d'}

        const refreshToken = jwt.sign(
            refreshpayload,
            refresh_TOKEN_SECRET,
            ref_optional
        );
        foundUser.refresh_token = refreshToken
        const result = await foundUser.save();
        res.cookie('jwt',refreshToken,{httpOnly:true, sameSite:'None',secure:true, maxAge: 24*60*60*1000});
        res.json({accessToken});
    }else{
        res.sendStatus(401);
    }

}

module.exports = {handleLogin};
