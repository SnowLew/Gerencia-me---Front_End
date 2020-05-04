import axios from "axios"
import stores from "./stores"
import categories from "./categories"
import products from "./products"

const api = () => {
  let token = localStorage.getItem("token") || null
  axios.defaults.headers.Authorization = "bearer " + token
  axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL

  axios.interceptors.request.use(
    async (config) => {
      if (localStorage.getItem("expires") < Date.now()) {
        localStorage.removeItem("token")
        localStorage.removeItem("expires")
        config.headers.Authorization = null
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  const auth = async (email, password) => {
    if (email && password) {
      try {
        const res = await axios.post("/auth", { email, password })
        localStorage.removeItem("expires")
        localStorage.removeItem("token")
        if (res.data.token) {
          await localStorage.setItem("token", res.data.token)
          await localStorage.setItem("expires", res.data.expires)
          return true
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return {
    auth,
    axios,
    stores: stores(axios),
    categories: categories(axios),
    products: products(axios),
  }
}

export default api
