import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../hr.css";
import { useSelector } from "react-redux";
import {
  fillInProgressResult,
  fillPendingResult,
  fillResolvedResult,
  setLoad,
  setTotalQueries,
  setTotalPending,
} from "../../../redux/actions/index.js";
import {
  Flex,
  Text,
  Loader,
  Button,
  TextArea,
  Dropdown,
  Form,
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
} from "@fluentui/react-northstar";
import { hrApi } from "../../../Apis/hrApi.js";

const TicketForm = () => {
  const loggedInuser = useSelector((state) => {
    return state.formReducer;
  });
  const dispatch = useDispatch();
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    issueType: "",
    issueDesc: "",
  });
  const [showLoader, setShowLoader] = useState(false);
  const { loggedInUserDetails } = loggedInuser;
  const { FirstName, LastName, EmployeeID, Reporting_To, Department, EmailID } =
    loggedInUserDetails;

  let appTheme = teamsTheme;
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });

  const accessToken = useSelector((state) => state.authReducer.accessToken);

  if (!CompanyReducer.theme) {
    // //console.log('Loading... header theme')
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
  const inputItems = [
    "General",
    "Salary",
    "POSH",
    "Travel",
    "Reimbursement",
    "Timesheet",
    "Regularization",
    "Leave",
    "Attendance",
    "Policy Related",
  ];

  useEffect(() => {
    const isValid = formData.issueType !== "" && formData.issueDesc !== "";
    setIsFormValid(isValid);
  }, [formData]);

  const handleFormDropdown = (item) => {
    setFormData((prev) => {
      return {
        ...prev,
        issueType: item,
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };



  const hrApiMain = hrApi(accessToken)

  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    setShowLoader(true);
    e.preventDefault();

    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    const timeoutId = setTimeout(() => {
      source.cancel("Request timed out. Please try again");
      setShowLoader(false);
    }, 40000);

    let payloadData = {
      Name: `${FirstName} ${LastName}`,
      hrmId: loggedInUserDetails?.EmployeeID,
      ReportManager: Reporting_To,
      dept: Department,
      reasonType: formData.issueType,
      Desc: formData.issueDesc,
      employeeEmail: EmailID,
    };

    const postTicket = async () => {

      try {
        const res = await hrApiMain.post(`/raiseTicket`, payloadData, {
          cancelToken: source.token,
        });
        setShowLoader(false);
        clearTimeout(timeoutId);
        toast.success(res.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        const getRaisedTicket = async () => {
          try {
            dispatch(setLoad(true));
            const ticketData = await hrApiMain.get(
              `/getTickets?hrmId=${EmployeeID}`
            );
            dispatch(fillInProgressResult(ticketData.data.InProgressResult));
            dispatch(fillPendingResult(ticketData.data.pendingResult));
            dispatch(fillResolvedResult(ticketData.data.resolvedResult));
            setFormData({
              issueType: "",
              issueDesc: "",
            });
            dispatch(
              setTotalQueries(
                ticketData?.data?.pendingResult?.length +
                ticketData?.data?.InProgressResult?.length +
                ticketData?.data?.resolvedResult?.length
              )
            );
            dispatch(setTotalPending(ticketData?.data?.pendingResult?.length));
            dispatch(setLoad(false));
          } catch (err) {
            dispatch(setLoad(false));

            toast.error("Something went wrong. Please try Again", {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        };
        getRaisedTicket();
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log(err, "err");
          toast.error(err.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          setShowLoader(false);
          toast.error("Something went wrong. Please try Again", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    };
    postTicket();
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  }, [error]);
  // //console.log(loggedInuser, "liun");
  const segmentsTheme = {
    siteVariables: {
      colorScheme: {
        default: {
          foreground: `${CompanyReducer.theme === "default" ? `#686868` : `#ffffff`
            }`,
        },
      },
    },
    componentVariables: {
      Text: ({ colorScheme }) => ({
        color: colorScheme.default.foreground,
        backgroundColor: colorScheme.brand.white,
      }),
    },
    componentStyles: {
      Text: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
    },
  };
  return (
    <>
      {showLoader ? (
        <Loader style={{ margin: "auto", minHeight: "45vh" }} />
      ) : (
        <Form>
          <Flex column className="inside-form-ticket">
            <Flex column className="dropdown-ticket" gap="gap.small">
              <FluentUiProvider
                theme={mergeThemes(appTheme, segmentsTheme)}
                style={{ background: "transparent" }}
              >
                <Text
                  className="dropdown-ticket-text"
                  content="Issue Type"
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "400",
                  }}
                />
              </FluentUiProvider>
              <Dropdown
                error={error}
                fluid
                name="issueType"
                value={formData.issueType}
                className="dropdown-inside"
                items={inputItems}
                placeholder="Select"
                checkable
                getA11ySelectionMessage={{
                  onAdd: (item) => {
                    handleFormDropdown(item);
                  },
                }}
              />
            </Flex>
            <Flex column className="textarea-ticket" gap="gap.small">
              <FluentUiProvider
                theme={mergeThemes(appTheme, segmentsTheme)}
                style={{ background: "transparent" }}
              >
                <Text
                  className="dropdown-ticket-text"
                  content="Description"
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "400",
                  }}
                />
              </FluentUiProvider>
              <TextArea
                value={formData.issueDesc}
                resize
                error={error}
                name="issueDesc"
                onChange={handleChange}
                placeholder="Enter Description here ... "
                className="textarea-inside-ticket"
                style={{ height: "8rem" }}
              />
            </Flex>
            <Flex className="buttons-ticket" style={{ gap: "0.5rem" }}>
              <Button
                content="Cancel"
                className="buttons-ticket-cancel"
                onClick={() => {
                  setFormData({
                    issueType: "",
                    issueDesc: "",
                  });
                }}
              />
              <Button
                disabled={!isFormValid}
                onClick={handleSubmit}
                primary
                content="Submit"
                className="buttons-ticket-submit"
              />
            </Flex>
          </Flex>
        </Form>
      )}
      <ToastContainer autoClose={3000} />
    </>
  );
};

export default TicketForm;
