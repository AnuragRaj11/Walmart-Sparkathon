import React, { useRef } from 'react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: 'environment'
};

const Camera = () => {
  const webcamRef = useRef(null);

  return (
    <div>
      <h2>Live Camera Feed</h2>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        style={{
          width: "40%",
          borderRadius: "12px",
          border: "2px solid #ccc"
        }}
      />
    </div>
  );
};

export default Camera;
