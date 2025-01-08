import React from "react";
import {
  Flex,
  List,
  Text,
  Loader,
  Segment,
  Image,
} from "@fluentui/react-northstar";
import EmptyImg from "../../Assets/referralAssets/EmptyImg.svg";

import { useSelector } from "react-redux";
import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  mergeThemes,
  teamsHighContrastTheme,
} from "@fluentui/react-northstar";
import "./referral.css";


const ListMain = ({ items, name }) => {
  let appTheme = teamsTheme;

  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });


  const { isLoading } = CompanyReducer;
  const { referredStatus } = CompanyReducer;

  const mainStatus = referredStatus[0];
  const TotalReferrals = mainStatus?.TotalReferrals;

  if (!CompanyReducer.theme) {
  } else if (CompanyReducer.theme === "dark") {
    appTheme = teamsDarkTheme;
  } else if (CompanyReducer.theme === "contrast") {
    appTheme = teamsHighContrastTheme;
  } else if (CompanyReducer.theme === "default") {
    appTheme = teamsTheme;
  }
  const Listtheme = {
    componentVariables: {
      List: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
    },
    componentStyles: {
      List: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
    },
  };

  const style =
    name === "YourReferrals"
      ? { maxHeight: "33rem", minHeight: "33rem" }
      : { maxHeight: "21rem", minHeight: "21rem" };

  return (
    <Segment className="segment-list">
      <FluentUiProvider theme={mergeThemes(appTheme, Listtheme)}>
        <Flex
          className="ListMain"
          column
          padding="padding.small"
          gap="gap.large"
          space="between"
        >
          {name === "Leaderboard" ? (
            <Flex
              space="between"
              padding="padding.medium"
              gap="gap.medium"
              style={{}}
            >
              <Text
                primary
                content="Leaderboard"
                style={{ fontSize: "1rem", fontWeight: "400" }}
              />
              <Flex className="scoreboard" gap="gap.medium">
                <Flex>
                  <Segment
                    vAlign="center"
                    content={
                      <Flex>
                        <Text
                          content="Your Score  "
                          weight="semibold"
                          size="medium"
                        />
                        <Text
                          content={
                            TotalReferrals === null ? 0 : TotalReferrals * 5
                          }
                          className="score-rank"
                          weight="light"
                          size="medium"
                        />
                      </Flex>
                    }
                    style={{ padding: "0.5rem" }}
                  />
                </Flex>
                <Flex>
                  <Segment
                    vAlign="center"
                    content={
                      <Flex>
                        <Text
                          content="Rank  "
                          style={{ fontSize: "0.8rem", fontWeight: "400" }}
                        />
                        <Text
                          content=" : 18th"
                          style={{ fontSize: "0.8rem", fontWeight: "400" }}
                          className="score-rank"
                        />
                      </Flex>
                    }
                    style={{ padding: "0.5rem" }}
                  />
                </Flex>
              </Flex>
            </Flex>
          ) : (
            <Flex
              space="between"
              padding="padding.medium"
              gap="gap.medium"
              style={{ marginBottom: "0vh" }}
            >
              <Text
                primary
                content="Your Referrals"
                style={{ fontSize: "1rem", fontWeight: "400" }}
              />
              <Flex className="scoreboard"></Flex>
            </Flex>
          )}
          <Flex>
            <Flex vAlign="center">
              {isLoading ? (
                <Flex>
                  <Loader className="main-list-loader-referral" />
                </Flex>
              ) : items.length > 0 ? (
                <List
                  className="main-list-referral"
                  items={items}
                  style={style}
                />
              ) : items.length > 0 ? (
                <List
                  className="main-list-referral"
                  style={{ height: "20%", width: "10vw", vAlign: "center" }}
                />
              ) : (
                <Flex>
                  <Image
                    src={EmptyImg}
                    className="main-list-referral"
                    style={{ height: "20%", width: "10vw", vAlign: "center" }}
                  />
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
      </FluentUiProvider>
    </Segment>
  );
};

export default ListMain;
