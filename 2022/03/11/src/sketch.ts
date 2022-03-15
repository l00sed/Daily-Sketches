import p5 from 'p5'
import 'p5/lib/addons/p5.dom'
import 'p5/lib/addons/p5.sound'
import ysFixWebmDuration from 'fix-webm-duration'

/**
 * @param {p5} p
 */

export const sketch = ( p: p5 ) => {
  var mediaRecorder
  var mediaParts
  var startTime
  let stream
  let options = {
    videoBitsPerSecond: 5000000, // sets 5Mb bitrate
    mimeType: 'video/webm; codecs=H264' // use latest vp9 codec
  }


  const startRecording = (stream, options) => {
    mediaParts = []
    mediaRecorder = new MediaRecorder(stream, options)
    mediaRecorder.onstop = function() {
      var duration = Date.now() - startTime
      var buggyBlob = new Blob(mediaParts, { type: 'video/mp4' })
      // v1: callback-style
      ysFixWebmDuration(buggyBlob, duration, function(fixedBlob) {
        displayResult(fixedBlob)
      })
    }
    mediaRecorder.ondataavailable = function(event) {
      var data = event.data;
      if (data && data.size > 0) {
        mediaParts.push(data)
      }
    }
    mediaRecorder.start()
    startTime = Date.now()
  }

  const stopRecording = () => {
    mediaRecorder.stop()
  }

  const displayResult = (blob) => {
    // Draw video to screen
    var videoElement = document.createElement('video')
    videoElement.setAttribute('id', Date.now().toString())
    videoElement.controls = true
    document.body.appendChild(videoElement)
    videoElement.src = window.URL.createObjectURL(blob)

    // Download the video
    var url = URL.createObjectURL(blob)
    var a = document.createElement('a')
    document.body.appendChild(a)
    a.setAttribute('style', 'display:none')
    a.href = url
    a.download = 'sketch.mp4'
    a.click()
    window.URL.revokeObjectURL(url)
  }
  /*
  IMPORTANT
  -----------------------------------
  Once downloaded, if editing software has issues with codecs, try to copy
  .webm to .mp4 using ffmpeg:
  -----------------------------------
  ffmpeg -i sketch.webm --fflags +genpts -r 25 -crf 0 -c:v copy sketch.mp4
  */

  let recording = false
  let recorder
  let chunks = []

  const width:number = 1500
  const height:number = 1500
  const framerate:number = 60
  let canvas

  let context // setup for gradients
  let osc, playing, freq, amp

  p.setup = () => {
    // Define your initial environment props & other stuff here
    p.createCanvas(width, height)
    p.frameRate(framerate)
    p.angleMode( p.DEGREES )
    context = (p as any).drawingContext // disable eslint warning by setting "p as any"

    p.rectMode( p.CENTER )

    // Export sketch's canvas to file when pressing "p"
    let dur = 2000
    let vel = 0.1
    osc = new p5.PolySynth()
    osc.play('G2', vel, 0, dur)
    osc.play('C3', vel, t, dur)
    osc.play('G3', vel, t+1/2, dur)
  }

  let t:number = 0 // loop counter
  let diamond_centers = [
    {
      "x": width/2,
      "y": height/4,
    },
  ]

  p.draw = () => {
    // Define render logic for your sketch here

    // --- Setup background with linear gradient

    let c1 = p.color(255,0,0,100)
    let c2 = p.color(255,100)

    setBackgroundGradient(c1, c2)

    p.strokeWeight(2)
    p.stroke(255)
    for (var x = 0; x < width; x += width/10) {
      for (var y = 0; y < height; y += height/10) {
        p.line(x, 0, x, height)
        p.line(0, y, width, y)
      }
    }

    // --------- Setup rect with linear gradient

    setShapeLinearGradient(
      width/2-200, height/4-200,
      width/2+200, height/4+200,
      p.color(255,0,0,255),
      p.color(0,0,200,255)
    )

    diamond_centers.forEach( (diamond) => {
      p.rotate( 20*Math.sin(t*0.05), p.createVector(width, height, 0) )
      p.rect( diamond["x"], diamond["y"], 400, 400, 40 )
    } )

    // --------- Setup circle with radial gradient

    let oX:number = -30
    let oY:number = -50

    setShapeRadialGradient(
      width/2+oX, height/2+oY, 0,   // use offset to shift gradient
      width/2+oX, height/2+oY, 350, // use offset to shift gradient
      p.color(200,0,100,255),
      p.color(100,0,200,255)
    )

    p.ellipse(t%(width/2), (height/2)*Math.sin((t*0.05)%height), 250, 250)

    setShapeRadialGradient(
      width*(3/4)+oX, height/2+oY, 0,   // use offset to shift gradient
      width*(3/4)+oX, height/2+oY, 350, // use offset to shift gradient
      p.color(200,0,100,255),
      p.color(100,0,200,255)
    )

    p.ellipse(width*Math.cos((t*0.005)%width), (height/2)*Math.sin((t*0.005)%height), 250, 250)

    setShapeRadialGradient(
      width*(3/4)+oX, height/4+oY, 0,   // use offset to shift gradient
      width*(3/4)+oX, height/4+oY, 350, // use offset to shift gradient
      p.color(200,0,100,255),
      p.color(100,0,200,255)
    )

    p.ellipse(width*Math.cos((t*0.01)%width), t%(height/2), 250, 250)

    // --------------- Setup counter
    t+=1 // counter
  }

  function setBackgroundGradient( c1, c2 ) {
    for (let y = 0; y < height; y++) {
      let inter = p.map( y, 0, height, 0, 1)
      let c = p.lerpColor(c1, c2, inter)
      p.stroke(c)
      p.line(0, y, width, y)
    }
  }

  function setShapeLinearGradient( sX, sY, eX, eY, colorS, colorE ) {
    let gradient = context.createLinearGradient( sX, sY, eX, eY )
    gradient.addColorStop( 0, colorS )
    gradient.addColorStop( 1, colorE )

    context.fillStyle = gradient
    context.strokeStyle = gradient
  }

  function setShapeRadialGradient( sX, sY, sR, eX, eY, eR, colorS, colorE ) {
    let gradient = context.createRadialGradient( sX, sY, sR, eX, eY, eR )
    gradient.addColorStop( 0, colorS )
    gradient.addColorStop( 1, colorE )

    context.fillStyle = gradient
    context.strokeStyle = gradient
  }

  p.keyPressed = () => {
    // toggle recording true or false
    recording = !recording
    console.log('RECORDING: ')
    console.log(recording)

    // Export sketch's canvas to file when pressing "r"
    // if recording now true, start recording
    if (p.keyCode === 82 && recording) {
      console.log('.webm recording started')
      canvas = document.querySelector('canvas')
      stream = canvas.captureStream(framerate)
      startRecording(stream, options)
    }

    // if we are recording, stop recording
    if (p.keyCode === 82 && !recording) {
      console.log('.webm recording stopped')
      stopRecording()
    }

  }
}
