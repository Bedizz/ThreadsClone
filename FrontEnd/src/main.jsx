import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  ChakraBaseProvider,
  ColorModeScript,
  extendTheme,
} from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

// ----- styling for dark mode -----

const styles = {
  global: (props) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("gray.100", "#101010")(props),
    },
  }),
};
// ----- theme configuration -----
const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};
// ----- custom colors -----
const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e",
  },
};
const theme = extendTheme({ styles, config, colors });

ReactDOM.createRoot(document.getElementById("root")).render(
  
    <RecoilRoot>
      <BrowserRouter>
        <ChakraBaseProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ChakraBaseProvider>
      </BrowserRouter>
    </RecoilRoot>
  
);
