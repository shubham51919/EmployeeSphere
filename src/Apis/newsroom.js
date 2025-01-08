import axios from "axios";
import { API_URL } from "../config";

const newsroomApi = (accessToken) => {
    const headers = {
        "Content-Type": "application/json",
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return axios.create({
        baseURL: `${API_URL}/newsroom`,
        headers,
    });
};

export default newsroomApi;
