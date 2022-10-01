import React, { useState } from "react";
<<<<<<< HEAD
import { grey, indigo, teal, lightBlue, deepPurple} from "@mui/material/colors";
=======

import { teal, deepPurple } from "@mui/material/colors";
>>>>>>> 6e070165ba473b3dcc5dcc1b44df5d86e8eef584
import {
    createTheme,
    ThemeProvider,
    responsiveFontSizes,
} from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { NavBar } from "./components/NavBar";

import Webcam from "./components/CameraFrame"
import Landing from "./landing/Landing";
import CameraFrame from "./components/CameraFrame";

let theme = createTheme({
    palette: {
        primary: {
            //   light: teal['A100'],
<<<<<<< HEAD
            main: indigo["800"],
=======
            main: deepPurple["300"],
>>>>>>> 6e070165ba473b3dcc5dcc1b44df5d86e8eef584
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
                    <Routes>
                        <Route index element={<Landing/>}/>
                        <Route path="/enroll" element={<CameraFrame/>} />
                    </Routes>
                </SnackbarProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
};

export default App;
