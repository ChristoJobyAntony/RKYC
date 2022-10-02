import {
    Backdrop,
    Button,
    Card,
    CircularProgress,
    LinearProgress,
    Paper,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { Carousel, CarouselItem } from "../components/Carousel";
import React, { useState } from "react";
import api from "../api";
import { useSnackbar } from "notistack";
import CameraFrame from "../components/CameraFrame";
import Webcam from "react-webcam";
import fixWebmDuration from "fix-webm-duration";
import {
    ReactMediaRecorder,
    useReactMediaRecorder,
} from "react-media-recorder";

export default function Enroll() {
    const navigate = useNavigate();

    // Aadhaar id and OTP
    const theme = useTheme();
    const [activeIndex, setActiveIndex] = useState(0    );
    const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
    const [aadhaarId, setAadhaarId] = useState<string | undefined>(undefined);
    const [OTP, setOTP] = useState<string | undefined>(undefined);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [token, setToken] = useState<string | undefined>(undefined);

    // Camera Stuff
    const webcamRef = React.useRef<Webcam | null>(null);
    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
    const [capturing, setCapturing] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
    const [progress, setProgress] = React.useState(0);
    const [videoBlob, setVideoBlob] = React.useState<Blob | undefined>(
        undefined
    );
    let startTime: number;
    let duration: number = 10000;
    let timer: NodeJS.Timer;

    const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
        const videoRef = React.useRef<HTMLVideoElement>(null);

        React.useEffect(() => {
            if (videoRef.current && stream) {
                videoRef.current.srcObject = stream;
            }
        }, [stream]);
        if (!stream) {
            return null;
        }
        return (
            <video
                ref={videoRef}
                width={500}
                height={500}
                autoPlay
                controls={false}
            />
        );
    };

    // Audio stuff
    const [audioBlob, setAudioBlob] = React.useState<Blob | undefined>(
        undefined
    );
    const { status, startRecording, stopRecording, mediaBlobUrl } =
        useReactMediaRecorder({
            video: false,
            audio: true,
            blobPropertyBag: { type: "audio/wav" },
            askPermissionOnMount: true,
            onStart: () => {
                setTimeout(stopRecording, 5000);
            },
            onStop: (_, blob) => {
                setAudioBlob(blob);
            },
        });

    // Review Slide Stuff
    const steps = [
        "Verified Aadhaar ID",
        "2 Factor Authentication",
        "Face Authentication Enrollment",
        "Voice Authentication Enrollment",
    ];

    // Loading Screen
    const [loading, setLoading] = useState(false);

    const onVideoRecordStart = React.useCallback(() => {
        setCapturing(true);
        // stop after 10 seconds
        setTimeout(() => {
            stopVideoRecording();
        }, 10000);
        mediaRecorderRef.current = new MediaRecorder(
            webcamRef.current!.stream!,
            {
                mimeType: "video/webm;codecs=vp8,opus",
            }
        );

        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
        mediaRecorderRef.current.start();
    }, [webcamRef, setCapturing, mediaRecorderRef]);

    const handleDataAvailable = React.useCallback(
        ({ data }:any) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const stopVideoRecording = React.useCallback(() => {
        mediaRecorderRef.current!.stop();
        setCapturing(false);
        if (recordedChunks.length) {
            const buggyBlob = new Blob(recordedChunks, {
                type: "video/web;codecs=vp8,opus",
            });
            fixWebmDuration(buggyBlob, duration, (blob) => {
                console.log(blob);
                setVideoBlob(blob);
            });
        }
    }, [mediaRecorderRef, webcamRef, setCapturing]);

    const onClickNext0 = async () => {
        setNextButtonDisabled(true);
        try {
            if (aadhaarId === undefined) {
                setNextButtonDisabled(false);
                throw new Error("Please enter a value");
            }
            const resp = await api.check_availability(aadhaarId);
            if (!resp.result) {
                setNextButtonDisabled(false);
                throw new Error("The Aadhaar ID is invalid");
            }
            setToken((await api.issue_otp_enroll(aadhaarId)).token);
            console.log(token);
            setActiveIndex(1);
        } catch (e: any) {
            enqueueSnackbar(e.message, {variant: "error"});
        }
        setNextButtonDisabled(false);
    };

    const onClickNext1 = async () => {
        setNextButtonDisabled(true);
        try {
            if (token == undefined) throw new Error("Invalid Form Submission");
            if (aadhaarId == undefined)
                throw new Error("Invalid Form Submission");
            if (OTP == undefined) throw new Error("Please enter a value");
            if (!/^[0-9]{6}$/.test(OTP)) throw new Error("Invalid OTP syntax");
            const resp = await api.verify_otp(aadhaarId, token, parseInt(OTP));
            if (resp.result) setActiveIndex(2);
        } catch (e: any) {
            enqueueSnackbar(e.message, { variant: "error" });
        }
        setNextButtonDisabled(false);
    };

    const onClickNext2 = () => {
        setNextButtonDisabled(true);
        try {
            if (videoBlob == undefined)
                throw new Error("Please record a video before proceeding");
            setActiveIndex(3);
        } catch (e: any) {
            enqueueSnackbar(e.message, { variant: "error" });
        }
        setNextButtonDisabled(false);
    };

    const onClickNext3 = () => {
        setActiveIndex(4);
    };

    const onClickNext4 = async () => {
        setLoading(true);
        try {
            console.log(videoBlob);
            console.log(audioBlob);
            await api.enroll_user(aadhaarId!, token!, videoBlob!, audioBlob!);
            setActiveIndex(5)
        } catch (e) {
            throw e;
        }
        setLoading(false);

    };

    return (
        <div
            style={{
                backgroundColor: theme.palette.primary.light,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    height: "80%",
                    width: "60%",
                }}
            >
                <Backdrop
                    sx={{
                        color: "#fff",
                        zIndex: (them: any) => theme.zIndex.drawer + 1,
                    }}
                    open={loading}
                >
                    <Typography>
                        Your Request is being processed ...
                    </Typography>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Carousel activeIndex={activeIndex}>
                    {/* Aadhaar Number */}
                    <CarouselItem>
                        <div
                            style={{
                                height: "100%",
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-around",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    height: "20%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography variant="h4">
                                    RKYC Enrollment Application
                                </Typography>
                            </div>

                            <div
                                style={{
                                    height: "30%",
                                    width: "60%",
                                    display: "flex",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    flexDirection: "column",
                                }}
                            >
                                <Typography style={{ alignSelf: "start" }}>
                                    Enter your Aadhaar ID to get started
                                </Typography>
                                <TextField
                                    variant="filled"
                                    fullWidth
                                    label="Aadhaar Number"
                                    onChange={(e) =>
                                        setAadhaarId(e.target.value)
                                    }
                                />
                            </div>

                            <LoadingButton
                                loading={nextButtonDisabled}
                                loadingPosition="start"
                                style={{
                                    justifySelf: "end",
                                    margin: "20px",
                                    color: "white",
                                }}
                                onClick={onClickNext0}
                                variant="contained"
                            >
                                Next
                            </LoadingButton>
                        </div>
                    </CarouselItem>

                    {/* OTP Verification */}
                    <CarouselItem>
                        <div
                            style={{
                                height: "100%",
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-around",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    height: "20%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography variant="h3">
                                    Two Factor Authentication
                                </Typography>
                            </div>

                            <div
                                style={{
                                    height: "30%",
                                    width: "60%",
                                    display: "flex",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    flexDirection: "column",
                                }}
                            >
                                <Typography alignSelf="start">
                                    An OTP has been registered to your
                                    registered phone no
                                </Typography>
                                <TextField
                                    variant="filled"
                                    fullWidth
                                    label="OTP"
                                    onChange={(e) => setOTP(e.target.value)}
                                />
                            </div>

                            <LoadingButton
                                loading={nextButtonDisabled}
                                loadingPosition="start"
                                style={{
                                    justifySelf: "end",
                                    margin: "20px",
                                    color: "white",
                                }}
                                onClick={onClickNext1}
                                variant="contained"
                            >
                                Next
                            </LoadingButton>
                        </div>
                    </CarouselItem>

                    {/* Video Recording */}
                    <CarouselItem>
                        <div
                            style={{
                                height: "100%",
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-around",
                                alignItems: "center",
                            }}
                        >
                            {activeIndex == 2 && (
                                <ReactMediaRecorder
                                    video
                                    audio={false}
                                    blobPropertyBag={{ type: "video/webm" }}
                                    askPermissionOnMount
                                    onStop={(_, blob) => {
                                        setVideoBlob(blob);
                                    }}
                                    render={({
                                        previewStream,
                                        status,
                                        startRecording,
                                        stopRecording,
                                        mediaBlobUrl,
                                    }) => {
                                        return (
                                            <>
                                                <div
                                                    style={{
                                                        height: "10%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    <Typography variant="h3">
                                                        Face Enrollment
                                                    </Typography>
                                                </div>
                                                <div
                                                    style={{
                                                        height: "50%",
                                                        width: "70%",
                                                        display: "flex",
                                                        justifyContent:
                                                            "space-around",
                                                        alignItems: "center",
                                                        flexDirection: "column",
                                                    }}
                                                >
                                                    {status == "idle" && (
                                                        <Typography variant="h6">
                                                            {" "}
                                                            Please click start
                                                            when you'r ready to
                                                            record{" "}
                                                        </Typography>
                                                    )}
                                                    {status == "recording" && (
                                                        <VideoPreview
                                                            stream={
                                                                previewStream
                                                            }
                                                        />
                                                    )}
                                                    {status == "stopped" && (
                                                        <>
                                                            <Typography>
                                                                Preview your
                                                                recording and
                                                                retake if
                                                                necessary
                                                            </Typography>
                                                            <video
                                                                height="100%"
                                                                src={
                                                                    mediaBlobUrl
                                                                }
                                                                controls
                                                                autoPlay
                                                            />
                                                        </>
                                                    )}
                                                </div>

                                                {status == "idle" && (
                                                    <Button
                                                        onClick={() => {
                                                            startRecording();
                                                            setInterval(
                                                                stopRecording,
                                                                10000
                                                            );
                                                        }}
                                                        variant="contained"
                                                        style={{
                                                            justifySelf: "end",
                                                            margin: "20px",
                                                            color: "white",
                                                        }}
                                                    >
                                                        Start Recording
                                                    </Button>
                                                )}

                                                {status == "recording" && (
                                                    <div
                                                        style={{
                                                            width: "80%",
                                                            justifySelf: "end",
                                                            margin: "20px",
                                                        }}
                                                    >
                                                        <LinearProgress />
                                                    </div>
                                                )}

                                                {status == "stopped" && (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                        }}
                                                    >
                                                        <Button
                                                            onClick={() => {
                                                                startRecording();
                                                                setInterval(
                                                                    stopRecording,
                                                                    10000
                                                                );
                                                            }}
                                                            variant="contained"
                                                            style={{
                                                                justifySelf:
                                                                    "end",
                                                                margin: "20px",
                                                                color: "white",
                                                            }}
                                                        >
                                                            Retake
                                                        </Button>

                                                        <LoadingButton
                                                            loading={
                                                                nextButtonDisabled
                                                            }
                                                            loadingPosition="start"
                                                            style={{
                                                                justifySelf:
                                                                    "end",
                                                                margin: "20px",
                                                                color: "white",
                                                            }}
                                                            onClick={
                                                                onClickNext2
                                                            }
                                                            variant="contained"
                                                        >
                                                            Next
                                                        </LoadingButton>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    }}
                                />
                            )}
                        </div>
                    </CarouselItem>

                    {/* Audio Recording */}
                    <CarouselItem>
                        <div
                            style={{
                                height: "100%",
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-around",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    height: "10%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography variant="h3">
                                    Voice Enrollment
                                </Typography>
                            </div>

                            <div
                                style={{
                                    height: "50%",
                                    width: "70%",
                                    display: "flex",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    flexDirection: "column",
                                }}
                            >
                                <Typography>
                                    Click on the Start button and start talking
                                    a few words in your normal tone
                                </Typography>
                            </div>

                            {status == "idle" && (
                                <Button
                                    onClick={startRecording}
                                    variant="contained"
                                    style={{
                                        justifySelf: "end",
                                        margin: "20px",
                                        color: "white",
                                    }}
                                >
                                    Start
                                </Button>
                            )}

                            {status == "recording" && (
                                <div
                                    style={{
                                        width: "80%",
                                        justifySelf: "end",
                                        margin: "20px",
                                    }}
                                >
                                    <LinearProgress />
                                </div>
                            )}

                            {status == "stopped" && (
                                <div style={{ display: "flex" }}>
                                    <Button
                                        onClick={startRecording}
                                        variant="contained"
                                        style={{
                                            justifySelf: "end",
                                            margin: "20px",
                                            color: "white",
                                        }}
                                    >
                                        Retake
                                    </Button>

                                    <LoadingButton
                                        loading={nextButtonDisabled}
                                        loadingPosition="start"
                                        style={{
                                            justifySelf: "end",
                                            margin: "20px",
                                            color: "white",
                                        }}
                                        onClick={onClickNext3}
                                        variant="contained"
                                    >
                                        Next
                                    </LoadingButton>
                                </div>
                            )}
                        </div>
                    </CarouselItem>

                    {/* Confirmations */}
                    <CarouselItem>
                        <div
                            style={{
                                height: "100%",
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-around",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    height: "10%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography variant="h3">
                                    Voice Enrollment
                                </Typography>
                            </div>

                            <div
                                style={{
                                    height: "50%",
                                    width: "70%",
                                    display: "flex",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    flexDirection: "column",
                                }}
                            >
                                <Stepper activeStep={3} orientation="vertical">
                                    {steps.map((step) => (
                                        <Step key={step}>
                                            <StepLabel>{step}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </div>

                            <LoadingButton
                                loading={nextButtonDisabled}
                                loadingPosition="start"
                                style={{
                                    justifySelf: "end",
                                    margin: "20px",
                                    color: "white",
                                }}
                                onClick={onClickNext4}
                                variant="contained"
                            >
                                Register
                            </LoadingButton>
                        </div>
                    </CarouselItem>

                    <CarouselItem>
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-evenly",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    flex: "0 0",
                                    padding: "20px",
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    align="center"
                                    whiteSpace="normal"
                                >
                                    Great Job 🎉 🥳, Your all done 👍
                                </Typography>
                            </div>

                            <div
                                style={{
                                    flex: "2 0",
                                    width: "90%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "space-evenly",
                                }}
                            >
                                <CheckCircleOutlineOutlinedIcon
                                    fontSize="large"
                                    color="success"
                                />
                                <Typography
                                    variant="h6"
                                    whiteSpace="normal"
                                    textAlign="center"
                                >
                                    You have been successfully enrolled with
                                    Remote KYC. <br />
                                    Welcome to the future of secure and
                                    effortless authentication.
                                </Typography>
                            </div>

                            <div
                                style={{
                                    flex: "1 0",
                                    width: "90%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        enqueueSnackbar(
                                            "Login using your the credentials you created",
                                            { variant: "info" }
                                        );
                                        navigate("/verify");
                                    }}
                                >
                                    Test Run KYC
                                </Button>
                            </div>
                        </div>
                    </CarouselItem>
                </Carousel>
            </div>
        </div>
    );
}
