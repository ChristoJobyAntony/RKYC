import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import fixWebmDuration from "fix-webm-duration";
import { useReactMediaRecorder, ReactMediaRecorder } from "react-media-recorder";


const CameraFrame = () => {
  const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
  
    useEffect(() => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);
    if (!stream) {
      return null;
    }
    return <video ref={videoRef} width={500} height={500} autoPlay controls />;
  };
  
  return (<>
      <ReactMediaRecorder
      video
      render={({ previewStream, status, startRecording, stopRecording, mediaBlobUrl }) => {
        return (
          <><VideoPreview stream={previewStream} /><div>
            <p>{status}</p>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
            <video src={mediaBlobUrl} controls autoPlay loop />
          </div></>
          );
      }}
    />

  </>
  );

}
export default CameraFrame;

