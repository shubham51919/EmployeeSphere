import {
  Button,
  Flex,
  Text,
  Table,
  Loader,
  FilterIcon,
  MenuButton,
  Pill,
  Skeleton,
  List,
  Image,
} from "@fluentui/react-northstar";

import { toast } from "react-toastify";
import React, { useState } from "react";
import { useEffect } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { getDate } from "../../../Utilities/utilities";
import emptyImg from "../../../Assets/connectAssets/emptyImg.svg";
import newsroomApi from "../../../Apis/newsroom";
import PreviewDialog from "./PreviewDialog";
const MyRequest = ({ type }) => {
  const [loadingStates, setLoadingStates] = useState({});
  // Initialize the loading state for each item in approvalData to false

  const [selectedValue, setSelectedValue] = useState(null);
  const [approvalData, setApprovalData] = useState([]);
  const handleMenuItemClick = (value) => {
    setSelectedValue(value);
  };
  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });
  const companyState = useSelector((state) => {
    return state.CompanyReducer;
  });
  const formReducer = useSelector((state) => state.formReducer);
  const { loggedInUserDetails } = formReducer;
  const { FirstName, LastName } = loggedInUserDetails;

  const [isLoading, setIsLoading] = useState(true);
  // Api call to get all the request
  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const API = newsroomApi(accessToken);
  let data =
    selectedValue != null
      ? JSON.stringify({
        adminMail: userEmail,
        page: 1,
        limit: 10,
        statusFilter:
          selectedValue == "Pending"
            ? 0
            : selectedValue == "Published"
              ? 1
              : 2,
      })
      : JSON.stringify({
        adminMail: userEmail,
        page: 1,
        limit: 10,
      });

  //
  const getMyRequest = async () => {
    setIsLoading(true);
    try {
      const response = await API.post(
        `${type === "admin" ? "" : `/Employee`}/getBlogsToApprove`,
        data
      );
      setIsLoading(false);
      setApprovalData(response.data.result);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong, Please try again later", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {
    getMyRequest();
  }, [selectedValue]);

  const statusStyles = {
    0: {
      backgroundColor: "#FFFAE0",
      color: "#AC7B30",
      textAlign: "center",
      flexGrow: 1,
    },
    1: {
      backgroundColor: "#E9F1FF",
      color: "#444791",
      textAlign: "center",
      flexGrow: 1,
    },
    2: {
      backgroundColor: "#FFF5F4",
      color: "#D32C1C",
      textAlign: "center",
      flexGrow: 1,
    },
  };

  const handleActionClick = async (id, actionType, title) => {
    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [id]: true, // Set loading state to true for the clicked item
    }));
    let data = {
      adminMail: userEmail,
      blogId: id,
      actionTaken: actionType,
      employeeName: `${FirstName} ${LastName}`,
      title: title,
      employeeEmail: userEmail,
    };
    try {
      const response = await API.post("/approveABlog", data);
      if (response.data.status == 1 && actionType == 1) {
        toast.success("Post Successfully Approved", {
          position: toast.POSITION.TOP_RIGHT,
        });
        getMyRequest();
      } else if (response.data.status == 1 && actionType == 2) {
        toast.success("Post Successfully Rejected", {
          position: toast.POSITION.TOP_RIGHT,
        });
        getMyRequest();
      } else {
        toast.error("Please Try Again", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (err) {
      toast.error("Something went wrong, Please try again later", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const header = {
    items: [
      <Text as="h3" content="Article Category" />,
      <Text as="h3" content="Title" />,
      <Text as="h3" content="Post Date" />,
      <Text as="h3" content="Post" />,
      <Text as="h3" content="Status" />,
    ],
  };
  const adminHeader = {
    items: [
      <Text as="h3" content="Name" />,
      <Text as="h3" content="Title" />,
      <Text as="h3" content="Post Date" />,
      <Text as="h3" content="Post" />,
      <Text as="h3" content="Action" />,
    ],
  };

  const rowsAdminPlain = approvalData?.map((item) => ({
    key: item.id,
    items: [
      {
        content:
          item.employeeName == null ? (
            <Text>Unknown User</Text>
          ) : (
            <>
              <Flex gap="gap.medium">
                {/* <Avatar
                  style={{ height: "1.6rem", width: "1.6rem" }}
                  image={"S S"}
                /> */}
                <Flex column>
                  <Text
                    style={{
                      fontSize: "0.8rem",
                      color: "#616161",
                    }}
                    content={item.employeeName}
                  />
                  <Text
                    style={{
                      fontSize: "0.7rem",
                      color: "#616161",
                    }}
                    content={item.employeeEmail}
                  />
                </Flex>
              </Flex>
            </>
          ),
        truncateContent: true,
      },
      {
        content: item.title == null ? "Unknown" : item.title,
        truncateContent: true,
      },
      getDate(item.createdAt),
      <PreviewDialog
        editorHtml={item.content}
        title={item.title}
        category={item.category}
        employeeEmail={item.employeeEmail}
        employeeName={item.employeeName}
      // type="myRequest"
      />,
      item.status == 0 ? (
        loadingStates[item.id] ? (
          <Flex
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loader />
          </Flex>
        ) : (
          <Flex gap="gap.smaller" style={{ marginRight: "5rem" }}>
            <Button
              size="small"
              primary
              onClick={() => handleActionClick(item?.id, 1, item?.title)}
            >
              Approve
            </Button>
            <Button
              size="small"
              onClick={() => handleActionClick(item?.id, 2, item?.title)}
            >
              Reject
            </Button>
          </Flex>
        )
      ) : (
        <Flex gap="gap.smaller" style={{ marginRight: "5rem" }}>
          <Button
            size="small"
            primary
            disabled
            onClick={() => handleActionClick(item.id, 1)}
          >
            Approve
          </Button>
          <Button
            size="small"
            disabled
            onClick={() => handleActionClick(item.id, 0)}
          >
            Reject
          </Button>
        </Flex>
      ),
    ],
  }));
  const rowsPlain = approvalData?.map((item) => ({
    key: item.id,
    items: [
      item.category == null ? "Unknown" : item.category,
      {
        content: item.title == null ? "Unknown" : item.title,
        truncateContent: true,
      },
      getDate(item.createdAt),
      <PreviewDialog
        editorHtml={item.content}
        title={item.title}
        category={item.category}
        employeeEmail={item.employeeEmail}
        employeeName={item.employeeName}
      // type="myRequest"
      />,
      <Pill
        content={
          item.status === 0
            ? "Pending"
            : item.status === 1
              ? "Published"
              : "Rejected"
        }
        style={statusStyles[item.status]}
      />,
    ],
  }));

  return (
    <Flex
      className="connect-my-request"
      style={{
        minHeight: "calc(100vh - 200px)",
        border: "1px solid #E1E1E1",
        borderRadius: "0.5rem",
        height: "100%",
        width: "100%",
        padding: "1rem",
      }}
      column
    >
      {isLoading ? (
        <>
          <List className="list-skeleton">
            {_.times(5, (index) => (
              <List.Item
                key={index}
                styles={{
                  backgroundColor:
                    index % 2 === 0
                      ? `${companyState.theme === "default"
                        ? `#f5f2f2`
                        : `rgb(29,29,28)`
                      }`
                      : "transparent",
                }}
                header={
                  <Skeleton
                    animation="pulse"
                    styles={{
                      paddingBottom: "5px",
                    }}
                  >
                    <Skeleton.Line width="300px" />
                  </Skeleton>
                }
                content={
                  <>
                    <Skeleton animation="pulse">
                      <Skeleton.Line width="100px" />
                    </Skeleton>
                  </>
                }
                index={index}
              />
            ))}
          </List>
        </>
      ) : approvalData?.length > 0 ? (
        <>
          <Flex space="between" vAlign="center">
            <Flex>
              <Text as="h2" content="Request List" />
            </Flex>
            <Flex>
              {selectedValue ? (
                <Pill
                  actionable
                  onDismiss={(e, data) => {
                    setSelectedValue(null);
                  }}
                  content={selectedValue}
                  size="small"
                  style={{
                    color: "#7F85F5",
                    textAlign: "center",
                  }}
                  appearance="outline"
                />
              ) : (
                <></>
              )}
              <MenuButton
                trigger={
                  <Button
                    icon={<FilterIcon />}
                    content="Filter"
                    aria-label="Click button"
                  />
                }
                menu={["Pending", "Published", "Rejected"]}
                onMenuItemClick={(item) =>
                  handleMenuItemClick(item.target.innerText)
                }
                on="click"
              />
            </Flex>
          </Flex>
          <Flex
            style={{
              width: "100%",
            }}
          >
            <Table
              selectable={false}
              className={`${type == "admin" ? "table-class-connect-admin" : ""
                }`}
              header={type == "admin" ? adminHeader : header}
              rows={type == "admin" ? rowsAdminPlain : rowsPlain}
              aria-label="Compact view static table"
              style={{
                width: "100%",
              }}
            />
          </Flex>
        </>
      ) : (
        <Image src={emptyImg} />
      )}
      {/* <ToastContainer /> */}
    </Flex>
  );
};

export default MyRequest;
