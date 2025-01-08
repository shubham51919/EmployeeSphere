import { useEffect, useState } from "react";
import Dashboard from "./Components/dashboard/Dashboard.jsx";
import Referral from "./Components/Referral/Referral";
import HRQueries from "./Components/HR/HRQueries.jsx";
import HrAdmin from "./Components/HrAdmin/HrAdmin.jsx";
import FoodPortal from "./Components/FoodPortal/FoodPortal.jsx";
import FoodPortalAdmin from "./Components/FoodPortalAdmin/FoodPortalAdmin.jsx";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import {
  Provider as FluentUiProvider,
  teamsTheme,
  mergeThemes,
} from "@fluentui/react-northstar";

import { useSelector } from "react-redux";
import Admin from "./Components/Admin/Admin.jsx";
import { app } from "@microsoft/teams-js";
import Documents from "./Components/Documents/Documents";
import DocumenetsTicket from "./Components/Documents/TicketDialog/DocumentsTicket/DocumenetsTicket";
import { useDispatch } from "react-redux";
import { setTheme } from "./redux/actions";
import Newsroom from "./Components/Newsroom/Newsroom";
import NewsroomAdmin from "./Components/Newsroom Admin/NewsroomAdmin";
import LoadingScreen from "./Components/LoadingScreen/LoadingScreen";
import Travel from "./Components/Travel/Travel.jsx";
import TravelAdmin from "./Components/TravelAdmin/TravelAdmin.jsx";
function App() {
  const dispatch = useDispatch();
  const CompanyReducer = useSelector((state) => {
    return state.CompanyReducer;
  });
  const [currentTheme, setCurrentTheme] = useState(null);

  const Segmenttheme = {
    componentVariables: {
      Card: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
      Dialog: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.brand.white,
      }),
      Flex: ({ colorScheme }) => ({
        color: colorScheme.brand.white,
        backgroundColor: colorScheme.default.backgroundHover,
      }),
    },
    componentStyles: {
      Card: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
      Dialog: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
      Flex: {
        root: ({ variables }) => ({
          color: variables.color,
          backgroundColor: variables.backgroundColor,
        }),
      },
    },
  };
  const CAtheme = {
    siteVariables: {
      colorScheme: {
        default: {
          backgroundHover: `${CompanyReducer.theme === "default" ? `#f5f5f5` : `rgb(31,31,31)`
            }`,
        },
      },
    },
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
  const [appTheme, setAppTheme] = useState(teamsTheme);

  useEffect(() => {
    app.initialize().then(() => {
      app.registerOnThemeChangeHandler((theme) => {
        setCurrentTheme(theme);
      });
      app.getContext().then((context) => {
        setCurrentTheme(context.app.theme);
        dispatch(setTheme(context.app.theme));
      });
    });
  }, []);

  return (
    <>
      <FluentUiProvider
        theme={mergeThemes(appTheme, Segmenttheme)}
        className="App"
      >
        <>
          <Router>
            <Routes>
              <Route
                path="/login"
                element={
                  <LoadingScreen
                    hooks={setAppTheme}
                    currentTheme={currentTheme}
                  />
                }
              />
              <Route path="/refer" element={<Referral hooks={setAppTheme} />} />
              <Route
                path="/dashboard"
                element={<Dashboard hooks={setAppTheme} />}
              />
              <Route path="/admin" element={<Admin hooks={setAppTheme} />} />
              <Route path="/hr" element={<HRQueries hooks={setAppTheme} />} />
              <Route
                path="/hradmin"
                element={<HrAdmin hooks={setAppTheme} />}
              />
              <Route
                path="/food-portal"
                element={
                  <FluentUiProvider theme={mergeThemes(appTheme, CAtheme)}>
                    <FoodPortal hooks={setAppTheme} />
                  </FluentUiProvider>
                }
              />

              <Route
                path="/food-portal-admin"
                element={<FoodPortalAdmin hooks={setAppTheme} />}
              />
              <Route
                path="/career-advice"
                element={
                  <FluentUiProvider theme={mergeThemes(appTheme, CAtheme)}>
                    <Newsroom hooks={setAppTheme} />
                  </FluentUiProvider>
                }
              />
              <Route
                path="/career-advice-admin"
                element={
                  <FluentUiProvider theme={mergeThemes(appTheme, CAtheme)}>
                    <NewsroomAdmin hooks={setAppTheme} />
                  </FluentUiProvider>
                }
              />
              <Route
                path="/documents"
                element={
                  <FluentUiProvider theme={mergeThemes(appTheme, CAtheme)}>
                    <Documents hooks={setAppTheme} />
                  </FluentUiProvider>
                }
              />
              <Route
                path="/documents-tickets"
                element={
                  <FluentUiProvider theme={mergeThemes(appTheme, CAtheme)}>
                    <DocumenetsTicket hooks={setAppTheme} />
                  </FluentUiProvider>
                }
              />
              <Route
                path="/travel"
                element={
                  <FluentUiProvider theme={mergeThemes(appTheme, CAtheme)}>
                    <Travel hooks={setAppTheme} />
                  </FluentUiProvider>
                }
              />
              <Route
                path="/travel-admin"
                element={
                  <FluentUiProvider theme={mergeThemes(appTheme, CAtheme)}>
                    <TravelAdmin hooks={setAppTheme} />
                  </FluentUiProvider>
                }
              />

              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Router>
        </>
      </FluentUiProvider>
    </>
  );
}

export default App;
