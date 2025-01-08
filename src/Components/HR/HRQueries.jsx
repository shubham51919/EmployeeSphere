import React, { useEffect, useState } from "react";
import HrHeader from "./Header/HrHeader.jsx";
import TicketForm from "./Ticket/TicketForm.jsx";
import "./hr.css";
import YourQueries from "./Queries/YourQueries.jsx";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { app } from "@microsoft/teams-js";
import { useDispatch } from "react-redux";
import BackButton from "../../Utilities/BackButton.jsx";
import axios from 'axios'
import {
  Flex,
  Text,
  Segment,
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
} from "@fluentui/react-northstar";
import "./hr.css";
import {
  setTheme,
  fillInProgressResult,
  fillPendingResult,
  fillResolvedResult,
  setLoad,
  setTotalPending,
  setTotalQueries,
} from "../../redux/actions/index.js";
import { toast } from "react-toastify";
import { hrApi } from "../../Apis/hrApi.js";

const HRQueries = ({ hooks }) => {
  const { CompanyReducer, hrEmpReducer } = useSelector((state) => {
    return state;
  });
  const { totalQueries, totalPending } = hrEmpReducer;
  const [currTheme, setCurrTheme] = useState(CompanyReducer.theme);
  const [mainAppTheme, setMainAppTheme] = useState();

  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const apiVarMain = hrApi(accessToken)

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
      setMainAppTheme(teamsDarkTheme);
    } else if (currTheme === "contrast") {
      hooks(teamsHighContrastTheme);
      setMainAppTheme(teamsHighContrastTheme);
    } else {
      hooks(teamsTheme);
      setMainAppTheme(teamsTheme);
    }
  }, [currTheme]);
  const dispatch = useDispatch();
  const Headertheme = {
    // siteVariables: {
    //   colorScheme: {
    //     border: '#F5F5F5',
    //   },
    // },
    componentVariables: {
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
    },
    componentStyles: {
      Flex: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
    },
  };

  const loggedUserState = useSelector((state) => {
    return state.formReducer;
  });
  const { loggedInUserDetails } = loggedUserState;
  const { EmployeeID } = loggedInUserDetails;
  useEffect(() => {
    const getRaisedTicket = async () => {
      try {
        dispatch(setLoad(true));
        const ticketData = await apiVarMain.get(
          `/getTickets?hrmId=${EmployeeID}`
        );
        dispatch(fillInProgressResult(ticketData?.data?.InProgressResult));
        dispatch(fillPendingResult(ticketData?.data?.pendingResult));
        dispatch(fillResolvedResult(ticketData?.data?.resolvedResult));
        dispatch(setLoad(false));
        dispatch(
          setTotalQueries(
            ticketData?.data?.pendingResult?.length +
            ticketData?.data?.InProgressResult?.length +
            ticketData?.data?.resolvedResult?.length
          )
        );
        dispatch(setTotalPending(ticketData?.data?.pendingResult?.length));
      } catch (err) {
        dispatch(setLoad(false));
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };
    getRaisedTicket();
  }, [dispatch, EmployeeID]);
  const segmentsTheme = {
    siteVariables: {
      colorScheme: {
        default: {
          backgroundHover: `${CompanyReducer.theme === "default" ? `black` : `white`
            }`,
          foreground: `${CompanyReducer.theme === "default" ? `#f5f5f5` : `#5B5FC7`
            }`,
        },
      },
    },
    componentVariables: {
      Flex: ({ colorScheme }) => ({
        color: colorScheme.default.backgroundHover,
        backgroundColor: colorScheme.default.foreground,
      }),
    },
    componentStyles: {
      Flex: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
    },
  };

  return (
    <>
      <Flex column className="main-ref" hAlign="center">
        <Flex className="breadcrumb-div" style={{ paddingBottom: "0.5rem" }}>
          <BackButton currTheme={currTheme} />
          <Text>{">"}</Text>
          <Link to="/hr" className="breadcrumb-curr">
            HR Queries
          </Link>
        </Flex>
        <HrHeader {...{ hooks }} />
        <Flex
          gap="gap.medium"
          style={{
            minHeight: "70vh",
            marginBottom: "3vh",
            gap: "1rem",
          }}
          className="new-hr-class"
        // className="ticket-provider"
        >
          <FluentUiProvider
            theme={mergeThemes(mainAppTheme, Headertheme)}
            style={{ margin: 0 }}
          >
            <Flex size="size.half" className="ticket-form" column>
              <Text content="Raise Ticket" className="queries-heading-rt" />
              <Flex hAlign="center" style={{ height: "45vh" }}>
                <TicketForm />
              </Flex>
            </Flex>
          </FluentUiProvider>
          <FluentUiProvider theme={mergeThemes(mainAppTheme, Headertheme)}>
            <Flex size="size.half" className="queries-form">
              <Flex space="between" column>
                <Flex space="between" vAlign="center" className="heading-q">
                  <Text content="Your Queries" className="queries-heading" />
                  <Flex
                    className="scoreboard"
                    gap="gap.medium"
                    style={{ height: "1.5rem" }}
                  >
                    <Flex className="score-label-new">
                      <Segment
                        vAlign="center"
                        styles={{
                          boxShadow: "none",
                          padding: "0rem 0rem 0rem 0.5rem !important",
                        }}
                        content={
                          <FluentUiProvider
                            theme={mergeThemes(mainAppTheme, segmentsTheme)}
                          >
                            <Flex
                              className="leader-head-tab"
                              style={{ gap: "0.2rem" }}
                            >
                              <Text
                                content="Total Queries :  "
                                style={{
                                  fontSize: "0.8rem",
                                  fontWeight: "400",
                                }}
                              />
                              <Text
                                content={` ${totalQueries}`}
                                className="score-rank"
                                style={{
                                  fontSize: "0.8rem",
                                  fontWeight: "600",
                                }}
                              />
                            </Flex>
                          </FluentUiProvider>
                        }
                        style={{ padding: "0rem 0.5rem" }}
                        className="query-data"
                      />
                    </Flex>
                    <Flex className="score-label-new">
                      <Segment
                        styles={{ boxShadow: "none" }}
                        content={
                          <FluentUiProvider
                            theme={mergeThemes(mainAppTheme, segmentsTheme)}
                          >
                            <Flex
                              className="leader-head-tab"
                              style={{ gap: "0.2rem" }}
                            >
                              <Text
                                content="Pending :  "
                                style={{
                                  fontSize: "0.8rem",
                                  fontWeight: "400",
                                }}
                              />
                              <Text
                                content={`${totalPending}`}
                                style={{
                                  fontSize: "0.8rem",
                                  fontWeight: "600",
                                }}
                                className="score-rank"
                              />
                            </Flex>
                          </FluentUiProvider>
                        }
                        style={{ padding: "0rem 0.5rem" }}
                        className="query-data"
                      />
                    </Flex>
                  </Flex>
                </Flex>
                <Flex style={{ paddingLeft: "1rem" }} hAlign="center">
                  <YourQueries />
                </Flex>
              </Flex>
            </Flex>
          </FluentUiProvider>
        </Flex>
      </Flex>
    </>
  );
};

export default HRQueries;
