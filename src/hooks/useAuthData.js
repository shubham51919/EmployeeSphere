import { useSelector } from "react-redux";

export function useAuthData() {
  const { accessToken, userEmail } = useSelector((state) => state.authReducer);

  return { accessToken, userEmail };
}
