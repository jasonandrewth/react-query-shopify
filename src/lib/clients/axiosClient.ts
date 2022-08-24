import axios from "axios";

export const patreonRequestClient = axios.create({
  baseURL: "https://www.patreon.com/api/oauth2/v2/",
  headers: {
    Authorization: `Bearer 7CnrIR2TNaFIuDUF2MRvX5FE5w0BKCYyonFxwIEIsUw`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
});
