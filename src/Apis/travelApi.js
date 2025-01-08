import axios from "axios";
import { API_URL } from "../config";

const travelAdminApi = (accessToken) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return axios.create({
    baseURL: `${API_URL}/api/travel/admin`,
    headers,
  });
};
export default travelAdminApi;
