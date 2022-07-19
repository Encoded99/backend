import * as publicIp from 'public-ip'
import iplocate from 'node-iplocate'
import * as ipInfo from 'ip-info-finder'

const RequestIp = async (req, res, next) => {
  const ipAddress = await publicIp.publicIpv4()
  iplocate(ipAddress, { apikey: process.env.IP_API_KEY })
    .then((results) => {
      req.ip_info = results
      next()
    })
    .catch((err) => console.log(err))
}

export default RequestIp
