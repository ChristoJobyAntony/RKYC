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

import {
  ReactMediaRecorder,
  useReactMediaRecorder,
} from "react-media-recorder";

export default function Verify() {
  const navigate = useNavigate();

  // Aadhaar id and OTP
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [nextButtonDisabled, setNextButtonDisabled] = useState(false);
  const [aadhaarId, setAadhaarId] = useState<string | undefined>(undefined);
  const [OTP, setOTP] = useState<string | undefined>(undefined);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [token, setToken] = useState<string | undefined>(undefined);

  // Camera Stuff
  const [poseSequence, setPoseSequence] = useState<string[]>([]);
  const [currentPose, setCurrentPose] = useState<number>(0);
  const [videoBlob, setVideoBlob] = React.useState<Blob | undefined>(undefined);

  let poseTimer;

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
  const [audioBlob, setAudioBlob] = React.useState<Blob | undefined>(undefined);
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

  // Loading Screen
  const [loading, setLoading] = useState(false);

  const onClickNext0 = async () => {
    setNextButtonDisabled(true);
    try {
      if (aadhaarId === undefined) {
        throw new Error("Please enter a value");
      }
      const resp = await api.check_is_enrolled(aadhaarId);
      console.log(resp);

      if (!resp.result) {
        throw new Error("The Aadhaar ID is invalid");
      }
      setToken((await api.issue_otp_verification(aadhaarId)).token);
      setActiveIndex(1);
    } catch (e: any) {
      enqueueSnackbar(e.message, { variant: "error" });
    }
    setNextButtonDisabled(false);
  };

  const onClickNext1 = async () => {
    setNextButtonDisabled(true);
    try {
      if (token == undefined) throw new Error("Invalid Form Submission");
      if (aadhaarId == undefined) throw new Error("Invalid Form Submission");
      if (OTP == undefined) throw new Error("Please enter a value");
      if (!/^[0-9]{6}$/.test(OTP)) throw new Error("Invalid OTP syntax");
      const resp = await api.verify_otp_verification(
        aadhaarId,
        token,
        parseInt(OTP)
      );
      const seq: string[] = [];
      for (let c of resp.sequence) {
        if (c == "L") seq.push("Look Left");
        else if (c == "R") seq.push("Look Right");
        else if (c == "U") seq.push("Look Up");
        else if (c == "D") seq.push("Look Down");
        else if (c == "F") seq.push("Look Front");
      }
      console.log(resp.sequence);
      console.log(seq);
      setPoseSequence(seq);
      setActiveIndex(2);
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

  const onClickNext3 = async () => {
    setLoading(true);
    try {
      console.log(videoBlob);
      console.log(audioBlob);
      await api.verify_user(aadhaarId!, token!, videoBlob!, audioBlob!);
      setActiveIndex(4);
    } catch (e) {
      throw e;
    }
    setLoading(false);
  };

  const onClickNext4 = async () => {
    setLoading(true);
    try {
      console.log(videoBlob);
      console.log(audioBlob);
      await api.enroll_user(aadhaarId!, token!, videoBlob!, audioBlob!);
      setActiveIndex(5);
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
          <Typography>Your Request is being processed ...</Typography>
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
                <Typography variant="h4">Remote KYC Verification</Typography>
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
                  Enter your registered Aadhaar ID
                </Typography>
                <TextField
                  variant="filled"
                  fullWidth
                  label="Aadhaar Number"
                  onChange={(e) => setAadhaarId(e.target.value)}
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
                <Typography variant="h3">Two Factor Authentication</Typography>
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
                  An OTP has been registered to your registered phone no
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
                  onStart={() => {
                    setCurrentPose(0);
                    const poseTimer = setInterval(
                      () =>
                        setCurrentPose((prevPose) => {
                          if (prevPose < poseSequence.length)
                            return prevPose + 1;
                          clearInterval(poseTimer);
                          return prevPose;
                        }),
                      3000
                    );
                  }}
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
                            justifyContent: "center",
                          }}
                        >
                          <Typography variant="h3">
                            {status != "recording"
                              ? "Face Verification"
                              : poseSequence[currentPose]}
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
                          {status == "idle" && (
                            <>
                              <Typography variant="h6">
                                Click the record button and follow the following
                                poses
                              </Typography>
                              <Stepper activeStep={0} orientation="vertical">
                                {poseSequence.map((pose) => (
                                  <Step key={pose}>
                                    <StepLabel>{pose}</StepLabel>
                                  </Step>
                                ))}
                              </Stepper>
                            </>
                          )}
                          {status == "recording" && (
                            <VideoPreview stream={previewStream} />
                          )}
                          {status == "stopped" && (
                            <>
                              <Typography>
                                Preview your recording and retake if necessary
                              </Typography>
                              <video
                                height="100%"
                                src={mediaBlobUrl}
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
                              setInterval(stopRecording, 12000);
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
                          <Stepper
                            activeStep={currentPose}
                            orientation="horizontal"
                          >
                            {poseSequence.map((pose) => (
                              <Step key={pose}>
                                <StepLabel>{pose}</StepLabel>
                              </Step>
                            ))}
                          </Stepper>
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
                                setInterval(stopRecording, 12000);
                              }}
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
                              onClick={onClickNext2}
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
                <Typography variant="h3">Voice Authentication</Typography>
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
                {}
                <Typography>
                  {status == "idle" &&
                    "Click on the Start button and start talking a few words in your normal tone"}
                  {status == "recording" && "Recording in progress ..."}
                  {status == "stopped" && "Recording has been completed"}
                </Typography>
                {/* {status == "stopped" && <video
                    height="100%"
                    src={mediaBlobUrl}
                    autoPlay
                />} */}
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
                <Typography variant="h4" align="center" whiteSpace="normal">
                  Congrats Your KYC Application is Submitted 🎉 🥳, We will get
                  back to you soon 👍
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
                <Typography variant="h6" whiteSpace="normal" textAlign="center">
                  Your application has been submitted successfully with Remote
                  KYC 💯 <br />
                  Thank you for using Remote KYC 🙏
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
              ></div>
            </div>
          </CarouselItem>
        </Carousel>
      </div>
    </div>
  );
}
