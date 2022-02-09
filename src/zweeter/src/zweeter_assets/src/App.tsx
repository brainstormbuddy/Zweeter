import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { Routes, Route } from "react-router-dom";
import MenuBar from "./components/menubar";
import { store } from "./store/store";
import { Provider } from "react-redux";
import Timeline from "./Pages/timeline";
import Profile from "./Pages/profile";
import Tweet from "./Pages/tweet";
import Authenticate from "./Pages/authenticate";
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
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<MenuBar />}>
            <Route index element={<Authenticate />} />
            <Route path="/home" element={<Timeline />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tweet/:id" element={<Tweet />} />
          </Route>
        </Routes>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
