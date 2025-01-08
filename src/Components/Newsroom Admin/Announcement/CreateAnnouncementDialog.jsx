import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Flex,
  FlexItem,
  Text,
  Pill,
  Button,
  Dialog,
  Image,
  CloseIcon,
  Datepicker,
  Input,
  Skeleton,
} from "@fluentui/react-northstar";
import { toast } from "react-toastify";
import newsroomApi from "../../../Apis/newsroom";
const CreateAnnouncementDialog = ({ getAcc }) => {
  const [desc, setDesc] = useState();
  const [btnTxt, setBtnTxt] = useState();
  const [btnLink, setBtnLink] = useState();
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [newsSubmitting, setNewsSubmitting] = useState(false);

  const userEmail = useSelector((state) => {
    return state.authReducer.userEmail;
  });
  const accessToken = useSelector((state) => state.authReducer.accessToken);
  const API = newsroomApi(accessToken);
  useEffect(() => {
    const isValid =
      startDate !== "" &&
      endDate !== "" &&
      desc !== "" &&
      btnTxt !== "" &&
      btnLink;
    setIsFormValid(isValid);
  }, [startDate, endDate, desc, btnTxt, btnLink]);

  const handleFromDateChange = (date) => {
    // Get the date in ISO format with the correct time zone offset
    const formattedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();

    if (formattedDate === "1970-01-01T00:00:00.000Z") {
      setStartDate(new Date());
    } else {
      setStartDate(formattedDate);
    }
  };
  const handleToDateChange = (date) => {
    // Get the date in ISO format with the correct time zone offset
    const formattedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();

    if (formattedDate === "1970-01-01T00:00:00.000Z") {
      setEndDate(new Date());
    } else {
      setEndDate(formattedDate);
    }
  };
  const clearState = () => {
    setDesc("");
    setBtnTxt("");
    setBtnLink("");
    setStartDate("");
    setEndDate("");
  };

  const handleClick = async () => {
    setNewsSubmitting(true);
    try {
      const response = await API.post("/addAnnouncement", {
        email: userEmail,
        id: null,
        from: startDate,
        to: endDate,
        description: desc,
        buttontext: btnTxt,
        buttonlink: btnLink,
      });
      toast.success("Announcement created Successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      getAcc();
      handleClose();
      clearState();
    } catch {
      toast.error("Error in creating announcement", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setNewsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    clearState();
  };
  return (
    <Dialog
      open={open}
      cancelButton={{
        content: "Cancel",
        onClick: handleClose,
      }}
      confirmButton={{
        content: "Confirm",
        onClick: handleClick,
        disabled: !isFormValid,
      }}
      content={{
        content: newsSubmitting ? (
          <Skeleton
            animation="pulse"
            style={{
              border: "1px solid #E1E1E1",
              borderRadius: "8px",
              padding: "1rem",
              minHeight: "250px",
            }}
          >
            <Flex column gap="gap.small">
              <Flex gap="gap.small" vAlign="center">
                <Skeleton.Line width="20%" />
              </Flex>
              <Flex column>
                <Skeleton.Line width="60%" />
                <Skeleton.Line width="95%" />
                <Skeleton.Line width="95%" />
                <Skeleton.Line width="95%" />
                <Skeleton.Line width="95%" />
              </Flex>
            </Flex>
          </Skeleton>
        ) : (
          <Flex column style={{ padding: "10px 0px", gap: "10px" }}>
            <Flex space="between">
              <Flex column>
                <Text content="From" className="mandatory" />
                <Datepicker
                  today={new Date()}
                  selected={new Date(startDate)}
                  onDateChange={(e, { value }) =>
                    handleFromDateChange(new Date(value))
                  }
                />
              </Flex>
              <Flex column>
                <Text content="To" className="mandatory" />

                <Datepicker
                  required
                  today={new Date()}
                  selected={new Date(endDate)}
                  onDateChange={(e, { value }) =>
                    handleToDateChange(new Date(value))
                  }
                />
              </Flex>
            </Flex>

            <Flex column>
              <Text content="Description" className="mandatory" />
              <Input
                placeholder="Write Description"
                onChange={(e) => setDesc(e.target.value)}
                value={desc}
              />
            </Flex>
            <Flex column>
              <Text content="Button Text" className="mandatory" />
              <Input
                placeholder="Write Button Text"
                onChange={(e) => setBtnTxt(e.target.value)}
                value={btnTxt}
              />
            </Flex>
            <Flex column>
              <Text content="Button Link" className="mandatory" />
              <Input
                placeholder="Wrtie Button Link"
                onChange={(e) => setBtnLink(e.target.value)}
                value={btnLink}
              />
            </Flex>
          </Flex>
        ),
        styles: {
          // keep only 1 scrollbar while zooming
          height: "100%",
          maxHeight: "280px",
          overflow: "auto",
        },
      }}
      header="Create Announcement"
      headerAction={{
        icon: <CloseIcon onClick={handleClose} />,
        title: "Close",
      }}
      trigger={
        <Button content="Create New" primary onClick={() => setOpen(true)} />
      }
    />
  );
};

export default CreateAnnouncementDialog;
