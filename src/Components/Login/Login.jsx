import React from "react";
import { Flex, FlexItem, Text, Image, Button } from "@fluentui/react-northstar";
import { useSelector } from 'react-redux'

import { Providers } from "@microsoft/mgt";
import { ProviderState } from "@microsoft/mgt-element";
import "./login.css";
import group from "../../Assets/loginAssets/Group.png";
import ellipse from "../../Assets/loginAssets/Ellipse1.png";
import illustration from "../../Assets/loginAssets/rightImgMain.svg";
import leftSvg from "../../Assets/loginAssets/leftSvg.png";
import arrow from "../../Assets/loginAssets/arrow.png";
import bottomCircle from "../../Assets/loginAssets/bottomCircle.png";
import msIcon from "../../Assets/loginAssets/microsoft-icon.png";
import { CacheService } from "@microsoft/mgt";
import { config } from "../../config";
import { TeamsFxProvider } from "@microsoft/mgt-teamsfx-provider";
import { TeamsUserCredential } from "@microsoft/teamsfx";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { setTheme } from "../../redux/actions";
import { compose } from "redux";
import * as microsoftTeams from "@microsoft/teams-js";
// import * as microsoftTeams from "@microsoft/teams-js";
import { app } from "@microsoft/teams-js";
import { storeAccessToken } from "../../redux/actions";
import {
  Provider as FluentUiProvider,
  teamsTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
} from "@fluentui/react-northstar";
// import LoginImg from "../../Assets/LoginImg.png";

class Login extends React.Component {
  constructor(props) {
    super(props);
    CacheService.clearCaches();
    this.state = {
      showLoginPage: undefined,
      selectedPeople: undefined,
      tableHeader: ["Name", "Email", "User Principal Name"],
      tableRows: [],
      csvData: [],
      currTheme: this.props.currentTheme,
      mainTheme: this.props.currentTheme,
      isMobile: window.innerWidth <= 768,
      isAndroid: false,
    };
  }


  display(text, elementTag) {
    var logDiv = document.getElementById('logs');
    var p = document.createElement(elementTag ? elementTag : "p");
    p.innerText = text;
    logDiv.append(p);
    console.log("ssoDemo: " + text);
    return p;
  }

  // 2. Exchange that token for a token with the required permissions
  //    using the web service (see /auth/token handler in app.js)
  getServerSideToken(clientSideToken) {
    return new Promise((resolve, reject) => {
      microsoftTeams.app.getContext().then((context) => {
        fetch('/getMicrosoftAccessTokenOfUser', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420',
          },
          body: JSON.stringify({
            'tid': context.user.tenant.id,
            'token': clientSideToken
          }),
          mode: 'cors',
          cache: 'default'
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              reject(response.error);
            }
          })
          .then((responseJson) => {
            if (responseJson.error) {
              reject(responseJson.error);
            } else {
              const profile = responseJson;
              console.log(profile);
              resolve(profile);
            }
          });
      });
    });
  }

  // 3. Get the server side token and use it to call the Graph API
  // useServerSideToken(data) {

  //   this.display("2. Call https://graph.microsoft.com/v1.0/me/ with the server side token");

  //   return this.display(JSON.stringify(data, undefined, 4), 'pre');
  // }

  // Show the consent pop-up
  requestConsent() {
    return new Promise((resolve, reject) => {
      microsoftTeams.authentication.authenticate({
        url: window.location.origin + "/auth-start",
        width: 600,
        height: 535
      })
        .then((result) => {
          let tokenData = result;
          resolve(tokenData);
        }).catch((reason) => {
          reject(JSON.stringify(reason));
        });
    });
  }

  // Add text to the display in a <p> or other HTML element



  async componentDidMount() {
    console.log(microsoftTeams);
    microsoftTeams.getContext((context) => { /* ... */ });
    function getAuthToken() {
      // 1. Get auth token
      // Ask Teams to get us a token from AAD
      function getClientSideToken() {

        return new Promise((resolve, reject) => {
          this.display("1. Get auth token from Microsoft Teams");

          microsoftTeams.authentication.getAuthToken().then((result) => {
            this.display(result);
            resolve(result);
          }).catch((error) => {
            reject("Error getting token: " + error);
          });
        });
      }


      microsoftTeams.app.initialize().then(() => {
        getClientSideToken()
          .then((clientSideToken) => {
            return this.getServerSideToken(clientSideToken);
          })
          .then((profile) => {
            console.log(profile);
            // dispatch(storeAccessToken(accessToken));
            this.props.storeAccessToken(profile.token);
            return;
            // return this.useServerSideToken(profile);
          })
          .catch((error) => {
            if (error === "invalid_grant") {
              this.display(`Error: ${error} - user or admin consent required`);

              // Display in-line button so user can consent
              let button = this.display("Consent", "button");
              button.onclick = (() => {
                this.requestConsent()
                  .then((result) => {
                    // Consent succeeded
                    this.display(`Consent succeeded`);

                    // offer to refresh the page
                    button.disabled = true;
                    let refreshButton = this.display("Refresh page", "button");
                    refreshButton.onclick = (() => { window.location.reload(); });
                  })
                  .catch((error) => {
                    this.display(`ERROR ${error}`);

                    // Consent failed - offer to refresh the page
                    button.disabled = true;
                    let refreshButton = this.display("Refresh page", "button");
                    refreshButton.onclick = (() => { window.location.reload(); });
                  });
              });
            } else {
              // Something else went wrong
              console.log(error);
              // this.display(`Error from web service: ${error}`);
            }
          });
      }).catch((error) => {
        console.error(error);
      });
    }
    getAuthToken();
    // app.initialize().then(() => {
    //   app.registerOnThemeChangeHandler((theme) => {
    //     //console.log('themecheck')
    //     this.setState({ currTheme: theme });
    //   });
    // });
    // console.log(this.props.currentTheme, "current theme");
    app.initialize().then(() => {
      app.getContext().then((context) => {
      });
    });
    await this.initTeamsFx();
    await this.initGraphToolkit(this.credential, this.scope);
    await this.checkIsConsentNeeded();
    // if (!this.props.isMobileDev) {
    //   await this.initTeamsFx();
    //   await this.initGraphToolkit(this.credential, this.scope);
    //   await this.checkIsConsentNeeded();
    // } else {
    //   this.props.history.push("/dashboard");
    // }
    // window.addEventListener("resize", this.handleWindowSizeChange);
  }

  async initGraphToolkit(credential, scope) {
    const provider = new TeamsFxProvider(credential, scope);
    Providers.globalProvider = provider;
  }

  async initTeamsFx() {
    this.credential = new TeamsUserCredential({
      initiateLoginEndpoint: config.initiateLoginEndpoint,
      clientId: config.clientId,
    });

    // Only these two permission can be used without admin approval in microsoft tenant
    this.scope = ["User.Read", "User.ReadBasic.All"];
  }

  async loginBtnClick() {
    try {
      await this.credential.login(this.scope);
      Providers.globalProvider.setState(ProviderState.SignedIn);
      this.setState({
        showLoginPage: false,
      });
    } catch (err) {
      if (err.message?.includes("CancelledByUser")) {
        const helpLink = "https://aka.ms/teamsfx-auth-code-flow";
        err.message +=
          '\nIf you see "AADSTS50011: The reply URL specified in the request does not match the reply URLs configured for the application" ' +
          "in the popup window, you may be using unmatched version for TeamsFx SDK (version >= 0.5.0) and Teams Toolkit (version < 3.3.0) or " +
          `cli (version < 0.11.0). Please refer to the help link for how to fix the issue: ${helpLink}`;
      }

      // alert("Login failed: " + err);
      return;
    }
  }


  async checkIsConsentNeeded() {
    let isAnd = false;
    let consentNeeded = false;
    try {
      await this.credential.getToken(this.scope);
    } catch (error) {
      consentNeeded = true;
    }
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("android")) {
      isAnd = true;
    }
    this.setState({
      showLoginPage: consentNeeded,
    });
    Providers.globalProvider.setState(
      consentNeeded ? ProviderState.SignedOut : ProviderState.SignedIn
    );

    this.setState({
      isAndroid: isAnd, // Update the isAndroid state
    });
    return consentNeeded;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState) {
      // if (prevState.isAndroid !== this.state.isAndroid) {
      //   if (this.state.isAndroid) {
      //     this.props.history.push("/dashboard");
      //   }
      //   //console.log(this.state.showLoginPage, "loginCheckk");
      // }
      if (prevState.showLoginPage !== this.state.showLoginPage) {
        if (!this.state.showLoginPage) {
          // this.props.history.push("/dashboard");
        }
      }
    }
    if (prevProps.currentTheme !== this.props.currentTheme) {
      this.setState({ mainTheme: this.props.currentTheme });
      this.props.setTheme(this.state.currTheme);
      if (this.props.currentTheme === "dark") {
        this.props.hooks(teamsDarkTheme);
        this.setState({ mainTheme: teamsDarkTheme });
      } else if (this.props.currentTheme === "contrast") {
        this.props.hooks(teamsHighContrastTheme);
        this.setState({ mainTheme: teamsHighContrastTheme });
      } else {
        this.props.hooks(teamsTheme);
        this.setState({ mainTheme: teamsTheme });
      }
    }
    if (prevProps.accessToken !== this.props.accessToken) {
      console.log(this.props);
      if (this.props.accessToken.length > 0) {
        this.props.history.push("/dashboard");
      }
    }
    // }
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowSizeChange);
  }
  handleWindowSizeChange = () => {
    this.setState({ isMobile: window.innerWidth <= 768 });
  };

  render() {
    const { isMobile } = this.state;
    return (
      <div className="login">
        <FluentUiProvider theme={teamsTheme} className="provider">
          <Flex style={{ height: "100%", width: "100%" }} className="content">
            <FlexItem className="login-section">
              <div id='logs' className="div1">
                <div id='logs' className="div1">
                  <div
                    style={{ float: "right", position: "relative" }}
                    className="top-images"
                  >
                    <img src={group} alt="" height={"3%"} />
                    <img src={ellipse} alt="" height={"10%"} />
                  </div>
                  <div className="left-svg">
                    <div className="images" style={{ position: "relative" }}>
                      <img src={leftSvg} alt="" style={{ height: "20%" }} />
                      <img
                        src={arrow}
                        alt=""
                        style={{
                          height: "10%",
                          width: "20%",
                          marginLeft: "-40px",
                        }}
                      />
                    </div>
                  </div>


                  <div className="bottom-circle">
                    <img src={bottomCircle} alt="" />
                  </div>
                </div>
              </div>
            </FlexItem>
            <FlexItem className="image-section">
              <div style={{ maxHeight: "100%" }}>
                <img className="right-image" src={illustration} alt="" />
              </div>
            </FlexItem>
          </Flex>
        </FluentUiProvider>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    CompanyReducer: state.CompanyReducer,
    isMobileDev: state.authReducer.isMobileDev,
    devEmail: state.authReducer.devEmail,
    accessToken: state.authReducer.accessToken,
  };
};

// mapDispatchToProps - maps the action dispatchers from Redux store to component props
const mapDispatchToProps = (dispatch) => {
  return {
    setTheme: () => dispatch((payload) => setTheme(payload)),
    storeAccessToken: () => dispatch((payload) => storeAccessToken(payload)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Login);
