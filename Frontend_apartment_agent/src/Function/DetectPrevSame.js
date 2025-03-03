/*
    Detect previous data same such as test = [id : "1" , id : "2"] this data come in [id : "1"]  and return [id : "2"] / or use Mode Addnew to test = [ id : "2",id : "1" ]
    Mode
    d_l === list and Detroy
    n_l === list and AddNew
    d_ojl === object in list || array and Detroy
    n_ojl === object in list || array and AddNew

*/
function DetectPrevSame( Data , New , Mode ,Specify){
    const prev = [...Data]

    if(Mode === 'destroyL' || Mode === 'd_l' ||  Mode === 1){
        if( Array.isArray(New) ){
            const update = prev.length > 0 ? New.map( n => prev.filter( p => n !== p)) : New

            return update
        }
        else{
            const update = prev.length > 0 ? prev.filter( p => p !== New)  : [New]

            return update
        }
    }
    else if(Mode === 'newL' || Mode === 'n_l' || Mode === 2){

        if( Array.isArray(New) ){
            const check  = prev.filter((p) => New.every((n) => n !== p));
            const update = prev.length > 0 ?  check ? New.map( n => prev.filter( p => n !== p)) : [...prev , ...New] : New

            return update
        }
        else{
            const check  = prev.includes(New)
            const update = prev.length > 0 ? check ? prev.filter( p => p !== New) : [...prev,New]  : [New]

            return update
        }
    }
    else if(Mode === 'destroyOjl' || Mode === 'd_ojl' || Mode === 3 ){
        if( Array.isArray(New) ){
            const updated = prev.filter((p) => New.every((n) => p[Specify] !== n[Specify]));       
            return updated
        }
        else{
            const update = prev.length > 0 ? prev.filter(p => p[Specify] !== New) : New
            return update
        }
    }
    else if(Mode === 'newOjl' || Mode ===  'n_ojl' || Mode === 4){
        if( Array.isArray(New) ){
            const filter = prev.filter((n) => New.every((p) => p[Specify] !== n[Specify]));
            const update = prev.length > 0 ?  [...filter , ...New] : New

            return update
        }
        else{
            const filter = prev.filter(p => p[Specify] !== New) 
            const update = prev.length > 0 ? [...filter , New]: New
            return update
        }
    }
}

export default DetectPrevSame