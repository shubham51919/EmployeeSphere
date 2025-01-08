import axios from "axios";
import { API_URL, EMP_DETAILS_API_URL } from "../config";
import { TALSUITE_URL } from "../config";


export const apiMain = (accessToken) => {
    const headers = {
        "Content-Type": "application/json",
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return axios.create({
        baseURL: `${API_URL}/referralPortal`,
        headers,
    });
};


export const tailsuiteApi = (accessToken) => {
    return axios.create({
        baseURL: `${TALSUITE_URL}`,
        // headers,
    });
};

