const User = require('../model/User')

const handleLogout = async (req, res) => {
    //On client, also del accessToken

    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204) //No content to send back
        const refreshToken = cookies.jwt
        
        //Is refreshToken valid?

    const foundUser = await User.findOne({refreshToken}).exec()
    if(!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
        return res.sendStatus(204) //Successful
         
    }
    //Del refreshToken in DB
    foundUser.refreshToken = ''
    const result = await foundUser.save()
    console.log(result)
    
    res.clearCookie('jwt', { httpOnly: true, maxAge:24 * 60
            * 0* 1000 })
    res.sendStatus(204) //Successful
        }

module.exports = { handleLogout }