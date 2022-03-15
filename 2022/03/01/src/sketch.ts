import p5 from 'p5'

/**
 * @param {p5} p
 */


export const sketch = ( p: p5 ) => {
  let points: Array<object> = []
  let drawQueue: Array<object> = []
  // Define render logic for your sketch here
  let easeSmoothness: number = 10
  let diameter: number = 3
  let numberOfPoints: number = 15

  const getPointsQueue = () => {
    drawQueue = []

    let prevPoints: Array<object> = points
    let tweenPoints: Array<object> = []
    let tweenSet: Array<Array<object>> = []

    points = []

    for ( let i: number = 0; i < numberOfPoints; i++ ) {
      let x: number = Math.round( Math.random()*Math.PI*i*numberOfPoints )
      let y: number = Math.round( Math.random()*Math.PI*i*numberOfPoints )
      points.push( { "x": ( x ), "y": ( y ) } )
    }

    for ( let j: number = 0; j < easeSmoothness; j++ ) {
      tweenSet.push( points )

      points.forEach( ( point: object, i: number ) => {
        let tweenX: number = 0
        let tweenY: number = 0
        let deltaX: number = point["x"] - ( prevPoints[i] ? prevPoints[i]["x"] ?? 0 : 0 )
        let deltaY: number = point["y"] - ( prevPoints[i] ? prevPoints[i]["y"] ?? 0 : 0 )
        tweenX += point["x"]+( deltaX*(1/easeSmoothness) )
        tweenY += point["y"]+( deltaY*(1/easeSmoothness) )
        tweenPoints.push( { "x": tweenX, "y": tweenY } )
      } )

      tweenSet.push( tweenPoints )
      points = tweenPoints
    }

    //console.log( "TWEEN SET" )
    //console.log( tweenSet )
    //console.log( points )

    let last = [ { "x": "", "y": "" } ]
    let count: number = 0

    tweenSet.forEach( ( setPoints: Array<object> ) => {
      setPoints.forEach( ( point: object, i: number ) => {
        //p.circle( point["x"], point["y"], diameter )
        if ( i != 0 && ( last["x"] != point["x"] || last["y"] != point["y"] ) ) {
          if ( point["x"] != 0 && point["y"] != 0 ) {
            drawQueue[count] = { "lx": last["x"], "ly": last["y"], "px": point["x"], "py": point["y"] }
            count++
            //p.line( last["x"], last["y"], point["x"], point["y"] )
          }
          last["x"] = point["x"]
          last["y"] = point["y"]
        } else {
          last["x"] = point["x"]
          last["y"] = point["y"]
        }
      } )
    } )
  }

  const width: number = 400
  const height: number = 400

  p.setup = () => {
    // Define your initial environment props & other stuff here
    p.createCanvas( width, height )
    p.background( 0 )
    p.stroke( 255 )
    p.frameRate( 60 )
  }

  let lineCount: number = 0

  getPointsQueue()

  p.draw = () => {
    p.stroke( 255 )
    p.strokeWeight( 2 )
    p.background( 0 )
    for ( let i: number = 0; i < numberOfPoints; i++ ) {
      p.line( drawQueue[lineCount]["lx"], drawQueue[lineCount]["ly"], drawQueue[lineCount]["px"], drawQueue[lineCount]["py"] )
      p.circle( drawQueue[lineCount]["px"], drawQueue[lineCount]["py"], diameter )
      lineCount++
    }
  }

  p.keyPressed = () => {
    // Export sketch's canvas to file when pressing "p"
    if ( p.keyCode === 80 ) {
      p.saveCanvas('sketch', 'png')
    }
  }
}
