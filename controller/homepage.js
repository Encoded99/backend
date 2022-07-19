import Exception from '../utils/exception.js'
import Msg from '../utils/resMsg.js'

export default function HomePage(req, res, next) {
  try {
    console.log(request, ip_info)
    Msg(
      res,
      { data: `You are browsing from ${req.ip_info.country}` },
      'homepage'
    )
  } catch (error) {
    next(new Exception(error.message, error.status))
  }
}
