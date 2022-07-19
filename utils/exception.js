// import { Container, Service } from 'typedi'

export default class Exception extends Error {
  constructor(message, status) {
    super()
    this.message = message
    this.status = status
  }
}

// const exception = Container.get(Exception)
// export default exception
