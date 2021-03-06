import p5Typed from 'p5'
import p5DOM from 'p5/lib/addons/p5.dom'

/**
 * @param {p5} p
 */

export const sketch = ( p: p5Typed, dom: p5DOM ) => {
  let recording = false
  let recorder
  let chunks = []

  const record = () => {
    chunks.length = 0
    let stream = document.querySelector( 'canvas' ).captureStream( framerate )
    recorder = new MediaRecorder( stream )
    recorder.ondataavailable = e => {
      if ( e.data.size ) {
        chunks.push( e.data )
      }
    }
    recorder.onstop = exportVideo
  }

  const exportVideo = () => {
    var blob = new Blob( chunks, { 'type' : 'video/mp4' } )

    // Draw video to screen
    var videoElement = document.createElement( 'video')
    videoElement.setAttribute( "id", Date.now().toString() )
    videoElement.controls = true
    document.body.appendChild( videoElement )
    videoElement.src = window.URL.createObjectURL( blob )

    // Download the video
    var url = URL.createObjectURL( blob )
    var a = document.createElement( 'a' )
    document.body.appendChild( a )
    a.setAttribute( 'style', 'display: none' )
    a.href = url
    a.download = 'sketch.mp4'
    a.click()
    window.URL.revokeObjectURL( url )
  }

  const width: number = 150
  const height: number = 150
  const framerate: number = 30

  p.setup = () => {
    // Define your initial environment props & other stuff here
    p.createCanvas( width, height )
    p.frameRate( framerate )
    p.angleMode(p.DEGREES)

    p.background( 0 )
    p.strokeWeight( 1 )

    // Leave this for video-recording functionality
    record()
  }

  let diameter: number = 6
  let t: number = 0
  let tx0: number = 0
  let ty0: number = 0
  let tx1: number = 0
  let ty1: number = 0
  let tx2: number = 0
  let ty2: number = 0
  let tx3: number = 0
  let ty3: number = 0
  let tx4: number = 0
  let ty4: number = 0
  let tx5: number = 0
  let ty5: number = 0

  p.draw = () => {
    // Define render logic for your sketch here

    p.background( t%10, t%4, t%55, 10 )
    p.stroke( 255, 35 )
    p.noFill()

    p.beginShape()
      p.vertex( tx0, ty0 )
      p.bezierVertex( tx0, ty0, tx1, ty1, tx2, ty2 )
      p.bezierVertex( tx3, ty3, tx4, ty4, tx5, ty5 )
    p.endShape()

    tx0 = (t%width+(10*Math.sin(t)))
    ty0 = (height*(0/5))
    tx1 = (t%width+(3*Math.sin(t)))
    ty1 = (height*(1/5))
    tx2 = (t%width+(90*Math.cos(t)))
    ty2 = (height*(2/5))
    tx3 = (t%width+(99*Math.sin(t)))
    ty3 = (height*(3/5))
    tx4 = (t%width+(190*Math.cos(t)))
    ty4 = (height*(4/5))
    tx5 = (t%width+(90*Math.cos(t)))
    ty5 = (height*(5/5))

    t+=0.1*p.noise(t)
  }

  p.keyPressed = () => {
    // toggle recording true or false
    recording = !recording
    console.log( "RECORDING: " )
    console.log(recording)

    // Export sketch's canvas to file when pressing "r"
    // if recording now true, start recording
    if ( p.keyCode === 82 && recording ) {
      console.log( ".mp4 recording started" )
      recorder.start()
    }

    // if we are recording, stop recording
    if ( p.keyCode === 82 && !recording) {
      console.log( ".mp4 recording stopped" )
      recorder.stop()
    }

    // Export sketch's canvas to file when pressing "p"
    if ( p.keyCode === 80 ) {
      console.log( "saving .png" )
      p.saveCanvas( 'sketch', 'png' )
    }
  }
}
