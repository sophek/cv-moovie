const filters = [
    { id: 1, start: 5, end: 8, type: "MUTE" },
    { id: 2, start: 10, end: 15, type: "BLUR" },
    { id: 3, start: 18, end: 20, type: "SKIP" },
  ];

  //Find nearest value of array 
  const inBetween = (x, min, max) => {
    // This checks if a number is between two numbers
    return x >= min && x <= max;
  };

const findNearest = (curr) => {
    return filters.filter(i=>{
        console.log(inBetween(curr,i.start,i.end))
        if(inBetween(curr,i.start,i.end)){
            return i
        }
    })
}

console.log(findNearest(7))