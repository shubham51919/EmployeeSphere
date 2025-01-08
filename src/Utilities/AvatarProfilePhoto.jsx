import { Avatar } from "@fluentui/react-northstar";
import React from "react";
import useProfilePhoto from "../hooks/api/useProfilePhoto";

const AvatarProfilePhoto = ({ mailId, name }) => {
  const { profilePhoto } = useProfilePhoto(mailId);
  return <Avatar image={profilePhoto} name={name} />;
};

export default AvatarProfilePhoto;
