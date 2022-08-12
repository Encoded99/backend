import mongoose from 'mongoose'

const initDb = () => {
  try {
    mongoose.connect(process.env.DB_REMOTE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Connection to Database successful')
  } catch (err) {
    console.log(`Failed to connect to database ${err}`)
  }
}
export default initDb
