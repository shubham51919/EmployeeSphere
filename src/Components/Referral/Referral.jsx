import React, { useEffect, useState } from "react";
import { Flex } from "@fluentui/react-northstar";
import "./referral.css";
import "./mobileReferral.css";
// import ListMain from "./ListMain";
import AllReferrals from "./AllReferrals/AllReferrals.jsx";
import Leaderboard from "./Leaderboard/Leaderboard.jsx";
import RefHeader from "./Overview/RefHeader";
import CardsOverview from "./Overview/CardsOverview";
import { useSelector, useDispatch } from "react-redux";
import BackButton from "../../Utilities/BackButton";
import { ToastContainer, toast } from "react-toastify";
import {
  teamsTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  Text,
} from "@fluentui/react-northstar";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import ParticularReferralDialog from "./ParticularReferralDialog";
import {
  fillReferredCandidates,
  fillReferredLeaderboard,
  fillReferredStatus,
  resetCompanyState,
  setLeaderboardLoading,
  setRerenderReferralPortal,
  setTheme,
  setYourReferralsLoading,
} from "../../redux/actions";
import { app } from "@microsoft/teams-js";
import { tailsuiteApi } from "../../Apis/ApiMain.js";
import { TALSUITE_URL } from "../../config";
import axios from "axios";

const Referral = ({ hooks }) => {
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });

  const myState = useSelector((state) => {
    return state.formReducer; //1
  });

  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail; //1
  });

  const dispatch = useDispatch();
  const { rerenderReferralPortal } = CompanyReducer;
  const [currTheme, setCurrTheme] = useState(CompanyReducer.theme);
  const [jobRoleData, setJobRoleData] = useState([]);

  //  get theme

  useEffect(() => {
    app.initialize().then(() => {
      app.registerOnThemeChangeHandler((theme) => {
        setCurrTheme(theme);
      });
      app.getContext().then((context) => {
        setCurrTheme(context.app.theme);
      });
    });
  }, []);

  useEffect(() => {
    dispatch(setTheme(currTheme));
    if (currTheme === "dark") {
      hooks(teamsDarkTheme);
      // setMainAppTheme(teamsDarkTheme);
    } else if (currTheme === "contrast") {
      hooks(teamsHighContrastTheme);
      // setMainAppTheme(teamsHighContrastTheme);
    } else {
      hooks(teamsTheme);
      // setMainAppTheme(teamsTheme);
    }
  }, [currTheme]);

  useEffect(() => {
    // Get the data from API
    const jobPayload = {
      Proc: "Cel_GetRequirements_CBO",
      args: [
        { Key: "APIKey", Value: "c66c5d9f-ec1d-4cfc-b73a-8a503cc03c1b" },
        { Key: "Page_From", Value: 0 },
        { Key: "PageSize", Value: 30 },
      ],
    };
    const tailsuiteMain = tailsuiteApi();
    const OptionData = async () => {
      try {
        const res = await tailsuiteMain.post("/API/Call", jobPayload);
        const obj = JSON.parse(res.data.Data);
        setJobRoleData(obj[0]);
      } catch (err) {
        console.log(err);
      }
    };
    OptionData();
  }, []);

  useEffect(() => {
    dispatch(setYourReferralsLoading(true));
    dispatch(setLeaderboardLoading(true));
    let dashboardPayload = {
      Proc: "Cel_EmployeeRef_DashBoard",
      args: [
        { Key: "APIKey", Value: "c66c5d9f-ec1d-4cfc-b73a-8a503cc03c1b" },
        {
          Key: "EmployeeEmail",
          Value: userEmail,
        },
      ],
    };
    let dashboardConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${TALSUITE_URL}/API/Call`,
      data: dashboardPayload,
    };

    const getDashboardData = async () => {
      try {
        let dashboardRes = await axios.request(dashboardConfig);
        const parsedData = JSON.parse(dashboardRes.data?.Data);
        dispatch(fillReferredStatus(parsedData));
        dispatch(fillReferredCandidates(parsedData));
        dispatch(fillReferredLeaderboard(parsedData));
        dispatch(setYourReferralsLoading(false));
        dispatch(setLeaderboardLoading(false));
      } catch (err) {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };
    getDashboardData();

    // clean up function
    return () => {
      dispatch(resetCompanyState());
    };
  }, [dispatch, rerenderReferralPortal]);

  // const YourReferralsItems = referredCandidates
  //   .sort((a, b) => {
  //     return a.id < b.id ? 1 : -1;
  //   })
  //   .map((user) => {
  //     return <ParticularReferralDialog user={user} />;
  //   });

  return (
    <>
      <Flex column className="main-ref" hAlign="center">
        <Flex className="breadcrumb-div">
          <BackButton currTheme={currTheme} />
          <Text>{">"}</Text>
          <Link to="/refer" className="breadcrumb-curr">
            Employee Referral
          </Link>
        </Flex>
        <RefHeader myState={myState} jobRoleData={jobRoleData} />
        <Flex
          gap="gap.medium"
          style={{
            minHeight: "70vh",
            marginBottom: "3vh",
            gap: "1.5rem",
          }}
        >
          <Flex
            className="leaderboard-card-list"
            style={{ marginRight: "1.5rem !important" }}
            column
            size="size.half"
          >
            <div
              className="overview-cards"
              style={{ marginBottom: "1.5rem", pointerEvents: "none" }}
            >
              <CardsOverview />
            </div>
            <div>
              <Leaderboard name={"Leaderboard"} />
            </div>
          </Flex>
          <Flex className="leaderboard-card-list" column size="size.half">
            <div>
              <AllReferrals />
            </div>
          </Flex>
        </Flex>
      </Flex>
      <ToastContainer autoClose={3000} />
    </>
  );
};

export default Referral;
