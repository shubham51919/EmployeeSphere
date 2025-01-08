import React from "react";
import StaticTable from "./Main";
const Admin = ({hooks}) => {

  return (
    <>
      <div className="adminmain" style={{display:"flex",flexDirection:"column"}}>
          
        <StaticTable hooks={hooks} />
      </div>
    </>
  );
};

export default Admin;
