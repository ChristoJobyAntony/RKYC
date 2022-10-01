import { Card, TextField, Typography } from "@mui/material";
import React from "react";

export default function Enroll () {
    return (
        <Card style={{
            borderRadius: "10px"
        }}>
            <Typography
                variant="h3">
                    RKYC Enrollment Application
            </Typography>

            <TextField fullWidth label="Aadhaar" id=" First 6 digits" />
        </Card>
    )
}