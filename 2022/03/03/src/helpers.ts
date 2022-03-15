export const arrayChunks = ( arr: Array<object>, size: number ) => {
  var myArray = []
  for( var i = 0; i < arr.length; i += size ) {
    myArray.push( arr.slice( i, i+size ) )
  }
  return myArray
}

export const rotateMatrix = ( value: Array<Array<object>> ) => {
  return value[0].map( ( _, colIndex: number ) => value.map( row => row[colIndex] ) );
}

