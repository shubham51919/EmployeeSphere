import React, { useState, useEffect } from "react";
import "./header.css";
import refDialogIcon from "../../../Assets/referralAssets/refDialogIcon.svg";
import { MdOutlineLaunch } from "react-icons/md";
import {
  Dialog,
  Dropdown,
  Form,
  Button,
  Input,
  Flex,
  Text,
  Loader,
  Header,
  Image,
  CloseIcon,
  Animation,
  Provider as FluentProvider,
} from "@fluentui/react-northstar";
import { useSelector, useDispatch } from "react-redux";
import {
  fillReferredCandidates,
  setYourReferralsLoading,
  fillReferredStatus,
  setRerenderReferralPortal,
} from "../../../redux/actions";
import "./refDialog.css";
import { tailsuiteApi, apiMain } from "../../../Apis/ApiMain.js";

import { toast } from "react-toastify";

import axios from "axios";

const RefDialog = ({ jobRoleName, jobRoleData }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    EmailID: "",
    Mobile: "",
    Experience: "",
    formJobRoleId: "",
    formJobRoleName: "",
    Resume: null,
    LinkedInUrl: "",
    Skills: "",
  });
  const [fileUploaded, setFileUploaded] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFileUploding, setIsFileUploading] = useState(false);
  const [companyFile, setcompanyFile] = useState(null);
  const formReducer = useSelector((state) => {
    return state.formReducer; //1
  });
  const rerenderReferralPortal = useSelector((state) => {
    return state.CompanyReducer.rerenderReferralPortal; //1
  });
  const { loggedInUserDetails } = formReducer;
  const accessToken = useSelector((state) => state.authReducer.accessToken);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const isValidMobileNumber = (mobile) => {
    const mobileRegex = /^[+]?[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const tailsuiteMain = tailsuiteApi(accessToken);
  const apiMainMain = apiMain(accessToken);

  const handleFileUpload = (e) => {
    // dispatch(fileUploaded(e.target.files[0]));
    setIsFileUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    tailsuiteMain
      .post("/Shared/UploadFiles", formData)
      .then((res) => {
        setFormData((prev) => ({
          ...prev,
          Resume: res.data.serverFileName,
        }));
        setFileUploaded(false);
        setcompanyFile(e.target.files[0]);
        setIsFileUploading(false);
      })
      .catch((err) => {
        setIsFileUploading(false);
        setFormData((prev) => ({
          ...prev,
          Resume: null,
        }));
        toast.error("Resume Not Uploaded Successfully. Please try again", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });

    // setFormData((prev) => ({
    //   ...prev,
    //   Resume: e.target.files[0],
    // }));
  };

  const handleJobRoleChange = (selectedJobRole) => {
    setFormData((prev) => ({
      ...prev,
      formJobRoleName: selectedJobRole,
      formJobRoleId: jobRoleData.filter(
        (role) => role.Name === selectedJobRole
      )[0].ID,
    }));
  };

  const handleExperienceChange = (e, { value }) => {
    setFormData((prev) => ({
      ...prev,
      Experience: value,
    }));
  };

  let payload = {
    Proc: "Cel_Candidate_EmployeeRef_Set",
    args: [
      { Key: "APIKey", Value: "c66c5d9f-ec1d-4cfc-b73a-8a503cc03c1b" },
      {
        Key: "CandidateFirstName",
        Value: formData.FirstName,
      },
      {
        Key: "CandidateLastName",
        Value: formData.LastName,
      },
      {
        Key: "Email",
        Value: formData.EmailID,
      },
      {
        Key: "MobileNo",
        Value: formData.Mobile,
      },
      {
        Key: "RequirementID",
        Value: formData.formJobRoleId === "" ? "-1" : formData.formJobRoleId,
      },
      {
        Key: "HRM",
        Value: loggedInUserDetails.EmployeeID,
      },
      {
        Key: "EmployeeName",
        Value: loggedInUserDetails.FirstName,
      },
      {
        Key: "EmployeeEmail",
        Value: loggedInUserDetails.EmailID,
      },
      {
        Key: "ResumeURL",
        Value: formData.Resume === null ? "No Resume" : formData.Resume,
      },
      {
        Key: "Department",
        Value: loggedInUserDetails.Department,
      },
      {
        Key: "Exp",
        Value: formData.Experience === "" ? "0-6 months" : formData.Experience,
      },
      {
        Key: "LinkedInURL",
        Value:
          formData.LinkedInUrl === "" ? "No LinkedIn" : formData.LinkedInUrl,
      },
      {
        Key: "Skills",
        Value: formData.Skills === "" ? "No Skills" : formData.Skills,
      },
    ],
  };

  const insertPayload = new FormData();
  insertPayload.append("firstname", formData.FirstName);
  insertPayload.append("lastname", formData.LastName);
  insertPayload.append("Emailaddress", formData.EmailID);
  insertPayload.append("Contactnumber", formData.Mobile);
  insertPayload.append("jobrole", formData.formJobRoleId);
  insertPayload.append("jobTitle", formData.formJobRoleName);
  insertPayload.append("HRM", loggedInUserDetails.EmployeeID);
  insertPayload.append("Employeename", loggedInUserDetails.FirstName);
  insertPayload.append("employeeemail", loggedInUserDetails.EmailID);
  insertPayload.append("department", loggedInUserDetails.Department);
  insertPayload.append("experience", formData.Experience);
  insertPayload.append("linkedin", formData.LinkedInUrl);
  insertPayload.append("skills", formData.Skills);
  insertPayload.append("file", companyFile);

  // ******* handle submitting the form *******
  const handleSubmitData = () => {
    if (!validateEmail(formData.EmailID)) {
      toast.error("Please enter a valid email address.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    if (!isValidMobileNumber(formData.Mobile)) {
      toast.error("Please enter a valid mobile number.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    const timeoutId = setTimeout(() => {
      source.cancel("Request timed out. Please try again");
      setIsSubmitting(false);
    }, 40000);

    setIsSubmitting(true);
    const postRef = async () => {
      try {
        const postRefRes = await apiMainMain.post(`/insert`, insertPayload);
        if (postRefRes.data === "This email candidate is Already referred") {
          toast.error("This email candidate is Already referred.", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setIsSubmitting(false);
          dispatch(setYourReferralsLoading(false));
          clearTimeout(timeoutId);
          setFormData((prev) => {
            return {
              ...prev,
              Resume: null,
            };
          });
        } else {
          toast.success("You have successfully referred the candidate.", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setIsSubmitting(false);
          setShowDialog(false);
          dispatch(setRerenderReferralPortal(!rerenderReferralPortal));
          setFormData({
            FirstName: "",
            LastName: "",
            EmailID: "",
            Mobile: "",
            formJobRoleName: "",
            formJobRoleId: "",
            Experience: "",
            LinkedInUrl: "",
            Skills: "",
            Resume: null,
          });
        }
      } catch (error) {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsSubmitting(false);
        dispatch(setYourReferralsLoading(false));
      }
    };

    tailsuiteMain
      .post(`/API/Call`, payload)
      .then((response) => {
        const res = JSON.parse(response.data.Data);
        const message = res[0][0].Message;
        if (message === "Candidate Already Referred!") {
          toast.error("Candidate Already Referred!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setIsSubmitting(false);
          dispatch(setYourReferralsLoading(false));
          clearTimeout(timeoutId);
          setFormData((prev) => {
            return {
              ...prev,
              Resume: null,
            };
          });
        } else {
          postRef();
        }
      })
      .catch((error) =>
        toast.error(error, {
          position: toast.POSITION.TOP_RIGHT,
        })
      );
  };

  useEffect(() => {
    const {
      FirstName,
      LastName,
      EmailID,
      Mobile,
      formJobRoleName,
      Experience,
    } = formData;
    const isValid =
      FirstName !== "" &&
      LastName !== "" &&
      EmailID !== "" &&
      Mobile !== "" &&
      formJobRoleName !== "" &&
      Experience !== "" &&
      formData.Resume !== null;
    setIsFormValid(isValid);
  }, [formData]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowDialog(false);
      setFormData({
        FirstName: "",
        LastName: "",
        EmailID: "",
        Mobile: "",
        formJobRoleName: "",
        formJobRoleId: "",
        Experience: "",
        LinkedInUrl: "",
        Skills: "",
        Resume: null,
      });
    }
  };
  const dialogAnimation = {
    keyframe: {
      from: {
        opacity: 0,
        // animatior on opne dialog
        transform: "translate3d(0, 0, 0) scale(0.9)",
      },
      to: {
        opacity: 1,
        transform: "translate3d(0, 0, 0) scale(1)",
      },
    },
    duration: "250ms",
  };
  const dialogExitAnimation = {
    keyframe: {
      from: {
        opacity: 1,
        transform: "translate3d(0, 0, 0) scale(1)",
      },
      to: {
        opacity: 0,
        transform: "translate3d(0, 0, 0) scale(0.9)",
      },
    },
    duration: "250ms",
  };

  return (
    <FluentProvider
      theme={{
        animations: {
          dialogAnimation,
          dialogExitAnimation,
        },
      }}
    >
      <div className="ref-dialog">
        <div className="fluent-dialog">
          <Animation
            name={showDialog ? "dialogAnimation" : "dialogExitAnimation"}
          >
            <Dialog
              onKeyDown={handleKeyDown}
              className="ref-modal dialog-btn"
              open={showDialog}
              onOpen={() => {
                setShowDialog(true);
              }}
              style={{
                borderRadius: "2px",
                padding: "0",
              }}
              header={
                <>
                  <Flex space="between" vAlign="center">
                    <Header
                      as="h3"
                      content=<Flex
                        style={{ padding: "0.5rem 0.5rem", gap: "0.75rem" }}
                      >
                        {" "}
                        <Image src={refDialogIcon} alt="icon" />
                        Candidate Details
                      </Flex>
                    />
                    <CloseIcon
                      onClick={() => {
                        setShowDialog(false);
                        setFormData({
                          FirstName: "",
                          LastName: "",
                          EmailID: "",
                          Mobile: "",
                          formJobRoleName: "",
                          formJobRoleId: "",
                          Experience: "",
                          LinkedInUrl: "",
                          Skills: "",
                          Resume: null,
                        });
                      }}
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  </Flex>
                </>
              }
              cancelButton={
                isSubmitting
                  ? null
                  : {
                    content: "Cancel",
                    onClick: () => {
                      setFormData({
                        FirstName: "",
                        LastName: "",
                        EmailID: "",
                        Mobile: "",
                        formJobRoleName: "",
                        formJobRoleId: "",
                        Experience: "",
                        LinkedInUrl: "",
                        Skills: "",
                        Resume: null,
                      });

                      setShowDialog(false);
                    },
                    style: {
                      display: "block",
                      padding: "0.4rem 2rem",
                      width: "13rem !important",
                      // marginRight: "0",
                    },
                  }
              }
              confirmButton={
                isSubmitting
                  ? null
                  : {
                    disabled: !isFormValid,
                    content: "Submit",
                    onClick: handleSubmitData,
                    style: {
                      minWidth: "3vw",
                      padding: "0.4rem 2rem",
                      width: "46%",
                    },
                  }
              }
              content={
                isSubmitting ? (
                  <Loader
                    size="medium"
                    style={{ margin: "auto", minHeight: "45vh" }}
                  />
                ) : (
                  <>
                    <Form className="referral-form">
                      <Flex column gap="gap.small" padding="padding.medium">
                        <Flex
                          gap="gap.large"
                          padding="padding.medium"
                          space="between"
                          className="input-parent-main"
                        >
                          <Input
                            onChange={handleChange}
                            value={formData.FirstName}
                            placeholder="Enter your first name"
                            name="FirstName"
                            label="First Name"
                            id="first-name-inline"
                            className="refer-form-items"
                          />
                          <Input
                            onChange={handleChange}
                            value={formData.LastName}
                            placeholder="Enter your last name"
                            name="LastName"
                            label="Last Name"
                            id="last-name-inline"
                            className="refer-form-items"
                          />
                        </Flex>
                        <Flex
                          gap="gap.large"
                          padding="padding.medium"
                          space="between"
                          className="input-parent-main"
                        >
                          <Input
                            type="email"
                            onChange={handleChange}
                            value={formData.EmailID}
                            label="Email"
                            placeholder="me@email.com"
                            name="EmailID"
                            id="email-inline"
                            className="refer-form-items"
                          />
                          <Input
                            onChange={handleChange}
                            value={formData.Mobile}
                            label="Phone Number"
                            placeholder="Enter phone number"
                            name="Mobile"
                            id="phone-no-inline"
                            className="refer-form-items"
                          />
                        </Flex>
                        <Flex column>
                          <Text
                            className="dropdown-label refer-form-items "
                            content="Job Role"
                          />
                          <Dropdown
                            placeholder="Select"
                            name="formJobRole"
                            items={jobRoleName}
                            className="refer-form-items"
                            label="JOB ROLE"
                            getA11ySelectionMessage={{
                              onAdd: (item) => {
                                handleJobRoleChange(item);
                                return `${item} has been selected.`;
                              },
                            }}
                          />
                        </Flex>
                        <Flex column>
                          <Text
                            className="dropdown-label"
                            content="Experience"
                          />
                          <Dropdown
                            items={[
                              "0-6 months",
                              "1-3 years",
                              "3-5 years",
                              "5+ years",
                            ]}
                            onChange={handleExperienceChange}
                            name="Experience"
                            placeholder="Select"
                            className="refer-form-items"
                          />
                        </Flex>
                        <Input
                          className="fullinput-dir"
                          value={formData.Skills}
                          onChange={handleChange}
                          label="Skills"
                          placeholder="Enter your skills here"
                          name="Skills"
                        />
                        <Input
                          className="fullinput-dir"
                          onChange={handleChange}
                          label="Linkedin Url"
                          name="LinkedInUrl"
                          value={formData.LinkedInUrl}
                          placeholder="Enter your LinkedIn Url"
                        />

                        <Flex column className="full-input">
                          {/* <Text content="UPLOAD RESUME" />
                    <Segment content=<Dropzone /> /> */}
                          <Flex gap="gap.medium">
                            <Input
                              icon={
                                isFileUploding ? <Loader size="small" /> : null
                              }
                              accept=".pdf"
                              className="refer-form-items"
                              onChange={handleFileUpload}
                              label="Attachments (only .pdf)"
                              name="Resume"
                              type="file"
                              showSuccessIndicator={fileUploaded}
                            />
                          </Flex>
                        </Flex>
                      </Flex>
                    </Form>
                  </>
                )
              }
              trigger={
                <Button
                  style={{
                    zIndex: "2",
                    fontSize: "0.75rem",
                    fontWeight: "600 !important",
                    padding: "8px 16px",
                    minWidth: "fit-content",
                    maxWidth: "fit-content",
                    width: "fit-content",
                  }}
                  primary
                  onClick={() => {
                    setShowDialog(true);
                  }}
                  content={
                    <Flex
                      vAlign="center"
                      style={{ alignItems: "center", columnGap: "0.5rem" }}
                    >
                      <Text
                        primary="true"
                        content="Refer Now"
                        weight="regular"
                        className="refer-btn"
                      />
                      <MdOutlineLaunch />
                    </Flex>
                  }
                />
              }
            />
          </Animation>
        </div>
      </div>
    </FluentProvider>
  );
};

export default RefDialog;
