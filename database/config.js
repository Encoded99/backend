import mongoose from 'mongoose'

const initDb = (app, PORT) => {
  mongoose
    .connect(process.env.DB_CONN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connection to Database successful')
      app.listen(PORT, () => {
        console.log(
          `⚡️[server]: Server is running at http://localhost:${PORT}`
        )
      })
    })
    .catch((err) => console.log(`Failed to connect to database ${err}`))
}
export default initDb
