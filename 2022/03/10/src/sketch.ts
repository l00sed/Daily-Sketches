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
  const framerate:number = 2400

  // Set MediaRecorder options
  const settings:Object = {
    'fps': <number> framerate,
    'filename': <string> 'sketch.mp4',
    'codec': <string> 'video/webm; codecs=h264', // use h.264 codec
    'videoBitsPerSecond': <number> 5000000, // sets 5Mb bitrate
  }


  let recorder:Recorder
  let recording = false

  let osc:p5.Oscillator
  let canvas:CanvasElement


  /* =====================================
   * P5.js - Setup
   * ===================================== */

  // Setup sketch parameters
  const width:number = 150
  const height:number = 150

  let context // Leave for use with gradients

  let t: number = 0
  let tx0:number = Math.random()+width
  let ty0:number = Math.random()
  let tx1:number = Math.random()+width
  let ty1:number = Math.random()+height*(1/6)
  let tx2:number = Math.random()+width/2
  let ty2:number = Math.random()+height*(1/3)
  let tx3:number = Math.random()+width/2
  let ty3:number = Math.random()+height*(1/2)
  let tx4:number = Math.random()+width/2
  let ty4:number = Math.random()+height*(2/3)
  let tx5:number = Math.random()+width
  let ty5:number = Math.random()+height*(5/6)
  let tx6:number = Math.random()+width
  let ty6:number = Math.random()+height


  p.setup = () => {
    // Define your initial environment props & other stuff here
    p.createCanvas(width, height) // Define canvas element
    p.frameRate(framerate) // Use recording framerate
    context = (p as any).drawingContext // Leave to disable eslint warning by setting "p as any"

    // Define your initial environment props & other stuff here
    p.createCanvas( width, height )
    p.frameRate( framerate )
    p.background( 0 )
    // Leave this for video-recording functionality
    osc = new p5.Oscillator(150, 'sine')
    osc.start()
  }

  /* ===========================================
   * p5.js - Drawing
   * =========================================== */

  let t:number = 0 // loop counter
  let diameter:number = 1
  let toggle:boolean = true

  p.draw = () => {
    // Define render logic for your sketch here
    p.background(next(20,t),0,next(0,t),14)
    p.noFill()
    /*
    p.beginShape()
      p.vertex(tx0, ty0)
      p.vertex(tx1, ty1)
      p.vertex(tx2, ty2)
      p.vertex(tx3, ty3)
      p.vertex(tx4, ty4)
      p.vertex(tx5, ty5)
      p.vertex(tx6, ty6)
    p.endShape()
    */
    p.beginShape()
      p.vertex(tx0, ty0)
      p.bezierVertex(tx1, ty1, tx2, ty2, tx3, ty3)
      p.bezierVertex(tx4, ty4, tx5, ty5, tx6, ty6)
    p.endShape()

    ty1 = next(ty2, t)
    tx2 = next(tx2, t)
    ty2 = next(ty2, t)
    tx3 = next(next(tx3, t), t)
    ty3 = next(next(ty5, t), t)
    tx4 = next(next(next(tx2, t), t), t)
    ty4 = next(next(ty5, t), t)
    tx5 = next(next(tx2, t), t)
    tx6 = next(next(tx5, t), t)
    p.fill(255,0,0)
    p.stroke(255,0,0)
    osc.amp((tx2/100)%1+0.1)
    osc.freq((tx2+10))
    p.circle(tx2,ty3,2)
    p.stroke(255,120)
    t+=0.005*Math.cos(t)
  }

  function next(xory:number, counter:number) {
    if (t<=0.5) {
      xory+=(-5+Math.cos(counter))*Math.sin(counter*100)
    }
    if (t>0.5) {
      xory+=(3+Math.cos(counter))*Math.sin(counter*100)
    }
    return xory
  }

  p.keyPressed = () => {
    /* -----------------------------------------
     * https://keycode.info/
     * ----------------------------------------- */
    if (p.keyCode === 32) {
      // toggle recording true or false
      recording = !recording
      console.log('RECORDING: '+recording.toString())
    }

    // Export sketch's canvas to file when pressing "space"
    // if recording now true, start recording
    if (p.keyCode === 32 && recording) {
      console.log('Video recording started')
      canvas = document.querySelector('canvas')
      recorder = new Recorder(canvas, p, settings)
      recorder.start()
    }
    // if we are already recording, stop the recording
    if (p.keyCode === 32 && !recording) {
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
