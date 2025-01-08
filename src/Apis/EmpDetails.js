import axios from "axios";
import { API_URL, EMP_DETAILS_API_URL } from "../config";
import { TALSUITE_URL } from "../config";


export const EmpDetails = (accessToken) => {
    return axios.create({
        baseURL: `${EMP_DETAILS_API_URL}`
    });
};