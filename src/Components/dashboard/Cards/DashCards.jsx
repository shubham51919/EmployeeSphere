import React from "react";
import { useSelector } from "react-redux";

import DashCard from "./DashCard";
import "../dashboard.css";
import newicon1 from "../../../Assets/dashboardAssets/cardImg1.svg";
import newicon2 from "../../../Assets/dashboardAssets/cardImg2.svg";
import newicon6 from "../../../Assets/dashboardAssets/last1.webp";
import newicon5 from "../../../Assets/dashboardAssets/last2.webp";
import foodDashcard from "../../../Assets/dashboardAssets/foodDashcard.png";
import newicon4 from "../../../Assets/dashboardAssets/last3.webp";
import companyArchive from "../../../Assets/dashboardAssets/companyArchive.png";
import employeeNewsroom from "../../../Assets/dashboardAssets/employeeNewsroomImg.svg";

const DashCards = () => {
  const name = useSelector((state) => {
    return state.authReducer.userEmail;
  });

  const hrMails = [
  ];
  const empMails = [
  ];
  const CAMails = [
  ];
  const FoodMails = [
  ];

  const userHrAccess = hrMails.includes(name);
  const userEmpAccess = empMails.includes(name);
  const userCAAccess = CAMails.includes(name);
  const foodAccess = FoodMails.includes(name);

  const carddata = [
    {
      content: "Employee Referral",

      icon: newicon1,

      subcontent: "Connect Talent, Reap Rewards!  ",

      link: "/refer",

      access: true,
    },

    {
      content: "HR Queries",

      icon: newicon2,

      subcontent: "Tap for Instant HR support.  ",

      link: "/hr",

      access: true,
    },

    {
      content: "Employee Newsroom",

      icon: employeeNewsroom,

      subcontent: "Stay Informed, Stay Empowered   ",

      link: "/career-advice",

      access: true,
    },
    // {
    //   content: "Referral Admin",

    //   icon: newicon6,

    //   subcontent: "Streamline hiring with up-to-date resume access.",

    //   link: "/admin",

    //   access: userEmpAccess,
    // },
    {
      content: "HR Queries Admin",

      icon: newicon5,

      subcontent: "Resolve employee inquiries with our comprehensive portal. ",

      link: "/hradmin",

      access: userHrAccess,
    },

    {
      content: "Employee Newsroom Admin",

      icon: newicon4,

      subcontent:
        "Empower communication and decisions with full post visibility.",

      link: "/career-advice-admin",

      access: userCAAccess,
    },
    {
      content: "Food Zone",

      icon: foodDashcard,

      subcontent: "Culinary Delights, Just a Click Away!   ",

      link: "/food-portal",

      access: true,
    },
    // {
    //   content: "Food Portal Admin",

    //   icon: foodDashcard,

    //   subcontent:
    //     "Gain Full Visibility and Control as you Access a Comprehensive List of Posts and Manage Employee Suggestions, Empowering Effective Communication and Decision-Making. ",

    //   link: "/food-portal-admin",

    //   access: foodAccess,
    // },
    // {
    //   content: "Company Archive",

    //   icon: companyArchive,

    //   subcontent: "Safeguarding Documents and Empowering Insights ",

    //   link: "/documents",

    //   access: true,
    // },
    // {
    //   content: "Travel",

    //   icon: companyArchive,

    //   subcontent: "Safeguarding Documents and Empowering Insights ",

    //   link: "/travel",

    //   access: true,
    // },
    // {
    //   content: "Travel Admin",

    //   icon: companyArchive,

    //   subcontent: "Safeguarding Documents and Empowering Insights ",

    //   link: "/travel-admin",

    //   access: true,
    // },
  ];
  return (
    <div className="DashCards">
      {carddata.map((data) => {
        if (data.access) {
          return <DashCard key={window.crypto.randomUUID()} carddata={data} />;
        }
        return <></>;
      })}
    </div>
  );
};

export default DashCards;
