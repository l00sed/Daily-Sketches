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
    fps: <number> framerate,
    filename: <string> 'sketch.mp4',
    codec: <string> 'video/webm; codecs=H264', // use h.264 codec
    videoBitsPerSecond: <number> 5000000, // sets 5Mb bitrate
  }

  let recorder:Recorder
  let recording = false

  /* =====================================
   * P5.js - Setup
   * ===================================== */

  // Setup sketch parameters
  const width:number = 150
  const height:number = 150

  let canvas:CanvasElement
  let context // Leave for use with gradients

  let osc0:p5.Oscillator
  let osc1:p5.Oscillator
  let osc2:p5.Oscillator
  let osc3:p5.Oscillator
  let osc4:p5.Oscillator
  let osc5:p5.Oscillator

  p.setup = () => {
    // Define your initial environment props & other stuff here
    p.createCanvas(width, height) // Define canvas element
    p.frameRate(framerate) // Use recording framerate
    context = (p as any).drawingContext // Leave to disable eslint warning by setting "p as any"

    p.stroke(0)
    p.fill(0)
    p.background(255)
    osc0 = new p5.Oscillator( 163.5, 'sine')
    osc1 = new p5.Oscillator( 206.0, 'sine')
    osc2 = new p5.Oscillator( 275.0, 'sine')
    osc3 = new p5.Oscillator( (163.5/2), 'sine')
    osc4 = new p5.Oscillator( (206.0/2), 'sine')
    osc5 = new p5.Oscillator( (275.0/2), 'triangle')
    osc0.start()
    osc1.start()
    osc2.start()
    osc3.start()
    osc4.start()
    osc5.start()
  }

  /* ===========================================
   * p5.js - Drawing
   * =========================================== */

  let t:number = 0 // loop counter
  let diameter:number = 1
  let toggle:boolean = true

  p.draw = () => {
    // Define render logic for your sketch here
    let tx0 = (t%width)
    let ty0 = height*Math.cos(t*0.01)
    let tx1 = ((t+width/2)%width)
    let ty1 = height*Math.cos(t*0.01)

    p.ellipse(tx0,ty0,diameter)
    p.ellipse(tx1,ty1,diameter)

    if (tx0 < 0) {
      toggle=false
    }

    let random = Math.random()

    if (random > 0.9) {
      osc0.freq(291.4)
      osc1.freq(218.3)
      osc2.freq(ty0)
      osc3.freq((291.4/2))
      osc4.freq((218.3/2))
      osc5.freq((173.2/2))
      p.fill(255,0,0)
      p.stroke(255,0,0)
    }

    if (random < 0.1) {
      osc0.freq(63.5)
      osc1.freq(106.0)
      osc2.freq(175.0)
      osc3.freq((63.5/2))
      osc4.freq((106.0/2))
      osc5.freq((175.0/2))
      p.fill(0,0,255)
      p.stroke(0,0,255)
    }


    if (tx0 > width/2) {
      p.fill(255)
      p.stroke(255)
      osc0.freq(163.5)
      osc1.freq(206.0)
      osc2.freq(275.0)
      osc3.freq((163.5/2))
      osc4.freq((206.0/2))
      osc5.freq((275.0/2))
      toggle=true
    }

    osc0.amp((t/2000)%1+0.3)
    osc1.amp((t/3000)%1+0.3)
    osc2.amp((t/1000)%1+0.3)
    osc3.amp((t/2000)%1+0.3)
    osc4.amp((t/3000)%1+0.3)
    osc5.amp((t/1000)%1+0.3)

    if (toggle == true) {
      t+=1 // counter
    } else {
      t-=1
    }
  }

  /*
   * Note	    | Frequency (Hz)
   * -------------------------
   * C0	      | 16.35
   * C#0/Db0  | 17.32
   * D0       | 18.35
   * D#0/Eb0  | 19.45
   * E0	      | 20.60
   * F0       | 21.83
   * F#0/Gb0  | 23.12
   * G0	      | 24.50
   * G#0/Ab0  | 25.96
   * A0       | 27.50
   * A#0/Bb0  | 29.14
   * B0	      | 30.87                                                                                                                                                                            7902.13	4.37
   * -------------------------------------------
   * https://pages.mtu.edu/~suits/notefreqs.html
   * ------------------------------------------- */
  p.mouseClicked = () => {
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
