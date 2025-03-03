// Create List number From number Int such as 5 to [1,2,3,4,5] in list

function CreateNumToList( Number , Result , Max , Mode){
    const list = []

    if(Mode === 'auto' || Mode === undefined || Mode === 1){     
        for(let i=0; i < Math.abs(Number) ; i++){
            if(Max !== undefined){
                if(i <= Max-1){ 
                    list.push(Result) 
                }
                else{
                    break
                }
            }
            else{
                list.push(Result);
            }
        }

    }
    else if(Mode === 'Manual' || Mode === 2){
        for(let i=0; i < Math.abs(Number) ; i++){
            if(Max !== undefined){
                if(i <= Max-1){ 
                    list.push(i+1) 
                }
                else{
                    break
                }
            }
            else{
                list.push(i+1);
            }
        }
    }
    return  list
    
}

export default CreateNumToList