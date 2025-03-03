/* 
Detect word or sentent in Text you in put such as "hello world" check "hello" or "lo" output is true
Type
    1 ===  word
    2 ===  sentence
*/
function DetectText (text , detect , type){
    let result = false;

    if(type === 1){
        for(let position = 0; position < text.length ; position++){
            if (text[position] === detect) {
                result = true;
                break;
            }
        }
    }
    else if(type === 2){
        if( text.includes(detect)){
            result = true;
        }
    }

    console.log('get search value : ' , text , detect , result)

    return result
}

export default DetectText