const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    const {user, pwd} = req.body
    if(!user || !pwd) return res.sendStatus(400).json({"message": "Username and password are required."})
    
    const foundUser = await User.findOne({username: user}).exec()

    if(!foundUser) return res.sendStatus(401) //Unathorized
    //evaluate passwd
    const match = await bcrypt.compare(pwd, foundUser.password)
    if (match) {
        const roles = Object.values(foundUser.roles)
        
        //login logic JWTs
        //private jwt claims
        const accessToken = jwt.sign(
            { 
                UserInfo :{
                username: foundUser.username,
                roles: roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '100s' }
            )
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
            )
            //Saving refreshToken with current user
            foundUser.refreshToken = refreshToken
            const result = await foundUser.save()
            console.log(result)
            
            //returning access token
                res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None',
                maxAge: 24 * 60 * 60 * 1000
                }) //secure: true, 
                res.json({ accessToken })

        res.json({"success": `User ${user} is logged in`})
        } else {
            res.sendStatus(401)
            res.json({"message": "Invalid username or password."})

    }

}
module.exports = { handleLogin }