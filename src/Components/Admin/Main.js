import React, { useEffect, useState } from "react";
import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  mergeThemes,
  Button,
  Flex,
  Text,
  Loader,
  Image,
  CloseIcon,
  SearchIcon,
  Input,
  List,
  Skeleton,
} from "@fluentui/react-northstar";
import { Link } from "react-router-dom";
import BackButton from "../../Utilities/BackButton";
import EmptyImg from "../../Assets/referralAssets/EmptyImg.svg";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import axios from "axios";
import "./Main.css";
import Table from "./Table";
import { setRefAdminLoading, setTheme } from "../../redux/actions";
import { app } from "@microsoft/teams-js";
import { apiMain } from '../../Apis/ApiMain.js'
import { API_URL } from "../../config";

const StaticTable = ({ hooks }) => {
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });
  const name = useSelector((state) => {
    return state.authReducer.userEmail
  });
  const refAdminReducer = useSelector((state) => {
    return state.refAdminReducer;
  });


  const { loading } = refAdminReducer;
  const [mainAppTheme, setMainAppTheme] = useState();
  const [currTheme, setCurrTheme] = useState(CompanyReducer.theme);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState(1);
  const [noResult, setNoResult] = useState(false);
  const [usersDetails, setUserDetails] = useState([]);
  const dispatch = useDispatch();
  const [searchClicked, setSearchClicked] = useState(false);
  const [clearClicked, setClearClicked] = useState(false);
  const [isClearButonDisabled, setIsClearButtonDisabled] = useState(true);
  const [isSearchButtonDisabled, setIsSearchButtonDisabled] = useState(false);
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState("?");
  const [searchText, setSearchText] = useState({
    searchText: "",
  });
  const accessToken = useSelector((state) => state.authReducer.accessToken);

  const apiMainMain = apiMain(accessToken)

  const accessTkn = useSelector((state) => {
    return state.authReducer.accessToken;
  });

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
  const tableTheme = {
    componentVariables: {
      Table: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
    },
    componentStyles: {
      Table: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
    },
  };
  // const [item, setItem] = useState([]);

  useEffect(() => {
    if (searchText.searchText === "") {
      setIsSearchButtonDisabled(true);
    } else {
      setIsSearchButtonDisabled(false);
    }
  }, [searchText.searchText]);

  useEffect(() => {
    const fetchPost = async () => {
      dispatch(setRefAdminLoading(true));

      try {
        const getDataPayload = {
          orderBy: "DESC",
          page: currentPage,
          limit: searchText.searchText === "" ? 10 : "",
          search: searchText.searchText,
          adminMail: name,
        };

        const res = await apiMainMain.post(
          `/getdata`,
          getDataPayload
        );

        const resData = res.data.result;
        if (resData.length === 0) {
          setNoResult(true);
          dispatch(setRefAdminLoading(false));
          setSearchClicked(false);
          return;
        }
        setNoResult(false);
        setSearchClicked(false);
        setClearClicked(false);
        setTotalPage(res.data.pages.Total_Pages);

        const updatedUsers = resData.map((user) => {
          return {
            ...user,
            profilePhoto: "", // Initialize profilePhoto to empty string
            seenStatus: 0,
            loadingStatus: false,
          };
        });

        setUserDetails(updatedUsers);
        dispatch(setRefAdminLoading(false));
        // Start fetching profile photos in the background
        fetchProfilePhotos(updatedUsers);
      } catch (err) {
        setSearchClicked(false);
        setClearClicked(false);
        //console.log(err);
      }
    };
    fetchPost();
  }, [dispatch, currentPage, searchClicked, clearClicked]);

  // Function to fetch profile photos in the background
  const fetchProfilePhotos = async (users) => {
    const accessToken = accessTkn;
    const graphConfig = {
      headers: {
        Authorization: `Bearer ${accessToken} `,
        "Content-Type": "image/jpeg",
      },
      responseType: "arraybuffer",
    };

    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        try {
          const response = await axios.get(
            `https://graph.microsoft.com/v1.0/users/${user.employeeemail}/photo/$value`,
            graphConfig
          );
          const base64 = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          setUserDetails((prevUsers) => {
            return prevUsers.map((prevUser) => {
              if (prevUser.employeeemail === user.employeeemail) {
                return {
                  ...prevUser,
                  profilePhoto: `data:image/jpeg;base64,${base64}`,
                  seenStatus: 0,
                  loadingStatus: false,
                };
              }
              return prevUser;
            });
          });

          return {
            ...user,
            profilePhoto: `data:image/jpeg;base64,${base64}`,
            seenStatus: 0,
            loadingStatus: false,
          };
        } catch (error) {
          console.error(error);
          return user;
        }
      })
    );
    setUserDetails(updatedUsers);
  };
  function convertIsoToDdmmyyyy(isoTimestamp) {
    try {
      const timestamp = new Date(isoTimestamp);
      const formattedDate = timestamp
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/\s/g, "-");
      return formattedDate;
    } catch (error) {
      return "Invalid timestamp format";
    }
  }
  useEffect(() => {
    setData([]);
    usersDetails.map((itm) => {
      setData((prev) => [
        ...prev,
        {
          id: itm.id,
          profilePhoto: itm?.profilePhoto,
          empName: `${itm?.Employeename}` || "N/A",
          hrmId: itm?.HRM || "N/A",
          department: itm?.department || "N/A",
          empEmail: itm?.employeeemail || "N/A",
          canName: `${itm?.firstname} ${itm?.lastname}` || "N/A",
          number: itm?.Contactnumber || "N/A",
          canEmail: itm?.Emailaddress || "N/A",
          role: itm?.jobrole || "N/A",
          experience: itm?.experience || "N/A",
          skills: itm?.skills || "N/A",
          date: convertIsoToDdmmyyyy(itm?.createdAt) || "N/A",
          linId: "Visit",
          resume: itm?.Resume,
          forwardTo: itm?.forwardTo,
          status: itm?.status,
          seenStatus: itm?.seenStatus,
        },
      ]);
    });
  }, [usersDetails]);

  const columns = [
    {
      Header: `Employee Name | HRM ID`,
      accessor: "empName",
    },
    {
      Header: "Department",
      accessor: "department",
    },
    {
      Header: "Employee's Email ID",
      accessor: "empEmail",
    },
    {
      Header: "Candidate Name",
      accessor: "canName",
    },
    {
      Header: "Contact Number",
      accessor: "number",
    },
    {
      Header: "Candidate's Email ID",
      accessor: "canEmail",
    },
    {
      Header: "Job Role",
      accessor: "role",
    },
    {
      Header: "Experience",
      accessor: "experience",
    },
    {
      Header: "Skills",
      accessor: "skills",
    },
    {
      Header: "Date",
      accessor: "date",
    },
    {
      Header: "Linkdin Id",
      accessor: "linId",
    },
    {
      Header: "Resume",
      accessor: "resume",
    },
  ];

  const handleChangeSearch = (event) => {
    const { name, value } = event.target;
    setSearchText((prev) => {
      return {
        prev,
        [name]: value,
      };
    });
  };

  function handleExcel() {
    // API URL to download Excel file
    const downloadPayload = {
      adminMail: name
    }

    let config = {
      method: 'post',
      responseType: "blob",
      maxBodyLength: Infinity,
      url: `${API_URL}/referralPortal/download`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: downloadPayload
    };
    axios
      .request(config)

      .then((response) => {
        // Create a URL object using the response data
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "filename.xlsx");
        document.body.appendChild(link);
        link.click();
      });
  }

  const handleSearchClick = () => {
    if (searchText.searchText === "") {
      return;
    }
    setIsClearButtonDisabled(false);
    setGoToPage(1);
    setCurrentPage(1);
    setSearchClicked(true);
  };
  return (
    <>
      <Flex
        gap="gap.small"
        style={{
          top: "0",
          width: "100%",
          height: "50px",
          zIndex: "6",
        }}
      >
        <Flex
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0.5rem 1.25rem 1.25rem 1.25rem",
            rowGap: "1rem",
            backgroundColor: "transparent",
            width: "100%",
          }}
        >
          <Flex className="breadcrumb-div">
            <BackButton currTheme={currTheme} />
            <Text>{">"}</Text>
            <Link to="/admin" className="breadcrumb-curr">
              Referral Admin
            </Link>
          </Flex>
          <Flex style={{ width: "100%", justifyContent: "space-between" }}>
            <Flex style={{ gap: "1rem" }}>
              <Text
                className="referral-admin-heading"
                content="Referral Admin Portal"
              />
              <Input
                style={{ width: "18rem", height: "2rem" }}
                name="searchText"
                value={searchText.searchText}
                inverted
                icon={
                  isClearButonDisabled ? (
                    <SearchIcon
                      onClick={handleSearchClick}
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <CloseIcon
                      onClick={() => {
                        setSearchText({ searchText: "" });
                        setClearClicked(true);
                        setIsClearButtonDisabled(true);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  )
                }
                placeholder="Find"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearchClick();
                  }
                }}
                onChange={(e) => handleChangeSearch(e)}
              />
              <Button
                content="Search"
                primary
                onClick={handleSearchClick}
                disabled={isSearchButtonDisabled}
              />
            </Flex>
            <Flex push>
              <Button content="Download Excel" primary onClick={handleExcel} />
            </Flex>
          </Flex>
          <Flex className="list-parent-heading">
            {loading ? (
              <FluentUiProvider
                theme={mergeThemes(mainAppTheme, newTableTheme)}
              >
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
              </FluentUiProvider>
            ) : noResult ? (
              <FluentUiProvider
                theme={mergeThemes(mainAppTheme, newTableTheme)}
              >
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
                  <Image
                    src={EmptyImg}
                    style={{ height: "15rem", width: "15rem" }}
                  />
                </Flex>
              </FluentUiProvider>
            ) : (
              <FluentUiProvider theme={mergeThemes(mainAppTheme, tableTheme)}>
                <Table
                  setData={setData}
                  columns={columns}
                  data={data}
                  searchText={searchText.searchText}
                  totalPage={totalPage}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  goToPage={goToPage}
                  setGoToPage={setGoToPage}
                />
              </FluentUiProvider>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
export default StaticTable;
