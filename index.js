import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import Router from './routes/router.js'
import initDb from './database/config.js'
import RequestIp from './middleware/request-ip.js'

const app = express()

config()
initDb()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    'Access-Control-Allow-Origin': '*',
  })
)
app.use(helmet())
//  app.use(RequestIp)
app.use(Router)
app.use((err, req, res, next) => {
  res.status(err.status || 409).json({
    status: 'error',
    statusCode: err.status || 409,
    message: err.message,
    data: '',
  })
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})
