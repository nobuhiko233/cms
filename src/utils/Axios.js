import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

const Axios = {
  get(url, data = {}) {
    return axiosInstance
      .get(url, { params: data })
      .then((response) => response.data);
  },

  post(url, data = null) {
    return axiosInstance.post(url, data).then((response) => response.data);
  },

  postForm(url, data = null) {
    return axiosInstance
      .post(url, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => response.data);
  },

  postFile(url, data = null) {
    return axiosInstance
      .post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data);
  },

  postToken(url, data = null) {
    return axiosInstance
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data);
  },
};

export default Axios;
