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
  const framerate:number = 30

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
    p.createCanvas(width, height, p.WEBGL) // Define canvas element
    p.frameRate(framerate) // Use recording framerate
    context = (p as any).drawingContext // Leave to disable eslint warning by setting "p as any"
  }

  /* ===========================================
   * p5.js - Drawing
   * =========================================== */

  let t:number = 0 // loop counter
  let x:number = width/2
  let y:number = height/2
  let toggle:boolean = true

  p.draw = () => {
    p.ambientLight(40, 40, 40)
    p.pointLight(255, 255, 255, t%width, t%height, 250)
    // https://editor.p5js.org/p5/sketches/3D:_sine_cosine_in_3D
    p.background(250)
    p.rotateY(p.frameCount * 0.01)
    p.noStroke()

    for (let j = 0; j < 5; j++) {
      p.push()
      for (let i = 0; i < 80; i++) {
        p.translate(
          Math.sin(p.frameCount * 0.001 + j) * 100,
          Math.sin(p.frameCount * 0.001 + j) * 100,
          i * 0.1
        )
        p.rotateZ(p.frameCount * 0.002)
        p.push()
        p.specularMaterial(250)
        p.shininess(20)
        p.sphere(t, 24, 24)
        p.pop()
      }
      p.pop()
    }

    if (t > 200) {
      toggle = false
    }
    if (t < 5) {
      toggle = true
    }
    if (toggle == false) {
      t-=1
    } else {
      t+=1 // counter
    }

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
