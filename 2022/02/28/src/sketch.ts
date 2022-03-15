import p5 from 'p5'

/**
 * @param {p5} p
 */
export const sketch = (p: p5) => {
  let width = 500
  let height = 200

  p.setup = () => {
    // Define your initial environment props & other stuff here
    p.createCanvas( width, height )
    p.background( 0 )
    p.frameRate( 30 )
  }

  p.draw = () => {
    p.clear()
    p.background( 0 )
    // Define render logic for your sketch here
    let diameter = 2
    let iterations = 8
    let points = []
    for ( let i = 0; i < iterations; i++ ) {
      points.push( { "x": ( Math.random()*Math.PI*i*iterations ), "y": ( Math.random()*Math.PI*i*iterations ) } )
    }
    console.log( points )
    p.stroke( 255 )
    let last = [{ "x":"", "y":"" }]
    points.forEach( ( point, i ) => {
      p.circle( point["x"], point["y"], diameter )
      if ( i != 0 && ( last["x"] != point["x"] || last["y"] != point["y"] ) ) {
        p.line( last["x"], last["y"], point["x"], point["y"] )
        last["x"] = point["x"]
        last["y"] = point["y"]
      } else {
        last["x"] = point["x"]
        last["y"] = point["y"]
      }
    } )
  }

  p.keyPressed = () => {
    // Export sketch's canvas to file when pressing "p"
    if ( p.keyCode === 80 ) {
      p.saveCanvas('sketch', 'png')
    }
  }
}
