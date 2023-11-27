import express from 'express'
import {connectToMongo} from './config/db.js'
import cors from 'cors'
import AuthRoute from './routes/AuthRoutes.js'
import FileRoute from './routes/FileRoutes.js'
import cookieParser from 'cookie-parser'
import 'dotenv/config'

const app = express() // server created
connectToMongo() // database connected
const port = process.env.PORT || 5000 // port specified

console.log(process.env.CORS_ORIGIN)

// middlewares ;-
app.use(cors({
    origin: [process.env.CORS_ORIGIN],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["Set-Cookie"]
}))
app.use(express.json())
app.use(cookieParser())

// routes;-
app.get('/', (req, res) => {
    res.json('hello world')
})
app.use('/auth', AuthRoute)
app.use('/file', FileRoute)

app.listen(port,() => {
    console.log(`app listening on port ${port}`)
})