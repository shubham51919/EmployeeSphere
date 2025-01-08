import { Flex, Input } from "@fluentui/react-northstar";
import React from "react";
import "../Travel Tabs/TravelServiceRequest/TravelServiceRequest.css";

const FormBasicDetails = () => {
  return (
    <Flex column className="basic-form">
      <Flex vAlign="center">
        <label htmlFor="hrmid">HRM ID</label>
        <Input id="hrmid" placeholder="Enter your HRM ID here" />
      </Flex>

      <Flex vAlign="center">
        <label htmlFor="fullname">Full Name</label>
        <Input id="fullname" placeholder="" />
      </Flex>

      <Flex vAlign="center">
        <label htmlFor="employeeNamegovtId">
          Employee Full Name (As Per Gov ID)
        </label>
        <Input
          id="employeeNamegovtId"
          placeholder="Enter your Full Name here"
        />
      </Flex>

      <Flex vAlign="center">
        <label htmlFor="department">Department</label>
        <Input
          className="change-input"
          id="department"
          placeholder="Select Department"
        />
      </Flex>

      <Flex vAlign="center">
        <label htmlFor="dob">Date of Birth</label>
        <Input className="change-input" id="dob" placeholder="Select DOB" />
      </Flex>

      <Flex vAlign="center">
        <label htmlFor="mobile">Mobile No.</label>
        <Input id="mobile" placeholder="Type here" />
      </Flex>

      <Flex vAlign="center">
        <label htmlFor="officeMail">Office Mail ID</label>
        <Input id="officeMail" placeholder="Type here" />
      </Flex>

      <Flex vAlign="center">
        <label htmlFor="urgency">Urgency</label>
        <Input
          className="change-input"
          id="urgency"
          placeholder="Default input..."
        />
      </Flex>

      <Flex vAlign="center">
        <label htmlFor="travelPurpose">Travel Purpose</label>
        <Input
          className="change-input"
          id="travelPurpose"
          placeholder="Business/Meeting"
        />
      </Flex>

      <Flex vAlign="center">
        <label htmlFor="explainPurpose">Expain Purpose in details</label>
        <Input id="explainPurpose" placeholder="Type Here" />
      </Flex>
    </Flex>
  );
};

export default FormBasicDetails;
