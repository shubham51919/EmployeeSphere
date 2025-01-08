import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Image,
  Accordion,
  Loader,
  List,
  Skeleton,
} from "@fluentui/react-northstar";
import _ from "lodash";
import { toast } from "react-toastify";
import "../hr.css";

import emptyimg from "../../../Assets/hrAssets/illustration.svg";

import { useSelector } from "react-redux";
import Resolved from "./Resolved";
import PendingPanels from "./PendingPanels";
import InProcessPanel from "./InProcessPanel";
import { hrApi } from "../../../Apis/hrApi";

const YourQueries = () => {
  // const [appTheme, setAppTheme] = useState();
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });
  const userInfo = useSelector((state) => {
    return state.formReducer;
  });
  const name = useSelector((state) => {
    return state.authReducer.userEmail
  });


  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const apiVarMain = hrApi(accessToken)
  // useEffect(() => {
  //   if (CompanyReducer.theme === "dark") {
  //     setAppTheme(teamsDarkTheme);
  //   } else if (CompanyReducer.theme === "contrast") {
  //     setAppTheme(teamsHighContrastTheme);
  //   } else if (CompanyReducer.theme === "default") {
  //     setAppTheme(teamsTheme);
  //   }
  // }, [CompanyReducer]);

  const handleFurtherClick = (ticket) => {
    // setIsFurtherLoading(true);
    let data = {
      Name: `${userInfo?.loggedInUserDetails?.FirstName} ${userInfo?.loggedInUserDetails?.LastName}`,
      hrmId: userInfo?.loggedInUserDetails?.EmployeeID,
      employeeEmail: name,
      description: ticket.description,
      reply: ticket.reply,
      createdAt: `${(getDate(ticket.createdAt), " ", getTime(ticket.createdAt))
        }`,
    };

    if (ticket.updatedAt) {
      data.updatedAt = `${(getDate(ticket.updatedAt), " ", getTime(ticket.updatedAt))
        }`;
    }
    if (ticket.reasonType) {
      data.reasonType = ticket.reasonType;
    }


    toast(
      <Flex gap="gap.small" vAlign="center">
        <Loader size="small" />
        <Text content="Escalation in Progress. Please wait" />
      </Flex>,
      {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: false,
        hideProgressBar: true,
        closeButton: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
      }
    );
    apiVarMain
      .post(`/escalateFurther`, data)
      .then((response) => {
        toast.dismiss();
        //console.log(JSON.stringify(response.data));

        toast.success("Mail sent successfully");
      })
      .catch((error) => {
        toast.dismiss();

        toast.error("Unable to send mail , Please try again");
      });
  };

  const myQueryState = useSelector((state) => {
    return state.hrEmpReducer;
  });
  const { inProgressResult, pendingResult, resolvedResult, isLoading } =
    myQueryState;

  const getDate = (newdate) => {
    const { date } = convertUTCtoIST(newdate);
    return date;
  };

  const getTime = (newtime) => {
    const { time } = convertUTCtoIST(newtime);
    return time;
  };
  function convertUTCtoIST(utcDateStr) {
    const utcDate = new Date(utcDateStr);
    const istDate = new Date(utcDate.getTime()); // IST offset from UTC is +5.5 hours

    const formattedDate = istDate
      .toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");

    const formattedTime = istDate.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });

    return { date: formattedDate, time: formattedTime };
  }

  const [activeIndex, setActiveIndex] = useState(-1);

  // const [panels, setPanels] = useState([]);
  // setPanels(pendingPanels);
  const [panels, setPanels] = useState([]);
  let combinePanel = [];

  useEffect(() => {
    const pendingPanels = pendingResult.map((ticket) => {
      return {
        key: ticket.id,
        data: { ticket },
        title: (
          <PendingPanels
            ticket={ticket}
            handleFurtherClick={handleFurtherClick}
            iconVisible={true}
            dividerVisible={true}
            escBtnVisible={true}
            lineImage={false}
          />
        ),
        content: <></>,
      };
    });
    const inProcessPanel = inProgressResult.map((ticket) => {
      return {
        key: ticket.id,
        data: { ticket },

        title: (
          <>
            <InProcessPanel
              ticket={ticket}
              handleFurtherClick={handleFurtherClick}
              iconVisible={true}
              dividerVisible={true}
              escBtnVisible={true}
              lineImage={false}
            />
          </>
        ),
        content: <></>,
      };
    });
    const resolvedPanel = resolvedResult.map((ticket) => {
      return {
        key: ticket.id,
        data: { ticket },
        title: (
          <Resolved
            ticket={ticket}
            handleFurtherClick={handleFurtherClick}
            iconVisible={true}
            dividerVisible={true}
            escBtnVisible={true}
            lineImage={false}
          />
        ),
        content: <></>,
      };
    });

    combinePanel = [...pendingPanels, ...resolvedPanel, ...inProcessPanel];

    setPanels(combinePanel);
    // //console.log(panels, "panels");
  }, [pendingResult, inProgressResult, resolvedResult, CompanyReducer]);

  const handleActiveIndexChange = (e, { activeIndex }) => {
    setActiveIndex(activeIndex);
    // update panel styles based on which panel is active
    panels?.forEach((panel, index) => {
      if (index === activeIndex) {
        if (panel?.data?.ticket?.status == 2) {
          panel.title = (
            <Resolved
              ticket={panel.data?.ticket}
              handleFurtherClick={handleFurtherClick}
              iconVisible={false}
              dividerVisible={false}
              escBtnVisible={true}
              lineImage={true}
            />
          );
          panel.content = (
            <>
              <InProcessPanel
                ticket={panel.data?.ticket}
                handleFurtherClick={handleFurtherClick}
                iconVisible={false}
                dividerVisible={false}
                escBtnVisible={false}
                lineImage={true}
              />
              <PendingPanels
                ticket={panel.data?.ticket}
                handleFurtherClick={handleFurtherClick}
                iconVisible={false}
                dividerVisible={true}
                escBtnVisible={false}
                lineImage={true}
              />
            </>
          );
        } else if (panel.data.ticket.status === 1) {
          panel.title = (
            <InProcessPanel
              ticket={panel.data?.ticket}
              handleFurtherClick={handleFurtherClick}
              iconVisible={false}
              dividerVisible={false}
              escBtnVisible={true}
              lineImage={true}
            />
          );
          panel.content = (
            <PendingPanels
              ticket={panel.data?.ticket}
              handleFurtherClick={handleFurtherClick}
              iconVisible={false}
              dividerVisible={true}
              escBtnVisible={false}
              lineImage={true}
            />
          );
        } else {
          panel.title = (
            <PendingPanels
              ticket={panel.data?.ticket}
              handleFurtherClick={handleFurtherClick}
              iconVisible={false}
              dividerVisible={true}
              escBtnVisible={true}
              lineImage={false}
            />
          );
          panel.content = <></>;
        }
      } else {
        if (panel?.data?.ticket?.status === 2) {
          panel.title = (
            <Resolved
              ticket={panel.data?.ticket}
              handleFurtherClick={handleFurtherClick}
              iconVisible={true}
              dividerVisible={true}
              escBtnVisible={true}
              lineImage={false}
            />
          );
          panel.content = <></>;
        } else if (panel?.data?.ticket?.status === 1) {
          panel.title = (
            <InProcessPanel
              ticket={panel.data?.ticket}
              handleFurtherClick={handleFurtherClick}
              iconVisible={true}
              dividerVisible={true}
              escBtnVisible={true}
              lineImage={false}
            />
          );
          panel.content = <></>;
        } else {
          panel.title = (
            <PendingPanels
              ticket={panel.data?.ticket}
              handleFurtherClick={handleFurtherClick}
              iconVisible={true}
              dividerVisible={true}
              escBtnVisible={true}
              lineImage={false}
            />
          );
          panel.content = <></>;
        }
      }
    });
  };
  return (
    <Flex column className="inside-form-queries">
      {isLoading ? (
        <List className="list-skeleton">
          {_.times(7, (index) => (
            <List.Item
              key={index}
              styles={{
                backgroundColor:
                  index % 2 === 0
                    ? `${CompanyReducer.theme === "default"
                      ? `#f5f2f2`
                      : `rgb(29,29,28)`
                    }`
                    : "transparent",
              }}
              media={
                <Skeleton animation="wave">
                  <Skeleton.Shape round width="36px" height="36px" />
                </Skeleton>
              }
              header={
                <Skeleton
                  animation="wave"
                  styles={{
                    paddingBottom: "5px",
                  }}
                >
                  <Skeleton.Line width="100px" />
                </Skeleton>
              }
              content={
                <>
                  <Skeleton animation="wave">
                    <Skeleton.Line width="300px" />
                  </Skeleton>
                </>
              }
              index={index}
            />
          ))}
        </List>
      ) : // <Loader style={{ margin: "auto", minHeight: "45vh" }} />
        panels.length > 0 ? (
          <Accordion
            panels={panels}
            activeIndex={activeIndex}
            onActiveIndexChange={handleActiveIndexChange}
            exclusive
            className="accordion-rows"
          />
        ) : (
          <Flex vAlign="center">
            <Image
              src={emptyimg}
              className="main-list-referral"
              style={{ marginTop: "9vh", height: "15vw", width: "8vw" }}
            />
          </Flex>
        )}
    </Flex>
  );
};

export default YourQueries;
