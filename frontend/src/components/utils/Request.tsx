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
            timeout: 15000,
        });

        return res.data;
    } catch (err: any) {
        // Network error / server down: surface it, but keep the session.
        if (!err.response) {
            throw { message: "Cannot reach the server. Please try again." };
        }

        // 401 = token missing/expired -> sign out.
        // 403 = logged in but not allowed -> keep the session and show the error.
        if (err.response.status === 401 && !url.startsWith("login")) {
            localStorage.removeItem("user");
            window.location.href = "/login";
        }

        throw err.response.data;
    }
};
