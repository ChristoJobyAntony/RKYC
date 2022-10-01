import React from "react";
import Webcam from "react-webcam";
import fixWebmDuration from "fix-webm-duration";


const CameraFrame = () => {
  const webcamRef = React.useRef<Webcam | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  let startTime : number;
  let duration : number;

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current!.stream!, {
      mimeType: "video/webm;codecs=vp8,opus"
    });

    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );

    mediaRecorderRef.current.start();
    startTime = Date.now();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    duration = Date.now() - startTime;
    mediaRecorderRef.current!.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const buggyBlob = new Blob(recordedChunks, {
        type: "video/web;codecs=vp8,opus"
      });
      fixWebmDuration(buggyBlob, duration, {logger: false})
      .then(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = "react-webcam-stream-capture.webm";
        a.click();
        window.URL.revokeObjectURL(url);
        setRecordedChunks([]);
      });
    }
  }, [recordedChunks]);

  return(
    <div style={{
      display: "flex",
      alignContent: "center",
      justifyContent: "center"
      }}
      >
      <Webcam height={320} width={720} audio={false} ref={webcamRef} />
      {capturing ? (
        <button onClick={handleStopCaptureClick}>Stop Capture</button>
      ) : (
        <button onClick={handleStartCaptureClick}>Start Capture</button>
      )}
      {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download</button>
      )}
    </div>
  )

}
export default CameraFrame;

