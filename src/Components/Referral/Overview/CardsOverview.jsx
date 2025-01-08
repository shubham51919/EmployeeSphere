import React from "react";
import icon1 from "../../../Assets/referralAssets/icon3.svg";
import icon2 from "../../../Assets/referralAssets/icon1.svg";
import icon3 from "../../../Assets/referralAssets/icon2.svg";
import icon4 from "../../../Assets/referralAssets/icon4.svg";
import { useSelector } from "react-redux";
import "../referral.css";
import {
  Flex,
  Text,
  Image,
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
} from "@fluentui/react-northstar";

const CardsOverview = () => {

  let appTheme = teamsTheme;
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });

  if (!CompanyReducer.theme) {
  } else if (CompanyReducer.theme === "dark") {
    appTheme = teamsDarkTheme;
  } else if (CompanyReducer.theme === "contrast") {
    appTheme = teamsHighContrastTheme;
  } else if (CompanyReducer.theme === "default") {
    appTheme = teamsTheme;
  }

  const { referredStatus } = CompanyReducer;
  const mainStatus = referredStatus[0];
  const ApprovedReferrals = mainStatus?.ApprovedReferrals;
  const PendingReferral = mainStatus?.PendingReferral;
  const RejectedReferral = mainStatus?.RejectedReferral;
  const TotalReferrals = mainStatus?.TotalReferrals;

  const Cardtheme = {
    // siteVariables: {
    //   colorScheme: {
    //     border: '#F5F5F5',
    //   },
    // },
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
  const BGtheme = {
    // siteVariables: {
    //   colorScheme: {
    //     border: '#F5F5F5',
    //   },
    // },
    componentVariables: {
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.default.white,
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

  return (
    <FluentUiProvider theme={mergeThemes(appTheme, Cardtheme)}>
      <Flex
        className="card-flex-main"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridGap: "16px",
        }}
      >
        <FluentUiProvider
          theme={mergeThemes(appTheme, BGtheme)}
          style={{
            boxShadow:
              "0px 0.800000011920929px 1.7999999523162842px rgba(0, 0, 0, 0.13)",
          }}
        >
          <Flex elevated className="card-small" fluid={true}>
            <Flex
              style={{ display: "flex", width: "100%" }}
              gap="gap.small"
              space="between"
            >
              <Flex
                style={{ flex: "60%" }}
                vAlign="center"
                gap="gap.small"
                fluid={true}
              >
                <Image src={icon2} />
                <Text content="Total Referrals" className="card-title-main" />
              </Flex>
              <Flex style={{ flex: "10%" }} vAlign="center" push="true">
                <Text
                  content={
                    referredStatus?.length > 0
                      ? TotalReferrals === null
                        ? 0
                        : TotalReferrals
                      : 0
                  }
                  style={{ fontSize: "1.5rem", fontWeight: "600" }}
                  weight="semibold"
                  size="large"
                />
              </Flex>
            </Flex>
          </Flex>
        </FluentUiProvider>
        <FluentUiProvider
          theme={mergeThemes(appTheme, BGtheme)}
          style={{
            boxShadow:
              "0px 0.800000011920929px 1.7999999523162842px rgba(0, 0, 0, 0.13)",
          }}
        >
          <Flex elevated className="card-small" fluid={true}>
            <Flex
              style={{ display: "flex", width: "100%" }}
              gap="gap.medium"
              space="between"
            >
              <Flex
                style={{ flex: "65%" }}
                vAlign="center"
                gap="gap.small"
                fluid
              >
                <Image src={icon4} />
                <Text
                  content="Approved Referrals"
                  className="card-title-main"
                />
              </Flex>
              <Flex style={{ flex: "10%" }} vAlign="center" push="true">
                <Text
                  content={
                    referredStatus.length > 0
                      ? ApprovedReferrals === null
                        ? 0
                        : ApprovedReferrals
                      : 0
                  }
                  style={{ fontSize: "1.5rem", fontWeight: "600" }}
                  weight="semibold"
                  size="large"
                />
              </Flex>
            </Flex>
          </Flex>
        </FluentUiProvider>
        <FluentUiProvider
          theme={mergeThemes(appTheme, BGtheme)}
          style={{
            boxShadow:
              "0px 0.800000011920929px 1.7999999523162842px rgba(0, 0, 0, 0.13)",
          }}
        >
          <Flex elevated className="card-small" fluid>
            <Flex
              style={{ display: "flex", width: "100%" }}
              gap="gap.medium"
              space="between"
            >
              <Flex
                style={{ flex: "60%" }}
                vAlign="center"
                gap="gap.small"
                fluid
              >
                <Image src={icon3} />
                <Text
                  content="In-process Referrals"
                  className="card-title-main"
                />
              </Flex>
              <Flex style={{ flex: "10%" }} vAlign="center" push="true">
                <Text
                  content={
                    referredStatus.length > 0
                      ? PendingReferral === null
                        ? 0
                        : PendingReferral
                      : 0
                  }
                  weight="semibold"
                  size="large"
                  style={{ fontSize: "1.5rem", fontWeight: "600" }}
                />
              </Flex>
            </Flex>
          </Flex>
        </FluentUiProvider>
        <FluentUiProvider
          theme={mergeThemes(appTheme, BGtheme)}
          style={{
            boxShadow:
              "0px 0.800000011920929px 1.7999999523162842px rgba(0, 0, 0, 0.13)",
          }}
        >
          <Flex elevated className="card-small" fluid>
            <Flex
              style={{ display: "flex", width: "100%" }}
              gap="gap.medium"
              space="between"
            >
              <Flex
                style={{ flex: "65%" }}
                vAlign="center"
                gap="gap.small"
                fluid
              >
                <Image src={icon1} />
                <Text
                  content="Rejected Referrals"
                  className="card-title-main"
                />
              </Flex>
              <Flex style={{ flex: "10%" }} vAlign="center" push="true">
                <Text
                  content={
                    referredStatus.length > 0
                      ? RejectedReferral === null
                        ? 0
                        : RejectedReferral
                      : 0
                  }
                  className="card-title-main"
                  weight="semibold"
                  size="large"
                  style={{ fontSize: "1.5rem", fontWeight: "600" }}
                />
              </Flex>
            </Flex>
          </Flex>
        </FluentUiProvider>
      </Flex>
    </FluentUiProvider>
  );
};

export default CardsOverview;
