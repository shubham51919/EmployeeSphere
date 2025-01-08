import { useEffect, useState } from "react";
import API from "../../Components/Newsroom/API/apiClient";

export const useApi = ({ method, endpoint, payload }) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Use dynamic property access to call the appropriate HTTP method
      const response = await API[method](endpoint, payload);
      setResponse(response.data);
    } catch (err) {
      setError(err.message || "Unexpected Error!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return {
    fetchData,
    response,
    error,
    loading,
  };
};

export default useApi;
