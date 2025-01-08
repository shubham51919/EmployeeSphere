import axios from "axios";
import { API_URL } from "../config";


export const hrApi = (accessToken) => {
    const headers = {
        "Content-Type": "application/json",
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return axios.create({
        baseURL: `${API_URL}/hrQueries`,
        headers,
    });
};


