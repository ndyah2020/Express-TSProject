import express from 'express'
import connectDB from './config/mongodb'
import dotenv from 'dotenv'
import { errorHandler } from './middlewares/errorHandler.middleware'
import routes from './routes/index'
import cookieParser from 'cookie-parser'

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser()); 

app.use('/api', routes)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})