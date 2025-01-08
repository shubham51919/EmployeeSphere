import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const useProfilePhoto = (userEmail) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState(null);
  const accessTkn = useSelector((state) => {
    return state.authReducer.accessToken;
  });

  useEffect(() => {
    const accessToken = accessTkn;
    const fetchProfilePhotos = async () => {
      try {
        const graphEndpoint = "https://graph.microsoft.com/v1.0/users/";

        const graphConfig = {
          headers: {
            Authorization: `Bearer ${accessToken} `,
            "Content-Type": "image/jpeg",
          },
          responseType: "arraybuffer",
        };

        const response = await axios.get(
          `${graphEndpoint}${userEmail}/photo/$value`,
          graphConfig
        );

        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        setProfilePhoto(`data:image/jpeg;base64,${base64}`);
      } catch (error) {
        setError(error);
      }
    };

    fetchProfilePhotos();
  }, [userEmail]);

  return { profilePhoto, error };
};

export default useProfilePhoto;
