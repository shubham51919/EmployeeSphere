import React from "react";
import { Flex, Text } from "@fluentui/react-northstar";

const AnnounceCard = ({ item }) => {
    function formatDateToDDMMYYYY(dateString) {
        const date = new Date(dateString);

        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so we add 1
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }
    return (
        <>
            <Flex
                style={{
                    border: "1px solid #eeeeee",
                    padding: "10px",
                    height: "auto",
                    justifyContent: "space-between",
                }}
            >
                <Flex style={{ width: "70%" }} column>
                    <Text content={item?.description} />
                    <a
                        target="_blank"
                        href={item?.buttonlink}
                        style={{
                            textDecoration: "underline",
                            color: "#717EF4",
                        }}
                    >
                        {item?.buttontext}
                    </a>
                </Flex>
                <Flex vAlign="center" style={{ gap: "10px" }}>
                    <Text
                        content={`Posted on: ${formatDateToDDMMYYYY(
                            item?.from_date
                        )}`}
                    />
                </Flex>
            </Flex>
        </>
    );
};

export default AnnounceCard;
