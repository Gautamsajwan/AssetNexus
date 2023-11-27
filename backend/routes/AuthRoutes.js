import express from 'express'
import User from '../models/UserModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { assetCache } from './FileRoutes.js'
const router = express.Router()

router.post('/createUser', async (req, res) => {
    const { username, email, password, brandName } = req.body;
    console.log(username, email, password, brandName);
    if (!username || !email || !password || !brandName) {
        return res.status(500).json({
            success: false,
            msg: "Please fill all the details before submitting",
        });
    }

    let SearchUser = await User.findOne({ email: email });
    if (SearchUser) {
        return res.status(400).json({ 
            success: false,
            msg: "sorry a user with the same email already exists" 
        })
    }

    try {
        const salt = bcrypt.genSaltSync(10)
        const encryptedPassword = await bcrypt.hash(password, salt);

        const NewUser = await User.create({
            username,
            email,
            password: encryptedPassword,
            brandName
        });

        console.log(NewUser)

        const payload = {
            userId: NewUser._id
        }

        const jwtSecret = process.env.JWT_SECRET || '';
        let authToken = jwt.sign(payload, jwtSecret);

        const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const cookieOptions = {
            expires: expirationDate,
            sameSite: "none", // set it to Lax while running in local host
            secure: true, // set it to false while running in local host
            httpOnly: false,
        };

        res.cookie("UserCookie", authToken, cookieOptions)

        return res.json({
            success: true,
            msg: "Successfully signed up",
            userName: NewUser.username,
            jwt: authToken
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
        });
    }
})

router.post('/verifyUser', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(500).json({
            success: false,
            msg: "Please fill all the details before submitting",
        });
    }

    try {
        const SearchUser = await User.findOne({ email: email });
        if (!SearchUser) {
            return res.status(404).json({
                success: false,
                msg: "User does not exist",
            });
        }

        const comparePassword = await bcrypt.compare(password, SearchUser.password);
        if (!comparePassword) {
            console.log("Incorrect password");
            return res.status(401).json({
                success: false,
                msg: "Incorrect password, please double check before submitting",
            });
        }

        const payload = {
            userId: SearchUser._id
        };
        
        const options = {
            expiresIn: "60m",
        };

        const jwtSecret = process.env.JWT_SECRET || '';

        let authToken = jwt.sign(payload, jwtSecret, options);

        const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const cookieOptions = {
            expires: expirationDate,
            sameSite: "none", // set it to Lax while running in local host
            secure: true, // set it to false while running in local host
            httpOnly: false,
        };

        const cookie = res.cookie("UserCookie", authToken, cookieOptions)

        return res.json({
            success: true,
            msg: "Successfully Logged in",
            userName: SearchUser.username,
            brandName: SearchUser.brandName,
            jwt: authToken
        });
    } catch (err) {
        console.log("Server error, ", err);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
        });
    }
})

// router.get('/getUser', fetchUser, async (req, res) => {
//     try {
//         const userId = req.user
//         console.log('user', userId)
//         const user = await User.findById(userId).select("-password")
//         return res.status(200).json({user: user})
//     } catch (err) {
//         console.error(err.message)
//         return res.status(500).send("internal server error")
//     }
// })

// the below function is required for checking the login status or securing the path at times when we are not calling an api at the first render or useEffect. Foe example in /dashboard endpoint where at the time of loading the page we are calling the api which is using fetchUser middleware for checking the login status but in the dropZone component we arent calling any api at the first render which is why we need to use the below function and use it in use effect
router.post("/checkLoginStatus", (req, res) => {
    console.log("Check Login Status");
    const accessToken = req.cookies["UserCookie"]

    if (!accessToken) {
        console.log("Cookie not found");
        return res.status(400).json({
            sucess: false,
            msg: "user isnt authenticated",
        })
    }

    try {
        const jwtSecret = process.env.JWT_SECRET || ''
        const data = jwt.verify(accessToken, jwtSecret)
        console.log("token", data);
        return (
            res.status(200).json({ success: true, msg: "User authentication successful" })
        )
    } catch (err) {
        return res.status(401).json({
            sucess: false,
            msg: "Cookie not present or expired",
        })
    }
});

router.get("/logout", (req, res) => {
    console.log("LogOut Endpoint")
    const expirationDate = new Date(Date.now() - 1);

    console.log(expirationDate);
    const cookieOptions = {
        expires: expirationDate,
        sameSite: "false",
        secure: true,
        httpOnly: false,
    };

    assetCache.flushAll();
    return res.clearCookie("UserCookie", cookieOptions).status(200).json({
        success: true, 
        msg: "Successfully logged Out"
    })
})

// router.get('/logout', (req, res) => {
//     console.log("Logout")
//     // Clear the "UserCookie" by setting its value to null and an expired date
//     res.clearCookie('UserCookie', { path: '/' });

//     // Redirect or respond as needed after logout
//     // For example, you can redirect the user to the login page:
//     // res.redirect('/login');

//     // Or you can send a JSON response indicating successful logout:
//     res.json({
//         success: true,
//         msg: "Logged out successfully"
//     });
// });

export default router