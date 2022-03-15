import p5Typed from 'p5'
import p5DOM from 'p5/lib/addons/p5.dom'

/**
 * @param {p5} p
 */

export const sketch = ( p: p5Typed, dom: p5DOM ) => {
  const width: number = 1500
  const height: number = 1500
  const framerate: number = 15
  let t: number = 0
  let diameter: number = 1
  let recording = false
  let recorder
  let chunks = []

  const record = () => {
    chunks.length = 0
    let stream = document.querySelector( 'canvas' ).captureStream( framerate )
    var options = {
      videoBitsPerSecond: 5000000,
      mimeType: 'video/webm; codecs=vp9'
    }
    recorder = new MediaRecorder( stream, options )
    recorder.ondataavailable = e => {
      if ( e.data.size ) {
        chunks.push( e.data )
      }
    }
    recorder.onstop = exportVideo
  }

  const exportVideo = ( e ) => {

    var blob = new Blob( chunks, { 'type' : 'video/webm; codecs=vp9' } )

    // Draw video to screen
    var videoElement = document.createElement( 'video')
    videoElement.setAttribute( "id", Date.now() )
    videoElement.controls = true
    document.body.appendChild( videoElement )
    videoElement.src = window.URL.createObjectURL( blob )

    // Download the video
    var url = URL.createObjectURL( blob )
    var a = document.createElement( 'a' )
    document.body.appendChild( a )
    a.style = 'display: none'
    a.href = url
    a.download = 'sketch.webm'
    a.click()
    window.URL.revokeObjectURL( url )
  }

  p.setup = () => {
    // Define your initial environment props & other stuff here
    p.createCanvas( width, height )
    p.frameRate( framerate )

    // Uncomment this line here
    // and comment the same line in the
    // "draw()" function to prevent Canvas
    // clearing
    p.background( 0 )
    p.stroke( 255, 18 )
    p.smooth()

    // Leave this for video-recording functionality
    record()
  }

  p.draw = () => {
    let points = [
      {
        "x": width*p.noise(t+5),
        "y": width*p.noise(t+100),
      },
      {
        "x": width*p.noise(t+15),
        "y": width*p.noise(t+20),
      },
      {
        "x": width*p.noise(t+25),
        "y": width*p.noise(t+30),
      },
      {
        "x": width*p.noise(t+35),
        "y": width*p.noise(t+40),
      },
      {
        "x": width*p.noise(t+45),
        "y": width*p.noise(t+50),
      },
      {
        "x": width*p.noise(t+55),
        "y": width*p.noise(t+60),
      },
      {
        "x": width*p.noise(t+65),
        "y": width*p.noise(t+70),
      },
      {
        "x": width*p.noise(t+75),
        "y": width*p.noise(t+80),
      },
      {
        "x": width*p.noise(t+85),
        "y": width*p.noise(t+90),
      },
      {
        "x": width*p.noise(t+95),
        "y": width*p.noise(t+100),
      },
    ]

    // Comment these to prevent canvas
    // from clearing, and uncomment in
    // p.setup() function
    //p.background( 0 )
    p.stroke( 0, 45 )
    p.strokeWeight( 5 )
    p.background( 200,200,(t*200)%240, 10)
    p.noFill()

    p.beginShape()
      p.vertex( points[0]["x"], points[0]["y"] )
      p.bezierVertex( points[1]["x"], points[1]["y"], points[2]["x"], points[2]["y"], points[3]["x"], points[3]["y"] )
      p.bezierVertex( points[4]["x"], points[4]["y"], points[5]["x"], points[5]["y"], points[6]["x"], points[6]["y"] )
    p.endShape()

    /*
    p.beginShape()
      p.stroke( 255, 80 )
      p.vertex( points[0]["x"], points[0]["y"] )
      p.vertex( points[1]["x"], points[1]["y"] )
      p.vertex( points[2]["x"], points[2]["y"] )
      p.vertex( points[3]["x"], points[3]["y"] )
      p.vertex( points[4]["x"], points[4]["y"] )
      p.vertex( points[5]["x"], points[5]["y"] )
      p.vertex( points[6]["x"], points[6]["y"] )
    p.endShape()

    p.stroke( 255 )
    p.circle( points[0]["x"], points[0]["y"], diameter )
    p.circle( points[1]["x"], points[1]["y"], diameter )
    p.circle( points[2]["x"], points[2]["y"], diameter )
    p.circle( points[3]["x"], points[3]["y"], diameter )
    p.circle( points[4]["x"], points[4]["y"], diameter )
    p.circle( points[5]["x"], points[5]["y"], diameter )
    p.circle( points[6]["x"], points[6]["y"], diameter )
    */

    t += 0.01

    // clear the background every 500 frames using mod (%) operator
    //if ( p.frameCount % 500 == 0 ) {
    //}

  }

  p.keyPressed = () => {
    // toggle recording true or false
    recording = !recording
    console.log( "RECORDING: " )
    console.log(recording)

    // Export sketch's canvas to file when pressing "r"
    // if recording now true, start recording
    if ( p.keyCode === 82 && recording ) {
      console.log( ".webm recording started" );
      recorder.start();
    }

    // if we are recording, stop recording
    if ( p.keyCode === 82 && !recording) {
      console.log( ".webm recording stopped" );
      recorder.stop();
    }

    // Export sketch's canvas to file when pressing "p"
    if ( p.keyCode === 80 ) {
      console.log( "saving .png" )
      p.saveCanvas( 'sketch', 'png' )
    }
  }
}
