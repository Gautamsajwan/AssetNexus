import jwt from 'jsonwebtoken'
import 'dotenv/config'

const fetchUser = (req, res, next) => {
    const accessToken = req.cookies["UserCookie"]
    console.log("Middleware for checking user")

    if (!accessToken) {
        return res.status(400).json({
            success: false,
            msg: "user isnt authenticated",
        })
    }

    try {
        const jwtSecret = process.env.JWT_SECRET || ''
        const data = jwt.verify(accessToken, jwtSecret, {complete: true});
        console.log("token1 ", data);
        // req.user = data.userId
        next()
    } catch (err) {
        console.log(err)
        return res.status(401).json({
            sucess: false,
            msg: "Cookie not present or expired",
        })
    }
}

export default fetchUser
