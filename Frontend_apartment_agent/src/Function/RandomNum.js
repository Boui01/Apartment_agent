/*Random number follow int you input max and min */
function RandomNum (min,max ){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default RandomNum