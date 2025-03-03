/*Detect rule is if else version increase easy and short such as  1 === 1 or 1 !== 1 to true or false or at you set output */
/*Condition 
    = === equal  
    ! !== not equal
    > > greater
    < < less

    **** warn *** 
    if you not set condition is defult is equal and
    if you not setcorrect is true and wrong is false
*/
function DetectRule( Data , Rule , Correct , Wrong , Condition){
    if(Array.isArray(Data)){
        const correct_map = Correct ? Correct : true
        const wrong_map = Wrong ? Wrong : false
        
        const result = Data.map( (item) =>
             (
                Condition === '=' ?
                    (item === Rule ? correct_map : wrong_map)
                : Condition === '!' ?
                    (item !== Rule ? correct_map : wrong_map)
                : Condition === '>' ?
                    (item > Rule ? correct_map : wrong_map)
                : Condition === '<' ?
                    (item < Rule ? correct_map : wrong_map)
                : 
                    (item === Rule ? correct_map : wrong_map)
            )
        )
      return result.includes(true) ? Correct : Wrong;

    }
    else if(typeof(Data) === "object"){
        const data = Object.values(Data);
        
        for( let i=0; i < data.length ; i++){
            if(Condition === '='){
                if(data[i]  === Rule){
                    return Correct
                }
            }
            else if(Condition === '!' ){
                if(data[i]  !== Rule){
                    return Correct
                }
            }
            else if(Condition === '>' ){
                if(data[i]  > Rule){
                    return Correct
                }
            }
            else if(Condition === '<' ){
                if(data[i]  < Rule){
                    return Correct
                }
            }
            else{
                if(data[i]  === Rule){
                    return Correct
                }
            }

        } 
        return Wrong

    }
    else{
        if(Condition === '='){
            if( Data === Rule){
                return Correct ? Correct : true;
            }
        }
        else if(Condition === '!'){
            if( Data !== Rule){
                return Correct ? Correct : true;
            }
        }
        else if(Condition === '>'){
            if( Data > Rule){
                return Correct ? Correct : true;
            }
        }
        else if(Condition === '<'){
            if( Data < Rule){
                return Correct ? Correct : true;
            }
        }
        else{
            if( Data === Rule){
                return Correct ? Correct : true;
            }
        }
        return Wrong
    }
}

export default DetectRule