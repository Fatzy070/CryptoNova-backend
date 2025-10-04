import express from 'express'
import dotenv, { config } from 'dotenv'
import connectDB from './config/db.js'
import cors from 'cors'
import UserRoutes from './routes/UserRoutes.js'
import NewsRoutes from './routes/NewsRoutes.js'
import PorfoliRoutes from './routes/PortfolioRoutes.js'
const app = express()
const PORT = process.env.PORT || 3000


dotenv.config()
connectDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api' , UserRoutes)
app.use('/api' , NewsRoutes )
app.use('/api' , PorfoliRoutes )


app.listen(PORT , () => {
    console.log(`server is running on https://localhost:${PORT}`)
})