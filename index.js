import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import Router from './routes/index.js'
import initDb from './database/config.js'

config()
const app = express()

// config({ path: `.env.${process.env.NODE_ENV}` })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    'Access-Control-Allow-Origin': '*',
  })
)
app.use(helmet())
app.use(Router)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: 'error',
    statusCode: err.status,
    message: err.message,
    data: '',
  })
})

const PORT = process.env.PORT || 8080
initDb(app, PORT)
