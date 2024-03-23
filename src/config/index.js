// config/index.js
const configObj = {
  baseIp: process.env.VUE_APP_BASE_IP,
  basePort:process.env.VUE_APP_BASE_PORT,
  baseApiUrl: process.env.VUE_APP_BASE_API
}

export default { ...configObj }
