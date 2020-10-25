// import logo from './logo.svg';
// import './App.css';

// import React, {useRef} from "react";
// import "./App.css";
// import * as tf from "@tensorflow/tfjs";
// import * as posenet from "@tensorflow-models/posenet";
// import Webcam from "react-webcam"
// import { drawKeypoints, drawSkeleton } from '../utilities'
// import { Modal, Button } from 'react-bootstrap';


// class Home {
// const webcamRef = useRef(null);
// const canvasRef = useRef(null);

// const [modalShow, setModalShow] = React.useState(false);

// const runPosenet = async () => {
//   const net = await posenet.load({
//     inputResolution: {width:640, height:480},
//     scale:0.5
//   });

//   setInterval(() => {
//     detect(net)
//   }, 1000);
// }

// const detect = async (net) => {
//   if(typeof webcamRef.current!=="undefined" && webcamRef.current !== null && webcamRef.current.video.readyState===4) {
//     const video = webcamRef.current.video;

//     // Get Video Properties
//     const videoWidth = webcamRef.current.video.videoWidth;
//     const videoHeight = webcamRef.current.video.videoHeight;

//     // Set video width
//     webcamRef.current.video.width = videoWidth;
//     webcamRef.current.video.height = videoHeight;

//     // Make Detections
//     const pose = await net.estimateSinglePose(video);
//     console.log(pose);

//     //drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
//   }
// }

// const drawCanvas = (pose,video, videoWidth, videoHeight, canvas) => {
//   const ctx = canvas.current.getContext("2d");
//   canvas.current.width = videoWidth;
//   canvas.current.height = videoHeight;

//   drawKeypoints(pose["keypoints"], 0.5, ctx);
//   drawSkeleton(pose["keypoints"], 0.5, ctx);
// }

// runPosenet();

// function MyVerticallyCenteredModal(props) {
//   return (
//     <Modal
//       {...props}
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <Modal.Body style={{display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center"
//         }}>
//       <Webcam  
//           ref={webcamRef}
//           className="webcamStyle" />

//         <canvas
//           ref={canvasRef}
//           className="webcamStyle" />
//       </Modal.Body>

//     </Modal>
//   );
// }

//   return (
//     <div className="App">
//       <body>
    
//       <MyVerticallyCenteredModal
//         show={modalShow}
//         onHide={() => setModalShow(false)}
//       />
//         <button className="btn btn-primary" onClick={() => setModalShow(true)}>Open Webcam</button>
//       </body>
//     </div>
//   );
// }

// export default Home;
