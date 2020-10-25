import './App.css';
import React, {useEffect, useRef, useState} from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam"
import {Modal} from 'react-bootstrap'
import { drawKeypoints, drawSkeleton } from './utilities'
import{ Card, Button } from 'react-bootstrap'
import {products} from './db'

function App() {
const webcamRef = useRef(null);
const canvasRef = useRef(null);
const [show, setShow] = useState(false);
//const [products, setProducts] = useState([]);
const [screenshot, setScreenshot] = useState(null);

useEffect(() => {
 // getProducts();
},[]);

const runPosenet = async () => {
  const net = await posenet.load({
    inputResolution: {width:640, height:480},
    scale:0.5
  });

  const netHand = await handpose.load();

  setInterval(() => {
    detect(net, netHand)
  }, 1000);
}

//  function getProducts() {
//    fetch('http://localhost:3001/products').then(res=>{
//      return res.json();
//    }).then(obj=>setProducts(obj))
//  }

const detect = async (net, netHand) => {
  if(typeof webcamRef.current!=="undefined" && webcamRef.current !== null && webcamRef.current.video.readyState===4) {
    const video = webcamRef.current.video;

    // Get Video Properties
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set video width
    webcamRef.current.video.width = videoWidth;
    webcamRef.current.video.height = videoHeight;

   // canvasRef.current.width = videoWidth
   // canvasRef.current.height = videoHeight

    // Make Detections
    //console.log(pose);
    const pose = await net.estimateSinglePose(video);

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
        takeScreenshot(pose);
        console.log(pose);
        setShow(false);
      }
      if(hand[0].landmarks[4][1]>=max){
        alert("DOWN");
      }
    }

    //drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
  }
}

function sendPicture(data) {
 const datas = {
   method: "post",
   body: JSON.stringify(data),
   headers: {'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'*'}
 };
 return fetch('http://localhost:5000/api/process_img', datas)
 .then(response=>{return response.json()}).then((obj)=>{console.log(obj);
  alert(`Your shoulder width is ${Math.round(obj.shoulderWidth)}cm and hip width is ${Math.round(obj.hipWidth)}cm`)})
} 

const drawCanvas = (pose,video, videoWidth, videoHeight, canvas) => {
  const ctx = canvas.current.getContext("2d");
  canvas.current.width = videoWidth;
  canvas.current.height = videoHeight;

  drawKeypoints(pose["keypoints"], 0.5, ctx);
  drawSkeleton(pose["keypoints"], 0.5, ctx);
}

runPosenet();

const takeScreenshot=(pose) =>{
  if(webcamRef!==null){
    const screenshot = webcamRef.current.getScreenshot();
    console.log(pose)
    let obj = {
      ImgSrc : screenshot,
      leftShoulder: pose.keypoints[5],
      rightShoulder: pose.keypoints[6],
      leftHip: pose.keypoints[11],
      rightHip: pose.keypoints[12],
    }
    
    sendPicture(obj);
    //console.log(obj);
    //var image = new Image();
    //image.src = screenshot;
    //console.log(screenshot);
    //document.body.appendChild(image)
    setScreenshot({screenshot: screenshot});
  }
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
          <canvas ref={canvasRef} className='webcamStyle'/>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-danger" onClick={()=>setShow(false)}>Close</button>
      </Modal.Footer>
    </Modal>
  );
}

  return (
    <div className="App">
      <header className="App-header">
          <div>
          {products.length>0 && products.map((el,ind)=>{
            return (<Card style={{margin: '10px'}} key={ind}>
                      <Card.Body>
                        <div style={{display: 'flex'}}>
                        <div style={{textAlign: 'left'}}>
                        <Card.Text style={{color:'black'}}>
                        Name: {el.name}
                        </Card.Text>
                        <Card.Text style={{color:'black'}}>
                        Brand: {el.brand} 
                        </Card.Text>
                        <Card.Text style={{color:'black'}}>
                        Price: {el.price} $
                        </Card.Text>
                        <Card.Text style={{color:'black'}}>
                        Category: {el.category}
                        </Card.Text>
                        <Button variant="primary" onClick={()=>setShow(true)}  style={{margin:'20px 0px 0px 0px'}}>Open camera</Button>
                        </div>
                        <div>
                        <img src={el.image} style={{width: '320px'}}/>
                        </div>
                        </div>
                      </Card.Body>
                    </Card>
              )
          })
          }
         {/* {screenshot && <img src={`${screenshot}`} alt="Red dot" /> } */}
          </div>
        <MyVerticallyCenteredModal/>
      </header>
    </div>
  );
}

export default App;
