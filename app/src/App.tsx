import React, { useState } from "react";
import { teal, brown } from "@mui/material/colors";
import {
    createTheme,
    ThemeProvider,
    responsiveFontSizes,
} from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { NavBar } from "./components/NavBar";

import Landing from "./landing/Landing";
import CameraFrame from "./components/CameraFrame";
import Enroll from "./enroll/Enroll";
import Verify from "./verify/Verify";

let theme = createTheme({
    palette: {
        primary: {
            contrastText: brown["100"],
            main: brown["900"],
            light: brown["200"],
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
                    <NavBar />
                    <Routes>
                        <Route index element={<Landing />} />
                        <Route path="/enroll" element={<Enroll />} />
                        <Route path="/verify" element={<Verify />} />
                        <Route path="/test" element={<CameraFrame />} />
                    </Routes>
                </SnackbarProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
};

export default App;
