/*
    Detect data date last new or out new in day such as 1/1/2567 to new and 30/12/2566 to out new count out new at limit_day
    Mode ค่า
    1 == โหมด Old
    2 == โหมด New
*/
function DetectNew ( Time , Mode ,limit_day ){
    const time = new Date(Time);
    const today = new Date();
    const limit_new = limit_day 
    if( Mode === 1){
        if( (time.getFullYear() === today.getFullYear() && (time.getMonth() === today.getMonth()) && (time.getDate() <= today.getDate()-limit_new) )|| 
            (time.getFullYear() === today.getFullYear() &&  time.getMonth() !== today.getMonth()) ||       
            (time.getFullYear() !== today.getFullYear())
        )
        {
            return true;
        }
        else{
            return false;
        }
    }
    else if ( Mode === 2){
        if(  (time.getFullYear() === today.getFullYear()) &&
             (time.getMonth() === today.getMonth())  &&
             (time.getDate() > today.getDate()-limit_new )
        ){
            return true;
        }
        else{
            return false;
        }

    }


}

export default DetectNew;