import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ChildFriendlyOutlined } from "@mui/icons-material";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

export function NavBar() {
    const theme = useTheme();
    const navigate = useNavigate();
    return (
        <AppBar
            position="static"
            /*color="primary"*/
            >
            <Toolbar>
                <Typography
                    //variant="h3"
                    fontSize={"55px"}
                    align="right"
                    fontFamily = "Courier"
                    component="div"
                    color={"#fffafa"}
                    sx={{ flexGrow: 1 }}
                    onClick={() => navigate("/")}
                >
<<<<<<< HEAD
                    KYC 
                </Typography>
                <Typography
                    align="left"
                    fontSize={"25px"}
                    fontFamily = "Courier"
                    component="div"
                    margin={"2px"}
                    vertical-textAlign="bottom"
                    color={"#ff8a65"}
                    sx={{ flexGrow: 1 }}
                    onClick={() => navigate("/")}
                >
                    &nbsp;Unstringed
=======
                    RKYC

>>>>>>> 6e070165ba473b3dcc5dcc1b44df5d86e8eef584
                </Typography>
            </Toolbar>
            </AppBar>
    );
}
