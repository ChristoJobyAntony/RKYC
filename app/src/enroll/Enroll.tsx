import { Button, Card, Paper, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {Carousel, CarouselItem} from "../components/Carousel";
import React, { useState } from "react";

export default function Enroll () {
    const theme = useTheme();
    const [activeIndex, setActiveIndex] = useState(0)
    return (
        <div style={{
            backgroundColor:theme.palette.primary.light,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Carousel activeIndex={activeIndex}>
                <CarouselItem>
                    <Card 
                        elevation={6}
                        sx={{
                        marginTop: "10px",
                        backgroundColor: "#FAF9F6",
                        borderRadius: "10px",
                        width: "60%",
                        height: "80%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-around",
                        flexDirection: "column"
                    }}>
                        <div style={{
                            height: "20%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Typography
                            variant="h3">
                                RKYC Enrollment Application
                            </Typography>
                        </div>
                        
                        <div style={{
                            height: "30%",
                            width: "60%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <TextField fullWidth label="Aadhaar Id Card"/>
                        </div>

                        <Button 
                            style={{
                                justifySelf: "end",
                                margin: "20px",
                            }}
                            variant="contained">
                                Next
                        </Button>


                    </Card>
                </CarouselItem>

                <CarouselItem>
                    <Card 
                        elevation={6}
                        sx={{
                        marginTop: "10px",
                        backgroundColor: "#FAF9F6",
                        borderRadius: "10px",
                        width: "60%",
                        height: "80%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-around",
                        flexDirection: "column"
                    }}>
                        <div style={{
                            height: "20%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Typography
                            variant="h3">
                                RKYC Enrollment Application
                            </Typography>
                        </div>
                        
                        <div style={{
                            height: "30%",
                            width: "60%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <TextField fullWidth label="Aadhaar Id Card"/>
                        </div>

                        <Button 
                            style={{
                                justifySelf: "end",
                                margin: "20px",
                            }}
                            variant="contained">
                                Next
                        </Button>


                    </Card>
                </CarouselItem>
                
            </Carousel>
        </div>
    )
}