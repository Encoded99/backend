import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import Router from './routes/router.js'

const app = express()

config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())
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
