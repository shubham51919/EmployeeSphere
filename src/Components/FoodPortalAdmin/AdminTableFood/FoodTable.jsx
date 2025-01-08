import React, { useEffect, useState } from 'react'
import {
  Provider as FluentUiProvider,
  teamsTheme,
  Table,
  ArrowSortIcon,
  teamsDarkTheme,
  Loader,
  Button,
  mergeThemes,
  Datepicker,
  teamsHighContrastTheme,
  Flex,
  Menu, Text,

  ChevronStartIcon,
  ChevronEndIcon,
} from "@fluentui/react-northstar";

import { useSelector } from "react-redux";
import { API_URL } from '../../../config';
const FoodTable = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [tableLoader, setTableLoader] = useState(false)
  const [sortType, setSortType] = useState("DESC")

  const [userLocations, setUserLocations] = useState([])
  const indexOfLastItem = currentPage * 10;
  const indexOfFirstItem = indexOfLastItem - 10;
  const [tabIndex, setTabIndex] = useState(0)
  const [selectedDate, setSelectedDate] = useState(null); // Initialize with the desired initial date

  const accessTkn = useSelector((state) => {
    return state.authReducer.accessToken;
  });
  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });

  const handleDateChange = (date) => {
    // Get the date in ISO format with the correct time zone offset
    const formattedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString().split('T')[0];

    if (formattedDate === "1970-01-01") {
      setSelectedDate(null);
    } else {
      setSelectedDate(formattedDate);
    }

  };

  const handleIndexChange = (clickedValue) => {
    setTabIndex(clickedValue);
    setCurrentPage(1)
  }
  const totalPages = 3;
  // const totalPages = Math.ceil(usersDetails.length / 10);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const handleSort = () => {
    if (sortType == "ASC") {
      setSortType("DESC")

    }
    else {
      setSortType("ASC")
    }
  }
  useEffect(() => {
    setTableLoader(true)
    const axios = require('axios');
    let data = {
      "mealType": tabIndex == 0 ? "lunch" : "dinner",
      "orderBy": sortType,
      "pageNo": currentPage,
      "limit": 5,
      "dateFilter": selectedDate,
      "mail": userEmail
    };

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${API_URL}/foodPortal/getSwitchedLocation`,
      headers: {
        'Authorization': `Bearer ${accessTkn}`,
        'Content-Type': 'application/json',
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        setTableLoader(false)
        setTotalPage(response?.data?.data?.pages?.Total_Pages)

        const formattedArray = response?.data?.data?.data.map((item, index) => {
          return {
            key: index + 1,
            items: [
              {
                content: item.HRMID,
                key: 'HRM ID',
              },
              {
                content: item.Name,
                key: 'Employee Name',
              },
              {
                content: item.AssignedLocation,
                key: 'Assigned Location',
              },
              {
                content: item.ChangedLocation,
                key: 'Changed Location',
              },
              {
                content: new Date(item.Date).toLocaleDateString('en-US'),
                key: 'Date',
              },
            ],
          };
        });
        setUserLocations(formattedArray)
      })
      .catch((error) => {
        setTableLoader(false)
        console.log(error);
      });
  }, [currentPage, tabIndex, sortType, selectedDate])

  const items = [
    {
      key: 'Lunch',
      content: 'Lunch',
      onClick: () => { handleIndexChange(0) }
    },
    {
      key: 'Dinner',
      content: 'Dinner',
      onClick: () => { handleIndexChange(1) }
    }
  ]
  const handleDownloadLocationSwitch = () => {
    const axios = require('axios');
    let data = {
      "mealType": tabIndex == 0 ? "lunch" : "dinner",
      "mail": userEmail
    };

    let config = {
      method: 'post',
      responseType: "blob",
      maxBodyLength: Infinity,
      url: `${API_URL}/foodPortal/downloadSwitchedLocationDetails`,
      headers: {
        'Authorization': `Bearer ${accessTkn}`,
        'Content-Type': 'application/json',
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "locationSwitch.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.log(error);
      });
  }


  const header = {
    key: 'header',
    items: [
      {
        content: 'HRM ID',
        key: 'HRM ID',
      },
      {
        content: 'Employee Name',
        key: 'Employee Name',
      },
      {
        content: 'Assigned Location',
        key: 'Assigned Location',
      },
      {
        content: 'Changed Location',
        key: 'Changed Location',
      },
      {
        content: 'Date',
        key: 'Date',
      },
    ],
  }
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
  let appTheme = teamsTheme;

  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });

  if (!CompanyReducer.theme) {
  } else {
    if (CompanyReducer.theme === "dark") {
      appTheme = teamsDarkTheme;
    } else if (CompanyReducer.theme === "contrast") {
      appTheme = teamsHighContrastTheme;
    } else if (CompanyReducer.theme === "default") {
      appTheme = teamsTheme;
    }
  }
  const LoaderTheme = {
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
  }
  return (
    <Flex column>
      <Flex style={{ justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <Flex style={{ gap: "1rem" }} vAlign="center">

          <Text >Location Switch</Text>
          <Menu className="menu-tabs-food" defaultActiveIndex={tabIndex} items={items} underlined primary />
        </Flex>
        <Flex style={{ gap: "1rem" }} vAlign="center">
          <Datepicker
            inverted={true}
            input={{
              clearable: true,
            }}
            today={new Date()}
            selected={new Date(selectedDate)} // Convert the stored date string back to a Date object
            onDateChange={(e, { value }) => handleDateChange(new Date(value))}
          />
          <Text onClick={handleSort}><ArrowSortIcon />{" "}Sort</Text>
          <Button primary onClick={handleDownloadLocationSwitch}>Download</Button>


        </Flex>
      </Flex>
      {
        tableLoader ? <FluentUiProvider theme={mergeThemes(appTheme, LoaderTheme)}><Flex style={{ minHeight: "50vh", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}><Loader /></Flex></FluentUiProvider>
          :
          <>


            <Table
              variables={{
                cellContentOverflow: 'none',
              }}
              header={header}
              rows={userLocations}
              aria-label="Static table"
            />
            <Flex style={{ justifyContent: "end", width: "100%" }}>
              <FluentUiProvider theme={mergeThemes(paginationTheme, paginationTheme)}>
                <Flex
                  hAlign="right"
                  vAlign="center"
                  padding="padding.medium"
                  gap="gap.medium"
                >
                  <Button
                    disabled={currentPage === 1}
                    onClick={handlePrevPage}
                    circular
                    icon={<ChevronStartIcon />}
                    title="Previous Page"
                  />

                  <Text>
                    Page {currentPage} of {totalPage}
                  </Text>

                  <Button
                    disabled={currentPage === totalPage}
                    onClick={handleNextPage}
                    circular
                    icon={<ChevronEndIcon />}
                    title="Next Page"
                  />
                </Flex>
              </FluentUiProvider>
            </Flex>
          </>
      }
    </Flex>
  )
}

export default FoodTable