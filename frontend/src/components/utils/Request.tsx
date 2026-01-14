// import axios from "axios";
// import { config } from "./Config";

// export const request = async (url = "", method = "get", data = {}) => {
//     const user = JSON.parse(localStorage.getItem("user") || "null");
//     const token = user?.token || "";
//     const headers: Record<string, string> = {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         // Authorization: `Bearer ${token()}`,
//     };
//     if (token) {
//         // headers["Authorization"] = `Bearer ${token}`;
//         headers.Authorization = `Bearer ${token}`;
//     }
//     if (data instanceof FormData) {
//         delete headers["Content-Type"];
//     }
//     return axios({
//         url: config.api_url + url,
//         method,
//         data,
//         headers,
//     })
//         .then((res) => res.data)
//         .catch((err) => {
//             throw err.response ? err.response.data : err;
//         });
// };
import axios from "axios";
import { config } from "./Config";

export const request = async (url = "", method = "get", data: any = {}) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = user?.token || "";

    const headers: Record<string, string> = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    if (token) headers.Authorization = `Bearer ${token}`;
    if (data instanceof FormData) delete headers["Content-Type"];

    try {
        const res = await axios({
            url: config.api_url + url,
            method,
            data,
            headers,
            timeout: 8000, // optional but recommended
        });

        return res.data;
    } catch (err: any) {
        if (!err.response) {
            localStorage.removeItem("user");
            window.location.href = "/login";
            throw err;
        }

        const status = err.response.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem("user");
            window.location.href = "/login";
        }

        throw err.response.data;
    }
};
