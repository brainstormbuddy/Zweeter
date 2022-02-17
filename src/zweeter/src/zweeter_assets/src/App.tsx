import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { Routes, Route } from "react-router-dom";
import MenuBar from "./components/menubar";
import Profile from "./Pages/profile";
import Authenticate from "./Pages/authenticate";
import { useAuthClient } from "./hooks";
import { AuthClient } from "@dfinity/auth-client";
import { _SERVICE } from "../../declarations/zweeter/zweeter.did";
import { ActorSubclass } from "@dfinity/agent";
import AllTweets from "./Pages/allTweets";
const theme = createTheme({
  palette: {
    primary: {
      main: "#ab47bc",
    },
    secondary: {
      main: "#ff9100",
    },
  },
});
export const AppContext = React.createContext<{
  authClient?: AuthClient;
  setAuthClient?: React.Dispatch<AuthClient>;
  isAuthenticated?: boolean;
  setIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>;
  login: () => void;
  logout: () => void;
  actor?: ActorSubclass<_SERVICE>;
  hasLoggedIn: boolean;
  actorName?: string;
  setName: (name: string) => void;
}>({
  login: () => {},
  logout: () => {},
  hasLoggedIn: false,
  setName: (name: string) => {},
});
const App = () => {
  const {
    authClient,
    setAuthClient,
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout,
    actor,
    hasLoggedIn,
    setName,
    actorName,
  } = useAuthClient();
  return (
    <AppContext.Provider
      value={{
        authClient,
        setAuthClient,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        actor,
        hasLoggedIn,
        setName,
        actorName,
      }}
    >
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<MenuBar />}>
            <Route index element={<Authenticate />} />
            <Route path="/home" element={<Profile />} />
            <Route path="/timeline" element={<AllTweets />} />
          </Route>
        </Routes>{" "}
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default App;
