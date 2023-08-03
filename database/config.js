import mongoose from 'mongoose'
import { config } from 'dotenv'

config()

const Conn = mongoose
  .connect(process.env.DB_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((conn) => conn.connection)
  .catch((err) => {
    console.log(`Failed to connect to database ${err}`)
    throw new Error(err)
  })

export default Conn
