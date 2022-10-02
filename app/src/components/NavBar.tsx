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
        <AppBar position="static">
            <Toolbar>
                <Typography
                    color = {theme.palette.primary.contrastText}
                    variant="h4"
                    align="left"
                    component="div"
                    sx={{ flexGrow: 1 }}
                    onClick={() => navigate("/")}
                >
                    Remote KYC
                </Typography>
                
                <Typography color={"white"}>
                    <Button variant="text" color="inherit" sx={{margin: "10px"}} onClick={() => navigate("/enroll")}>
                        Enroll
                    </Button>
                </Typography>

                <Typography color={"white"}>
                    <Button variant="text" color="inherit" sx={{margin: "10px"}} onClick={()=> navigate("/verify")}>
                        Verify
                    </Button>
                    
                </Typography>
            </Toolbar>
            </AppBar>
    );
}
