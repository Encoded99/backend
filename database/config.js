import mongoose from 'mongoose'

const initDb = (app, PORT) => {
  mongoose
    .connect(process.env.DB_CONN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then((conn) => {
      console.log('Connection to Database successful')
      app.listen(PORT, () => {
        console.log(
          `⚡️[server]: Server is running at http://localhost:${PORT}`
        )
      })
      return conn.connection.db
    })
    .catch((err) => console.log(`Failed to connect to database ${err}`))
}
export default initDb
