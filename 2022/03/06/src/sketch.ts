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
    // captureStream and MediaRecorder are still part of a working draft
    // will throw type error
    let stream = document.querySelector( 'canvas' ).captureStream( framerate )
    let options = {
      videoBitsPerSecond: 5000000, // sets 5Mb bitrate
      mimeType: 'video/webm; codecs=vp9' // use latest vp9 codec
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
    a.setAttribute( 'style', 'display: none' )
    a.href = url
    a.download = 'sketch.webm'
    a.click()
    window.URL.revokeObjectURL( url )
  }

  const width: number = 1500
  const height: number = 1500
  const framerate: number = 25

  p.setup = () => {
    // Define your initial environment props & other stuff here
    p.createCanvas( width, height )
    p.frameRate( framerate )
    p.angleMode(p.DEGREES)
    p.smooth()

    p.background( 0 )

    // Leave this for video-recording functionality
    record()
  }

  let diameter: number = 300
  let t: number = 0
  let tx: number = (width/2)+(diameter/2)
  let ty: number = (height/2)
  let tx1: number = (width/2)+(diameter*1.1/2)
  let ty1: number = (height/2)
  let tx2: number = (width/2)+(diameter*1.2/2)
  let ty2: number = (height/2)
  let tx3: number = (width/2)+(diameter*1.3/2)
  let ty3: number = (height/2)
  let tx4: number = (width/2)+(diameter*1.4/2)
  let ty4: number = (height/2)

  p.draw = () => {
    let points = [
      {
        "x": tx,
        "y": ty,
      },
      {
        "x": tx1,
        "y": ty1,
      },
      {
        "x": tx2,
        "y": ty2,
      },
      {
        "x": tx3,
        "y": ty3,
      },
      {
        "x": tx4,
        "y": ty4,
      },
    ]

    p.fill( 255, 18 )
    //p.circle( points[0]["x"], points[0]["y"], 3 )
    //p.circle( points[1]["x"], points[1]["y"], 3 )
    p.circle( points[2]["x"], points[2]["y"], 3 )
    //p.circle( points[3]["x"], points[3]["y"], 3 )
    //p.circle( points[3]["x"], points[4]["y"], 3 )
    p.circle( points[4]["x"], points[4]["y"], 3 )

    tx = (width/2)+(diameter/2)*Math.cos(t)
    ty = (height/2)+(diameter/2)*Math.sin(t)
    tx1 = (width/2)+(diameter*1.1/2)*Math.cos(t/2)
    ty1 = (height/2)+(diameter*1.1/2)*Math.sin(t/2)
    tx2 = (width/2)+(diameter*2.2/2)*Math.cos(t/3)
    ty2 = (height/2)+(diameter*2.2/2)*Math.sin(t/3)
    tx3 = (width/2)+(diameter*3.3/2)*Math.cos(t/4)
    ty3 = (height/2)+(diameter*3.3/2)*Math.sin(t/4)
    tx4 = (width/2)+(diameter*4.4/2)*Math.cos(t/5)
    ty4 = (height/2)+(diameter*4.4/2)*Math.sin(t/5)
    t+=0.24

    p.beginShape()
      p.background( 255, 15 )
      p.stroke( 0,80 )
      p.strokeWeight( 8 )
      p.noFill()
      p.vertex( (width/2), (height/2) )
      p.bezierVertex(
                      points[4]["x"], points[4]["y"],
                      points[2]["x"], points[2]["y"],
                      points[3]["x"], points[4]["y"],
                    )
    p.endShape()

    /*
    p.beginShape()
      p.stroke( 155, 40 )
      p.noFill()
      p.strokeWeight( 3 )
      p.vertex( (width/2), (height/2) )
      p.vertex( points[4]["x"], points[4]["y"] )
      p.vertex( points[2]["x"], points[2]["y"] )
      p.vertex( points[3]["x"], points[4]["y"] )
    p.endShape()
    */

    /*
    // Centering lines
    //p.background( 0 )
    p.stroke( 255, 90 )
    p.beginShape()
      p.vertex( (width/2), 0 )
      p.vertex( (width/2), height )
    p.endShape()
    p.beginShape()
      p.vertex( 0, (height/2) )
      p.vertex( width, (height/2) )
    p.endShape()
    // Center circle
    p.stroke( t%2, t%2, t%10, t%80 )
    p.fill( t%2, t%2, t%10, t%80 )
    p.circle( (tx3), (ty3), t%diameter )
    */

  }

  p.keyPressed = () => {
    // toggle recording true or false
    recording = !recording
    console.log( "RECORDING: " )
    console.log(recording)

    // Export sketch's canvas to file when pressing "r"
    // if recording now true, start recording
    if ( p.keyCode === 82 && recording ) {
      console.log( ".mp4 recording started" );
      recorder.start();
    }

    // if we are recording, stop recording
    if ( p.keyCode === 82 && !recording) {
      console.log( ".mp4 recording stopped" );
      recorder.stop();
    }

    // Export sketch's canvas to file when pressing "p"
    if ( p.keyCode === 80 ) {
      console.log( "saving .png" )
      p.saveCanvas( 'sketch', 'png' )
    }
  }
}
