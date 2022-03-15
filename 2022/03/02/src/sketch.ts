import p5 from 'p5'

/**
 * @param {p5} p
 */


function arrayChunks(arr: Array<object>, size: number) {
  var myArray = [];
  for(var i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i+size));
  }
  return myArray;
}

export const sketch = ( p: p5 ) => {
  // Define render logic for your sketch here
  let easeSmoothness: number = 20
  let numberOfPoints: number = 12
  let diameter: number = 1
  let framerate: number = 5


  let tweenSet: Array<Array<object>> = []
  let points: Array<object> = []
  let prevPoints: Array<object> = []

  const getPointsQueue = () => {
    tweenSet = []

    // Create a set of points (roughly a polyline from the upper-left corner)
    if ( prevPoints.length == numberOfPoints ) { // Previous set of points exist
      prevPoints = points // So set it equal
    }

    points = [] // then empty last existing points
    for ( let i = 0; i < numberOfPoints; i++ ) { // Number of new points
      let x = Math.round( Math.random()*Math.PI*i*numberOfPoints ) // X value
      let y = Math.round( Math.random()*Math.PI*i*numberOfPoints ) // Y value
      points.push( { "x": x, "y": y } ) // Push results to points array
      if ( prevPoints.length < numberOfPoints ) {
        prevPoints.push( { "x": x, "y": y } ) // If prevPoints is empty, push it the same values initially
      }
    }

    /* At this point,
     * we should have an array
     * that is <numberOfPoints>
     * long. */

    //console.log( "PREVIOUS POINTS" )
    //console.log( prevPoints )

    tweenSet.push( prevPoints )

    let tweenValues = []
    prevPoints.forEach( ( point: object, index: number ) => { // Now with our set of "previous" points...
      let prevPointX = point["x"] // Set tween X equal to current point in loop iteration
      let prevPointY = point["y"] // Set tween Y equal to current point in loop iteration

      // Difference between X in new set of points and prev X
      let deltaX = ( points[index]["x"] > prevPointX ) ? points[index]["x"] - prevPointX : prevPointX - points[index]["x"]
      let biggerX = ( points[index]["x"] > prevPointX ) ? 1 : 2
      // Difference between Y in new set of points and prev Y
      let deltaY = ( points[index]["y"] > prevPointY ) ? points[index]["y"] - prevPointY : prevPointY - points[index]["y"]
      let biggerY = ( points[index]["y"] > prevPointY ) ? 1 : 2

      let tweenX = Math.round( ( deltaX / easeSmoothness )*10 )/10
      let tweenY = Math.round( ( deltaY / easeSmoothness )*10 )/10

      //console.log( prevPointX, points[index]["x"], deltaX, tweenX )
      //console.log( prevPointY, points[index]["y"], deltaY, tweenY )

      for ( let x = 0; x < easeSmoothness; x++ ) {
        if ( biggerX == 1 && biggerY == 1 ) {
          tweenValues.push( { "x": prevPointX + ( tweenX * x ), "y": prevPointY + ( tweenY * x ) } )
        }
        if ( biggerX == 1 && biggerY == 2 ) {
          tweenValues.push( { "x": prevPointX + ( tweenX * x ), "y": prevPointY - ( tweenY * x ) } )
        }
        if ( biggerX == 2 && biggerY == 1 ) {
          tweenValues.push( { "x": prevPointX - ( tweenX * x ), "y": prevPointY + ( tweenY * x ) } )
        }
        if ( biggerX == 2 && biggerY == 2 ) {
          tweenValues.push( { "x": prevPointX - ( tweenX * x ), "y": prevPointY - ( tweenY * x ) } )
        }
      }

      //console.log( "TWEEN VALUES" )
      //console.log( tweenValues )
    } )

    tweenValues = arrayChunks( tweenValues, numberOfPoints )
    tweenSet = tweenValues[0].map( ( _: number, colIndex: number ) => tweenValues.map( row => row[colIndex] ) );

    tweenSet.push( points )

    //console.log( "POINTS" )
    //console.log( points )

    //console.log( "TWEEN SET" )
    //console.log( tweenSet )

  }

  const width: number = 400
  const height: number = 400

  p.setup = () => {
    // Define your initial environment props & other stuff here
    p.createCanvas( width, height )
    p.background( 0 )
    p.stroke( 255 )
    p.frameRate( framerate )
  }

  p.draw = () => {
    getPointsQueue()
    p.strokeWeight( 1 )
    p.background( 0 )
    tweenSet.forEach( ( set, i ) => {
      p.noFill()
      p.beginShape()
      p.stroke( 255 - (i*10) )
      set.forEach( ( point ) => {
        p.vertex( point["x"], point["y"] )
        p.circle( point["x"], point["y"], diameter )
      } )
      p.endShape()
    } )
  }

  p.keyPressed = () => {
    // Export sketch's canvas to file when pressing "p"
    if ( p.keyCode === 80 ) {
      p.saveCanvas('sketch', 'png')
    }
  }
}
