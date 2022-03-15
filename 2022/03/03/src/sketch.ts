import p5 from 'p5'
import { arrayChunks, rotateMatrix } from './helpers'

/**
 * @param {p5} p
 */

export const sketch = ( p: p5 ) => {
  const width: number = 400
  const height: number = 400
  const framerate: number = 10
  let t: number = 0
  let diameter: number = 1

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
    p.strokeWeight( 1 )
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
    p.stroke( 255, 45 )
    p.strokeWeight( 1 )
    p.noFill()

    p.bezier( points[0]["x"],
              points[0]["y"],
              0,
              points[1]["x"],
              points[1]["y"],
              0,
              points[2]["x"],
              points[2]["y"],
              0,
              points[3]["x"],
              points[3]["y"],
              0 )
    /*p.bezier( points[4]["x"],
              points[4]["y"],
              points[5]["x"],
              points[5]["y"],
              points[6]["x"],
              points[6]["y"],
              points[7]["x"],
              points[7]["y"] )*/

    /*p.beginShape()
      p.stroke( 255, 100 )
      p.vertex( points[0]["x"],
                points[0]["y"] )
      p.vertex( points[1]["x"],
                points[1]["y"] )
      p.vertex( points[2]["x"],
                points[2]["y"] )
      p.vertex( points[3]["x"],
                points[3]["y"] )
      p.vertex( points[4]["x"],
                points[4]["y"] )
      p.vertex( points[5]["x"],
                points[5]["y"] )
      p.vertex( points[6]["x"],
                points[6]["y"] )
      p.vertex( points[7]["x"],
                points[7]["y"] )
    p.endShape()*/

    p.stroke( 255 )
    p.circle( points[0]["x"],
              points[0]["y"], diameter )
    p.circle( points[1]["x"],
              points[1]["y"], diameter )
    p.circle( points[2]["x"],
              points[2]["y"], diameter )
    p.circle( points[3]["x"],
              points[3]["y"], diameter )
    p.circle( points[4]["x"],
              points[4]["y"], diameter )
    p.circle( points[5]["x"],
              points[5]["y"], diameter )
    p.circle( points[6]["x"],
              points[6]["y"], diameter )
    p.circle( points[7]["x"],
              points[7]["y"], diameter )

    t += 0.01

    // clear the background every 500 frames using mod (%) operator
    if ( p.frameCount % 500 == 0 ) {
      p.background( 0 )
    }

  }

  p.keyPressed = () => {
    // Export sketch's canvas to file when pressing "p"
    if ( p.keyCode === 80 ) {
      p.saveCanvas('sketch', 'png')
    }
  }
}
