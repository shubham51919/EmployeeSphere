import React, { useEffect, useState } from "react";
import {
  ChevronStartIcon,
  ChevronEndIcon,
} from "@fluentui/react-icons-northstar";
import ViewDialog from "../ViewTicket/ViewDialog";
import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  mergeThemes,
} from "@fluentui/react-northstar";
import EmptyImg from "../../../Assets/referralAssets/EmptyImg.svg";
import forwardIcon from "../../../Assets/hrAdminAssets/forwardIcon.svg";
import {
  Flex,
  Text,
  List,
  Button,
  Image,
  Label,
  Avatar,
  Loader,
  Input,
  Skeleton,
} from "@fluentui/react-northstar";
import "../hradmin.css";
import _ from "lodash";
//import data for table in hr queue
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setLoadHrAdminTable } from "../../../redux/actions";
import { hrApi } from "../../../Apis/hrApi";

const TicketRows = ({
  searchStr,
  searchClicked,
  setSearchClicked,
  currentPage,
  goToPage,
  setClearClicked,
  clearClicked,
  setCurrentPage,
  setGoToPage,
}) => {


  const [usersDetails, setUserDetails] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [goToPage, setGoToPage] = useState(1);

  const [isOpen, setIsOpen] = useState(false);
  const [totalPages, setTotalPages] = useState("?");
  const [noResult, setNoResult] = useState(false);
  const [hrDataLoading, setHrDataLoading] = useState(false);


  let appTheme = teamsTheme;
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });
  const name = useSelector((state) => {
    return state.authReducer.userEmail
  });
  const accessTkn = useSelector((state) => {
    return state.authReducer.accessToken;
  });
  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const apiVarMain = hrApi(accessToken)




  if (!CompanyReducer.theme) {
  } else {
    // hooks(theme.theme);
    if (CompanyReducer.theme === "dark") {
      appTheme = teamsDarkTheme;
    } else if (CompanyReducer.theme === "contrast") {
      appTheme = teamsHighContrastTheme;
    } else if (CompanyReducer.theme === "default") {
      appTheme = teamsTheme;
    }
  }
  const newTableTheme = {
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


  const dispatch = useDispatch();

  const handlePrev = () => {
    if (currentPage <= 1) {
      return;
    }
    setCurrentPage((prev) => {
      return prev - 1;
    });
    setGoToPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage >= totalPages) {
      return;
    }
    setCurrentPage((prev) => {
      return prev + 1;
    });
    setGoToPage(currentPage + 1);
  };

  const fetchProfilePhotos = async (user) => {
    const accessToken = accessTkn;
    const graphConfig = {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-Type": "image/jpeg",
      },
      responseType: "arraybuffer",
    };
    const updatedUsers = await Promise.all(
      user.map(async (user) => {
        console.log(user, "user");
        try {
          const res = await axios.get(
            `https://graph.microsoft.com/v1.0/users/${user.employeeEmail}/photo/$value`,
            graphConfig
          );
          const base64 = btoa(
            new Uint8Array(res.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          setUserDetails((prevUsers) => {
            return prevUsers.map((prevUser) => {
              if (prevUser.employeeEmail === user.employeeEmail) {
                return {
                  ...prevUser,
                  profilePhoto: "data:;base64," + base64,
                  forwardStatus: 0,
                  inProcessStatus: 0,
                };
              }
              return prevUser;
            });
          });
          return {
            ...user,
            profilePhoto: "data:;base64," + base64,
            forwardStatus: 0,
            inProcessStatus: 0,
          };
        } catch (error) {
          return {
            ...user,
            profilePhoto: "",
            forwardStatus: 0,
            inProcessStatus: 0,
          };
        }
      })
    );
    setUserDetails(updatedUsers);
  };

  useEffect(() => {
    const loggedUser = name;
    const fetchData = async () => {
      setHrDataLoading(true);
      try {
        const hrPayload = {
          hrMail: loggedUser,
          page: currentPage,
          limit: 10,
          search: searchStr,
          adminMail: name
        };

        const accessToken = accessTkn;

        const graphConfig = {
          headers: {
            Authorization: `Bearer ${accessToken} `,
            "Content-Type": "image/jpeg",
          },
          responseType: "arraybuffer",
        };

        const res = await apiVarMain.post(
          `/getHrTickets`,
          hrPayload
        );

        const resData = res.data.result;

        if (resData.length === 0) {
          setNoResult(true);
          setSearchClicked(false);
          setClearClicked(false);
        } else {
          setNoResult(false);
          setTotalPages(res.data.pages.Total_Pages);
          setSearchClicked(false);
        }

        const updatedUsers = resData.map((user) => {
          return {
            ...user,
            profilePhoto: "",
            forwardStatus: 0,
            inProcessStatus: 0,
          };
        });
        setUserDetails(updatedUsers);
        setHrDataLoading(false);
        fetchProfilePhotos(updatedUsers);
      } catch (err) {
        //console.log(err);
        setSearchClicked(false);
        setClearClicked(false);
        setHrDataLoading(false); // Make sure to set the loading state to false in case of an error
      }
    };

    // Call the fetchData function when searchClicked or currentPage changes
    if (searchClicked || currentPage) {
      fetchData();
    }
  }, [dispatch, currentPage, searchClicked, clearClicked]);

  function labelStyle(labelstatus) {
    if (labelstatus === "Resolved") {
      return {
        backgroundColor: "rgb(226,241,232)",
        borderRadius: "5rem",
        padding: "10px 10px",
        color: "green",
        fontSize: "0.7rem",
      };
    } else if (labelstatus === "Pending") {
      return {
        backgroundColor: "rgb(250,223,214)",
        borderRadius: "5rem",
        padding: "10px 10px",
        color: "darkred",
        fontSize: "0.7rem",
      };
    } else if (labelstatus === "In Progress") {
      return {
        backgroundColor: "rgb(219,232,251)",
        borderRadius: "5rem",
        padding: "10px 10px",
        color: "darkblue",
        fontSize: "0.7rem",
      };
    }
    return {
      backgroundColor: "rgba(242, 222, 242, 1)",
      borderRadius: "5rem",
      padding: "10px 10px",
      color: "purple",
      fontSize: "0.7rem",
    };
  }
  const apptheme = {
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
      List: {
        backgroundColor: `${CompanyReducer.theme === "default" ? "#ffffff" : "#0F0F0F"
          }`,
      },
    },
  };
  const paginationTheme = {
    componentVariables: {
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.default.backgroundHover,
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

  // //console.log(hradminqueryData, "hrAdminData");

  const changeStatus = (id, status) => {
    // if (eachTicket.id === id && eachTicket.status !== 2 && status !== -1) {
    //   return {
    //     ...eachTicket,
    //     status: status,
    //   };
    // }
    setUserDetails((prev) => {
      return prev.map((eachTicket) => {
        if (eachTicket.id === id && status === 2) {
          return {
            ...eachTicket,
            status: status,
          };
        } else if (
          eachTicket.id === id &&
          status === 1 &&
          eachTicket.status !== 2 &&
          eachTicket.status !== -1
        ) {
          return {
            ...eachTicket,
            status: 1,
          };
        } else if (eachTicket.id === id && status === -1) {
          return {
            ...eachTicket,
            status: -1,
          };
        }
        return eachTicket;
      });
    });
  };

  const headingItems = [
    {
      header: (
        <Flex className="admin-heading-row" vAlign="center">
          <Flex
            className="admin-head-row-element-biggest"
            vAlign="center"
            gap="gap.medium"
            style={{ flex: "18%" }}
          >
            <Text content="Employee Name | HRM ID" />
          </Flex>
          <Text
            content="Department"
            className="admin-head-row-element-big"
            style={{ flex: "13%" }}
          />
          <Text
            content="Issue Type"
            className="admin-head-row-element-mid"
            style={{ flex: "11%" }}
          />
          <Text
            content="Date"
            className="admin-head-row-element"
            style={{ padding: "" }}
          />
          <Text
            content="Status"
            className="admin-head-row-element"
            style={{ flex: "12%" }}
          />
          <Text
            content="Actions"
            className="admin-head-row-element"
            style={{ padding: "" }}
          />
        </Flex>
      ),
    },
  ];
  const rowItems = usersDetails.map((item) => {
    return {
      header: (
        <Flex className="admin-heading-row" vAlign="center">
          <Flex
            vAlign="center"
            className="admin-heading-row-element-biggest row-item-main"
            gap="gap.small"
            style={{ flex: "18%" }}
          >
            <Avatar name={item.Name} image={item.profilePhoto} />

            <Text
              content={`${item.Name} | ${item.hrmId}`}
              className="admin-heading-row-element-big row-item-main"
            />
          </Flex>
          <Text
            style={{ flex: "15%", alignItems: "center" }}
            content={`${item.department}`}
            className="admin-heading-row-element row-item-main"
          />
          <Text
            content={`${item.reasonType}`}
            className="admin-heading-row-element row-item-main"
            style={{ flex: "12%" }}
          />
          <Text
            content={`${item.createdAt.split("T")[0]}`}
            className="admin-heading-row-element row-item-main"
            style={{ flex: "12%" }}
          />
          {item.status === 0 && (
            <Flex
              className="admin-heading-row-element row-item-main"
              style={{ flex: "12%" }}
              vAlign="center"
            >
              <Label
                style={labelStyle("Pending")}
                vAlign="center"
                content="Pending"
              />
            </Flex>
          )}
          {item.status === 1 && (
            <Flex
              className="admin-heading-row-element row-item-main"
              style={{ flex: "12%" }}
              vAlign="center"
            >
              <Label
                style={labelStyle("In Progress")}
                vAlign="center"
                content="In Progress"
              />
            </Flex>
          )}
          {item.status === 2 && (
            <Flex
              className="admin-heading-row-element row-item-main"
              style={{ flex: "12%" }}
              vAlign="center"
            >
              <Label
                style={labelStyle("Resolved")}
                vAlign="center"
                content="Resolved"
              />
            </Flex>
          )}
          {item.status === -1 && (
            <Flex
              className="admin-heading-row-element row-item-main"
              style={{ flex: "12%", gap: "0.2rem" }}
              vAlign="center"
            >
              <Label
                style={labelStyle("In Progress")}
                vAlign="center"
                content=<Flex vAlign="center">
                  <Text
                    content="In Progress"
                    style={{
                      marginRight: "7px ",
                    }}
                  />
                  <Image src={forwardIcon} />
                </Flex>
              />
            </Flex>
          )}
          <div
            className="admin-heading-row-element row-item-main"
            style={{ flex: "12%", paddingLeft: "1.2rem" }}
          >
            <ViewDialog
              changeStatus={changeStatus}
              id={item.id}
              isOpen={isOpen}
              profilePhoto={item.profilePhoto}
              name={item.Name}
            />
          </div>
        </Flex>
      ),
    };
  });
  return hrDataLoading ? (
    <List
      className="list-skeleton"
      style={{
        padding: "0rem 1rem",
        overflowY: "auto",
        maxHeight: "100%",
      }}
    >
      {_.times(4, (index) => (
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
            <Skeleton animation="pulse">
              <Skeleton.Shape round width="36px" height="36px" />
            </Skeleton>
          }
          header={
            <Skeleton
              animation="pulse"
              styles={{
                paddingBottom: "5px",
              }}
            >
              <Skeleton.Line width="100px" />
            </Skeleton>
          }
          content={
            <>
              <Skeleton animation="pulse">
                <Skeleton.Line width="300px" />
              </Skeleton>
            </>
          }
          index={index}
        />
      ))}
    </List>
  ) : noResult === true ? (
    <FluentUiProvider theme={mergeThemes(appTheme, newTableTheme)}>
      <Flex
        hAlign="center"
        vAlign="center"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Image src={EmptyImg} style={{ height: "15rem", width: "15rem" }} />
      </Flex>
    </FluentUiProvider>
  ) : (
    <>
      <FluentUiProvider
        theme={mergeThemes(apptheme, apptheme)}
        className={`list-container-admin ${CompanyReducer.theme === "dark" ? "list-container-admin-dark" : ""
          }`}
      >
        <List items={headingItems} />
        <List items={rowItems} className="list-rows-admin-hr" />
      </FluentUiProvider>
      <FluentUiProvider theme={mergeThemes(paginationTheme, paginationTheme)}>
        <Flex
          hAlign="right"
          vAlign="center"
          padding="padding.medium"
          sstyle={{ paddingTop: "1rem" }}
          gap="gap.medium"
        >
          <Button
            disabled={currentPage === 1}
            onClick={handlePrev}
            circular
            icon={<ChevronStartIcon />}
            title="Previous Page"
          />
          <Input
            min="1"
            inverted
            max={totalPages}
            className="page-input"
            value={goToPage}
            name="goToPage"
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setGoToPage(value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                if (goToPage > 0 && goToPage <= totalPages) {
                  setCurrentPage(goToPage);
                }
              }
            }}
          />
          <Text content={`of ${totalPages}`} />

          {/* <Text>
            Page {currentPage} of {totalPages}
          </Text> */}

          <Button
            disabled={currentPage === totalPages}
            onClick={handleNext}
            circular
            icon={<ChevronEndIcon />}
            title="Next Page"
          />
        </Flex>
      </FluentUiProvider>
    </>
  );
};

export default TicketRows;
