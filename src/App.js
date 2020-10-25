import logo from './logo.svg';
import './App.css';
import React, {useRef, useState} from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam"
import {Modal} from 'react-bootstrap'
import { drawKeypoints, drawSkeleton } from './utilities'
import{ Card, Button } from 'react-bootstrap'

let niz = [1,2,3,4,5,6,7,1,2,3,4,5,6,7];

function App() {
const webcamRef = useRef(null);
const canvasRef = useRef(null);
const [show, setShow] = useState(false);
const [screenshot, setScreenshot] = useState(null);

const runPosenet = async () => {
  const net = await posenet.load({
    inputResolution: {width:640, height:480},
    scale:0.5
  });

  const netHand = await handpose.load();
  console.log('Hand pose');

  setInterval(() => {
    detect(net, netHand)
  }, 1000);
}

const detect = async (net, netHand) => {
  if(typeof webcamRef.current!=="undefined" && webcamRef.current !== null && webcamRef.current.video.readyState===4) {
    const video = webcamRef.current.video;

    // Get Video Properties
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set video width
    webcamRef.current.video.width = videoWidth;
    webcamRef.current.video.height = videoHeight;

    canvasRef.current.width = videoWidth
    canvasRef.current.height = videoHeight

    // Make Detections
    const pose = await net.estimateSinglePose(video);
    //console.log(pose);

    const hand = await netHand.estimateHands(video);
    console.log(hand);
    if(hand.length>0){
      let min = 10000
      hand[0].landmarks.forEach((el,id)=>{
        if(id!==4){
          if(el[1]<min){
            min=el[1];
          }
        }
      })
      let max = 0
      hand[0].landmarks.forEach((el,id)=>{
        if(id!==4){
          if(el[1]>max){
            max=el[1];
          }
        }
      })
      if(hand[0].landmarks[4][1]<=min){
        takeScreenshot()
        console.log(pose);
        setShow(false);
      }
      if(hand[0].landmarks[4][1]>=max){
        alert("THUMBS DOWN");
      }
    }

    //drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
  }
}

const drawCanvas = (pose,video, videoWidth, videoHeight, canvas) => {
  const ctx = canvas.current.getContext("2d");
  canvas.current.width = videoWidth;
  canvas.current.height = videoHeight;

  drawKeypoints(pose["keypoints"], 0.5, ctx);
  drawSkeleton(pose["keypoints"], 0.5, ctx);
}

runPosenet();

const takeScreenshot=() =>{
  var screenshot = webcamRef.current.getScreenshot();
  //let dec =URL.createObjectURL(new Blob([screenshot] , {type:'text/plain'}));
  var image = new Image();
  image.src = screenshot;
  console.log(screenshot);
  document.body.appendChild(image);
  setScreenshot({screenshot: screenshot});
}

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      show = {show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body  style={{width:"640px",height:"490px"}}>
          <Webcam ref={webcamRef} className='webcamStyle' screenshotFormat="image/jpeg"/>
          <canvas ref={canvasRef} className='webcamStyle' screenshotFormat="image/jpeg"/>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={()=>setShow(false)}>Close</button>
      </Modal.Footer>
    </Modal>
  );
}

  return (
    <div className="App">
      <header className="App-header">
          <div>
          {niz.map((el)=>{
            return (<Card style={{width: '250px'}}>
                      <Card.Body>
                        <Card.Title>{el}</Card.Title>
                        <Card.Text style={{color:'black'}}>
                          Description
                        </Card.Text>
                        <Button variant="primary" onClick={()=>setShow(true)}>Open camera</Button>
                      </Card.Body>
                    </Card>
              )
          })
          }
         {screenshot && <img src={`${screenshot}`} alt="Red dot" /> }
          </div>
        <MyVerticallyCenteredModal/>
      </header>
    </div>
  );
}

export default App;
