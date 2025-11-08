import axios from "axios";
import { config } from "./Config";

export const request = async (url = "", method = "get", data = {}) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = user?.token || "";
    const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };
    if (token) {
        headers.Authorization = `Barer ${token}`;
    }
    if (data instanceof FormData) {
        delete headers["Content-Type"];
    }
    return axios({
        url: config.api_url + url,
        method,
        data,
        headers,
    })
        .then((res) => res.data)
        .catch((err) => {
            throw err.response ? err.response.data : err;
        });
};
