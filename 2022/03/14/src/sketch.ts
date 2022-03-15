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
    videoBitsPerSecond: <number> 40000000, // sets 2.5Mb bitrate
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
  let osc0:p5.Oscillator
  let osc1:p5.Oscillator

  p.setup = () => {
    // Define your initial environment props & other stuff here
    p.createCanvas(width, height) // Define canvas element
    p.frameRate(framerate) // Use recording framerate
    p.angleMode(p.DEGREES)
    context = (p as any).drawingContext // Leave to disable eslint warning by setting "p as any"
    p.smooth()

    osc0 = new p5.Oscillator( 162, 'sine' )
    osc0.start()
    osc1 = new p5.Oscillator( 162, 'sine' )
    osc1.start()

  }

  /* ===========================================
   * p5.js - Drawing
   * =========================================== */

  let t:number = 0 // loop counter
  let osc_freqs:Array<number> = [
    80,
    160,
    160,
    200,
    100,
    180,
    240,
    160,
    180,
    240
  ]

  function tune(t, osc) {
    osc.freq((osc_freqs[Math.round(t*10)])*Math.cos(t))
  }

  function tone(t, osc) {
    osc.freq((Math.random()*t/100)%200)
  }

  p.draw = () => {
    // Define render logic for your sketch here
    tune(t*Math.cos(t), osc0)
    tune(t*Math.sin(t), osc1)
    tune(t*Math.sin(t/2), osc1)
    tune(t*Math.tan(t/4), osc0)
    tune(t*Math.sin(t/8), osc1)

    p.background(200+(55*Math.cos(t/10)),200+(55*Math.cos(t/11)),200+(55*Math.cos(t/12)),10)

    p.translate(width/2,height/3)
    p.rotate(Math.cos(t)*360)
    osc0.amp(Math.cos(t)+0.1)
    osc1.amp(Math.cos(t)+0.1)

    p.scale(Math.cos(t))
    p.beginShape()
      p.noFill()
      p.stroke((osc_freqs[Math.round(t)%8]*Math.cos(t)+100)%25, (osc_freqs[Math.round(t)%8]*Math.cos(t)+100)%25, osc_freqs[Math.round(t)]%25, 250)
      p.strokeWeight(t%20)
      p.vertex(width/2, 0)
      p.bezierVertex( width+(width/2), height*3, (osc_freqs[Math.round(t/100)%8]*10*Math.cos(t/10))%width, (osc_freqs[Math.round(t/200)%8]*10*Math.cos(t))%height*2, osc_freqs[Math.round(t/40)], 100)
    p.endShape()

    p.fill(osc_freqs[Math.round(t)]%255, (osc_freqs[Math.round(t)]*Math.cos(t/4))%255, 200, 150)
    p.stroke(osc_freqs[Math.round(t)]%255,(osc_freqs[Math.round(t)]*Math.cos(t/4))%255, 200, 150)
    p.ellipse(width/2, 0, 2)
    p.ellipse((width)*(1+(Math.random()*-1)),10*Math.random()+-10*Math.random(), t*100%4)

    p.noFill()
    p.beginShape()
      if (Math.cos((t/10)%1) > 0.8) {
        p.fill(osc_freqs[Math.round(t/40)]%255, osc_freqs[Math.round(t/30)]%255, (100*Math.cos(t))%255, 50)
      }
      p.noStroke()
      p.vertex(width/2, 0)
      p.vertex((osc_freqs[Math.round(t/20)%8]*15*Math.cos(t/10))%width,(osc_freqs[Math.round(t/20)%8]*15*Math.cos(t/10))%width)
    p.endShape()
    t+=0.01 // counter
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
