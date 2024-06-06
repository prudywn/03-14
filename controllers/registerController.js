const User = require('../model/User')
const bcrypt = require('bcrypt')

const handleNewUser = async (req,res)  => {
    const {user, pwd} = req.body
    if(!user || !pwd) return res.sendStatus(400).json({"message": "Username and password are required."})

    //check for duplicate
    const duplicate = await User.findOne({username: user}).exec()
    if(duplicate) return res.sendStatus(409).json({"message": "Username already taken."})
        
        try{
    //hash password
    const hashedPwd = await bcrypt.hash(pwd, 10)
    const newUser = new User({
        username: user, 
        password: hashedPwd
        })
    await newUser.save()
    
    //add to database
    
        res.sendStatus(201).json({"message": `New user ${user} created.`
        })
        }catch(err){
            res.sendStatus(500).json({"message": err.message})
            }

}
module.exports = { handleNewUser }