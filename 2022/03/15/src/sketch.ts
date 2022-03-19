/* =============================================
 * TypeScript p5.js Boilerplate
 * adapted by Daniel Tompkins
 * https://github.com/l00sed/p5js-boilerplate-ts
 * ============================================= */

// Typed p5.js library and add-ons
import p5 from 'p5'
import 'p5/lib/addons/p5.dom'   // must use 'p5.' context
import 'p5/lib/addons/p5.sound' // must use 'p5.' context

/* ---------------------------------------------
 * Types for MediaRecorder and related classes
 * are included in the dev dependency:
 * '@types/dom-mediacapture-record'
 * --------------------------------------------- */

/* ---------------------------------------------
 * Fixes issues with HTMLCanvasElement type not
 * recognizing "captureStream" method
 * (captureStream is still a working draft
 * as of June 2021)
 * ---------------------------------------------
 * https://stackoverflow.com/questions/50651091/unresolved-method-capturestream-on-htmlcanvaselement
 * --------------------------------------------- */
interface CanvasElement extends HTMLCanvasElement {
  captureStream?(frameRate?:number):MediaStream
}

/* ---------------------------------------------
 * P5Recorder - recorder.js adapted for ES6 and TypeScript
 * ---------------------------------------------
 * https://github.com/aferriss/p5Recorder
 * --------------------------------------------- */
import Recorder from './recorder'

/**
 * @param {p5} p
 */

export const sketch = (p: p5) => {
  /* ==================================
   * Animation recording mechanics
   * ================================== */

  // Set recording (and sketch) framerate
  const framerate:number = 120

  // Set MediaRecorder options
  const settings:Object = {
    fps: <number> framerate,
    filename: <string> 'sketch.mp4',
    codec: <string> 'video/webm;codecs=h264,opus', // use h.264 codec
    videoBitsPerSecond: <number> 5000000, // sets 5Mb bitrate
  }

  let recorder:Recorder
  let recording = false

  /* =====================================
   * P5.js - Setup
   * ===================================== */

  // Setup sketch parameters
  const width:number = 1500
  const height:number = 1500

  let canvas:CanvasElement
  let context // Leave for use with gradients

  p.setup = () => {
    // Define your initial environment props & other stuff here
    p.createCanvas(width, height) // Define canvas element
    p.frameRate(framerate) // Use recording framerate
    context = (p as any).drawingContext // Leave to disable eslint warning by setting "p as any"
  }

  /* ===========================================
   * p5.js - Drawing
   * =========================================== */

  let t:number = 0 // loop counter
  let range:number = 55
  let x0:number = width*6
  let x1:number = width*8
  let x2:number = width*10
  let x3:number = width*6
  let y0:number = height*2
  let y1:number = height*2
  let y2:number = height*4
  let y3:number = height*4

  p.draw = () => {
    // Define render logic for your sketch here
    p.scale(Math.cos(t)*0.1)
    p.rotate(Math.sin(t), p.createVector(width/2, height/2, 0))
    p.background(0,5)
    p.stroke(200+t%55,60+t%155,200+t%55,250)
    p.strokeWeight(3)
    p.noFill()
    p.beginShape()
      p.vertex(x0,y0)
      p.bezierVertex(x1, y1, x2, y2, x3, y3)
    p.endShape()

    x0+=(-range*Math.random()+range*Math.random())
    x1+=(-range*Math.random()+range*Math.random())
    x2+=(-range*Math.random()+range*Math.random())
    x3+=(-range*Math.random()+range*Math.random())
    y0+=(-range*Math.random()+range*Math.random())
    y1+=(-range*Math.random()+range*Math.random())
    y2+=(-range*Math.random()+range*Math.random())
    y3+=(-range*Math.random()+range*Math.random())

    p.fill(255,255)
    p.stroke(255,255)
    p.ellipse(x0,y0,25)
    p.ellipse(x3,y3,25)

    t+=0.05 // counter
  }

  p.keyPressed = () => {
    if (p.keyCode === 82) {
      // toggle recording true or false
      recording = !recording
      console.log('RECORDING: '+recording.toString())
    }

    // Export sketch's canvas to file when pressing "r"
    // if recording now true, start recording
    if (p.keyCode === 82 && recording) {
      console.log('Video recording started')
      canvas = document.querySelector('canvas')
      recorder = new Recorder(canvas, p, settings)
      recorder.start()
    }
    // if we are already recording, stop the recording
    if (p.keyCode === 82 && !recording) {
      console.log('Video recording stopped')
      recorder.stop()
    }
    // Export sketch's canvas to .png image file when pressing "p"
    if (p.keyCode === 80) {
      console.log('saving .png')
      p.saveCanvas('sketch', 'png')
    }
  }
}
