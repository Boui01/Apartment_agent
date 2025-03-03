/*
    Combine two array or object and return new array or object is all value at 1 array or object
    Mode 
    1 === Array
    2 === Object
    3 === Object in Array
*/
function MixMap( Data,Data2,Mode){

    if(Mode === 1){
        const map = [Data,Data2]
        const result = []
        for(let i=0;i < map.length;i++){
            for(let j=0;j < map[i].length;j++){
                result.push(map[i][j])
            }
        }

        return result
    }
    else if(Mode === 2){
        const result = [Data].reduce((acc, obj1, index) => {
            acc.push({ ...obj1 , ...[Data2][index] });
            return acc;
        }, []);
        return result
    }
    else if(Mode === 3){
        const result = Data.reduce((acc, obj1, index) => {
            acc.push({ ...obj1 , ...Data2[index] });
            return acc;
        }, []);

        return  result

    }
}

export default MixMap