import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import Router from './routes/index.js'
import Conn from './database/config.js'

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
  console.log(err)
  res.status(err.status || 500).json({
    status: 'error',
    statusCode: err.status,
    message: err.message,
    data: '',
  })
})

const PORT = process.env.PORT || 8080
const initDb = () => {
  Conn.then(() => {
    console.log('Connection to Database successful')
    app.listen(PORT, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
    })
  })
}

initDb()
