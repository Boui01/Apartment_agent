import axios from "axios";
import { useEffect, useState } from "react";
import DetectNew from "../../../../Function/DetectNew";
import PopupDashboardUser from "../PopupDashboardUser/PopupDashboardUser";

function DashboardUser ( { setLogin , setLanguage } ) {
    const [User,setUser] = useState([])
    const [Active,setActive] = useState([])
    const [value , setValue] = useState([]);
    const [popup, setPopup] = useState(false)
    const [status, setStatus] = useState(false)
    const [selected , setSelected] = useState([])
    const Login = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : setLogin
    const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : ''
    const position_edite = [        
        'english_fname',
        'english_lname',
        'address',
        'birthday',
        'age',
        'religion',
        'sex',
        'phone',
        'line_id',
        'id_bank',
        'type',
        'financial_statement',       
        'guarantor_english_fname', 
        'guarantor_english_lname', 
        'guarantor_address',      
        'guarantor_phone',           
        'email',
        'password'
    ] 

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get('http://localhost:8000/api/users/dashboard',{ 
                    params: { status_user: Login.status }, // Use 'params' for query parameters
                    headers: {
                      Authorization: `Bearer ${token}`,
                    }
                  } 
                );
                setUser(response.data.data)
                console.log("User : ",response.data.data)
                if(status === true){
                    setActive((previous) => {
                      const filter = previous.filter(item => item !== selected.find(item2 => item === item2))// check value previous equal new data sent
                      const list = filter.length === 0 ? [] : filter // set new value at still data already
                      setValue(response.data.data.filter(check => check.id_card === list.find(check2 => check.id_card === check2))) // set for save value has already in list
                      return list;
                    })
                    setStatus(false) // update status to true to fetch data again after status change
                }
            }
            catch (err) {
                console.error(err)
            }
        }
        fetchData()
    },[status,selected])

    const handleActive = (item) => {
        setActive( (previous) => {
            const filter = previous ? previous.includes(item) :false;// check id same
            const filter_out = previous ? previous.find(id => id !== item) : undefined; // remove id same
            const newlist = filter ? filter_out === undefined ? [] : [filter_out] : previous ? [ ...previous,item] : [item];
            setValue(User.filter(check => newlist.find(check2 => check.id_card === check2)))
            console.log('Item :', newlist);
            newlist.sort()
            return newlist;
    
        })

      }

    const handleConfirm = () => {
        setPopup(true)
    }

    return(
        <>
           <h2 className="title text-center" style={{marginTop : "60px"}}>{ setLanguage === 'TH' ? 'สมาชิก' : 'User'}</h2>
           <table className="table">
                <thead className="table-dark">
                    <tr>
                    <th scope="col">{ setLanguage === 'TH' ? 'รหัสบัตรประชาชน' : 'ID'}</th>
                    <th scope="col">{ setLanguage === 'TH' ? 'อีเมล' : 'Email'}</th>
                    <th scope="col">{ setLanguage === 'TH' ? 'ชื่ออังกฤษ' : 'English Frist Name'}</th>
                    <th scope="col">{ setLanguage === 'TH' ? 'นามสกุลอังกฤษ' : 'English Last Name'}</th>
                    <th scope="col">{ setLanguage === 'TH' ? 'เข้าสู่ระบบล่าสุด' : 'Last Login'}</th>
                    </tr>
                </thead>
                <tbody>
                    {User.length > 0 ?
                        <>
                            {// new update data
                                User.map( (item,index) => (
                                     DetectNew(item.updated_at , 2 , 1) ? 
                                    <tr className={`table${Active ? Active.find(id => id === item.id_card) ? '-active' : '-warning' :'-warning'}`} key={index} onClick={() => handleActive(item.id_card)}>
                                        <td >
                                            {Active ? Active.find(id => id === item.id_card)?
                                            ''
                                            : 
                                            <b style={{color : "#ff9900"}}>{ setLanguage === 'TH' ?  'ใหม่': 'New'} </b>:
                                            <b style={{color : "#ff9900"}}>{ setLanguage === 'TH' ?  'ใหม่': 'New'} </b> 
                                            }
                                        {item.id_card}
                                        </td>
                                        <td >{item.email}</td>
                                        <td >{item.english_fname}</td>
                                        <td >{item.english_lname}</td>
                                        <td >{new Date(item.last_login).toLocaleDateString()} | {new Date(item.last_login).toLocaleTimeString() }</td>
                                    </tr>
                                    : ''
                                ))
                            }
                            {
                                User.map( ( item,index) =>  (     
                                    DetectNew(item.updated_at , 1 , 1) ?              
                                    <tr className={`table${Active ? Active.find(id => id === item.id_card) ? '-active' : '' :''}`} key={index} onClick={() => handleActive(item.id_card)}>
                                        <td >
                                            {item.id_card}
                                        </td>
                                        <td >{item.email}</td>
                                        <td >{item.english_fname}</td>
                                        <td >{item.english_lname}</td>
                                        <td >{new Date(item.last_login).toLocaleDateString()} | {new Date(item.last_login).toLocaleTimeString() }</td>
                                    </tr>
                                    :''
                                ))
                            }
                        </>
                        :
                        <>
                            <tr>
                                <td>{ setLanguage === 'TH' ? 'ไม่พบข้อมูล' : 'No data found'}</td>
                            </tr>
                        </>
                    }
                </tbody>
            </table>
            {Active !== null ?
                 Active.length > 0  ? 
                    <button className="btn btn-success" onClick={() => handleConfirm()}>{ setLanguage === 'TH' ? 'ยืนยัน' : 'Confirm'}</button>  
                :
                    <></>
            :
            <></>
            }
            <PopupDashboardUser setModal={popup} outModal={() => setPopup(false)} setValue={value} outStatus={() => setStatus(true)}  outSelect={setSelected} setLogin={setLogin} setPosition={position_edite} setLanguage={setLanguage} rule={'user'}/>
        </>
    )
}



export default DashboardUser