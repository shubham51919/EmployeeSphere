import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import {
    Flex,
    Text,
    Divider,
    Image,
    DownloadIcon,
    Provider as FluentUiProvider,
} from "@fluentui/react-northstar";

import bowlImg from '../../../Assets/foodPortalAssets/bowl.svg'
import star from '../../../Assets/foodPortalAssets/Star 15.png'
import { API_URL } from '../../../config';


const FBCount = () => {
    const accessTkn = useSelector((state) => {
        return state.authReducer.accessToken;
    });
    const userEmail = useSelector((state) => {
        return state.authReducer.userEmail;
    });
    const [posCount, setPosCount] = useState(0);
    const [negCount, setNegCount] = useState(0);
    const FoodTheme = {
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
    const handleDownloadFBCount = () => {
        const axios = require('axios');
        const data = {
            mail: userEmail
        }

        let config = {
            method: 'post',
            responseType: "blob",
            maxBodyLength: Infinity,
            url: `${API_URL}/foodPortal/downloadFeedback`,
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
    useEffect(() => {
        const axios = require('axios');
        let data = {
            mail: userEmail
        };

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${API_URL}/foodPortal/countPosNegFeedBack`,
            headers: {
                'Authorization': `Bearer ${accessTkn}`,
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                setPosCount(response.data.data.message[0].positive_feedback_count);
                setNegCount(response.data.data.message[0].negative_feedback_count);

            })
            .catch((error) => {
                console.log(error);
            });

    }, [])
    return (
        <FluentUiProvider theme={FoodTheme} style={{ width: "33%", height: "100%", borderRadius: "8px" }}>
            <Flex style={{ height: "100%", width: "100%", padding: "0.75rem 1rem", flexDirection: "column", gap: "0.75rem" }}>
                <Flex style={{ gap: "1rem", height: "1.5rem", display: "flex", justifyContent: "space-between" }} vAlign="center">
                    <Flex gap="gap.small" vAlign='center'>

                        <Image src={bowlImg} height="16px" width="16px" />
                        <Text content="Feedback" style={{ fontSize: "1rem", fontWeight: "600" }} />
                    </Flex>
                    <Flex>
                        <DownloadIcon style={{ color: "#5B5FC7", cursor: "pointer" }} onClick={handleDownloadFBCount} />
                    </Flex>
                </Flex>
                <Divider />
                <Flex style={{ height: "100%", gap: "1rem" }}>
                    <Flex className="FB-card-positive" vAlign='center'>
                        <Text style={{ fontSize: "0.875rem", fontWeight: "400" }}>Positive</Text>
                        <Flex gap="gap.small" vAlign='center'>

                            <Text style={{ fontSize: "0.875rem", fontWeight: "600" }}>{posCount}</Text>
                            <Image src={star} />
                        </Flex>
                    </Flex>
                    <Flex className="FB-card-negative" vAlign='center'>
                        <Text style={{ fontSize: "0.875rem", fontWeight: "400" }}>Negative</Text>
                        <Flex gap="gap.small" vAlign='center'>

                            <Text style={{ fontSize: "0.875rem", fontWeight: "600" }}>{negCount}</Text>
                            <Image src={star} />
                        </Flex>
                    </Flex>

                </Flex>
            </Flex>
        </FluentUiProvider>
    )
}

export default FBCount