import React, { useState } from "react";

import { teal, yellow } from "@mui/material/colors";
import {
    createTheme,
    ThemeProvider,
    responsiveFontSizes,
} from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { NavBar } from "./components/NavBar";
import Webcam from "./components/CameraFrame"
let theme = createTheme({
    palette: {
        primary: {
            //   light: teal['A100'],
            main: yellow["A100"],
        },
        secondary: {
            main: teal["A100"],
        },
    },
    typography: {
        fontFamily: ["Roboto", '"Helvetica Neue"'].join(", "),
        h1: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h5: { fontWeight: 700 },
        h4: { fontWeight: 700 },
    },
});

theme = responsiveFontSizes(theme);

const App = () => {
    const [resultImage, setResultImage] = useState<string | undefined>(
        undefined
    );
 
    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <SnackbarProvider autoHideDuration={2000}>
                    <NavBar/>
                    <div style = {{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                            <Webcam/>
                   </div>                

                </SnackbarProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
};

export default App;
