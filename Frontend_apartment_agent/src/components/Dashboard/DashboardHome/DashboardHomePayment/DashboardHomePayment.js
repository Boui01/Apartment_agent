import { useEffect, useState } from "react";
import DetectNew from "../../../../Function/DetectNew"
import DetectText from "../../../../Function/DetectText"
import axios from "axios"
import PopupdashboardHome from "../PopupdashboardHome/PopupdashboardHome";
import 'react-circular-progressbar/dist/styles.css';
import './DashboardHomePayment.css'
import PopupCustomValue from "../PopupCustomValue/PopupCustomValue";
import ProgressChart from "../ProgressChart/ProgressChart";
import DatacreateChart from "../../DatacreateChart/DatacreateChart";

function DashboardHomePayment ( {setStatus , setLogin , setLanguage}) {
    const [Payment,setPayment] = useState([])
    const [Active,setActive] = useState([])
    const [value , setValue] = useState([]);
    const [popup, setPopup] = useState(false)
    const [StatusPayment , setStatusPayment] = useState(false)
    const [selected , setSelected] = useState([])
    const [customPosition , setCustomPosition] = useState()
    const [customSearch , setCustomSearch] = useState()
    const [viewState , setViewState] = useState('All')
    const [data_chart , setData_chart] = useState([]);
    const list_view = ['All' ,'Status', 'Today' , 'This Month' , 'This Year' , 'Custom']
    const list_view_custom = ['ID User','ID Employee','User Name','Employee Name','Apartment Name','Price']
    const Login = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : setLogin
    const today = new Date()
    const late_percentage_day = 10;
    const late_percentage_month = 100;
    const late_percentage_year = 1000;
    const percentage_day = (Payment.filter( (item) => (new Date(item.created_at).getDate() === today.getDate())).length * 100) / late_percentage_day;
    const percentage_month = (Payment.filter( (item) => (  new Date(item.created_at).getMonth() === today.getMonth())).length  * 100 ) / late_percentage_month;
    const percentage_year = (Payment.filter( (item) => (new Date(item.created_at).getFullYear() === today.getFullYear())).length * 100) / late_percentage_year;
  const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : ''

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get('http://localhost:8000/api/payments',{ 
                  params: { status_user: Login.status }, // Use 'params' for query parameters
                  headers: {
                    Authorization: `Bearer ${token}`,
                  }
                } 
              )
                if(response.data[422] || response.data[404]){
                  console.log('payment-error : ' , response.data)
                }
                else{
                    console.log("payment : ",response.data.data )
                    setPayment(response.data.data)
                    setData_chart( DatacreateChart(response.data.data,'created_at' , setLanguage = setLanguage) )
                    if(StatusPayment === true){
                      setActive((previous) => {
                        const filter = previous.filter(item => item !== selected.find(item2 => item === item2))// check value previous equal new data sent
                        const list = filter.length === 0? [] : filter // set new value at still data already
                        setValue(response.data.data.filter(check => check.id_payment === list.find(check2 => check.id_payment === check2))) // set for save value has already in list
                        return list;
                      })
                      setStatusPayment(false) // update status to true to fetch data again after status change
                    }
                }
                
            }
            catch (err) {
                console.error("payment-error : ",err)
            }
        }
        fetchData()
    },[setStatus,StatusPayment,selected])

    const handleActive = (item) => {
      setActive( (previous) => {
          const filter = previous ? previous.includes(item) :false;// check id same
          const filter_out = previous ? previous.find(id => id !== item) : undefined; // remove id same
          const newlist = filter ? filter_out === undefined ? [] : [filter_out] : previous ? [ ...previous,item] : [item];
          setValue(Payment.filter(check => newlist.find(check2 => check.id_payment === check2)))
          console.log('Item :', newlist);
          newlist.sort()
          return newlist;
  
      })
    }
    const handleSelectAll = () => {
      const list = []

      // Make for have change show data
      Payment.map( item =>                             
      (viewState ===  'Status confirm' ? item.status === 1 : viewState === 'Status waitting' ? item.status === 0 : 
        viewState === 'Today' ? new Date(item.created_at).getDate() === today.getDate() :
        viewState === 'This Month' ? new Date(item.created_at).getMonth() === today.getMonth() :
        viewState === 'This Year' ? new Date(item.created_at).getFullYear() === today.getFullYear()  : 
        ( list_view_custom.includes(viewState) && customSearch && customPosition ) ? 
        ( customPosition.InItem ?
            (customPosition.position === 'name' || customPosition.position === 'english_fname' || customPosition.position === 'english_lname' ) ?
              DetectText(item[customPosition.InItem][customPosition.position] , customSearch ,customSearch.length > 1 ? 2 : 1) 
            :
              item[customPosition.InItem][customPosition.position]  === customSearch   : item[customPosition.position] === customSearch ) : true)
        ?
          item.apartment !== null  && item.user !== null && item.employee !== null?
            list.push(item) : null
        :
          null
      )

      setActive(list.map(item => item.id_payment))
      setValue(list)
      console.log("seleted all : ",list)
    }
    const handleConfirm = () => {
      setPopup(true)
    }

    return(
        <>
          <div style={{marginTop : '3%'}} className="block-main-dashboard-payment">

            <div className="block-title-head-dashboard-payment">
                <h2>{setLanguage === 'TH' ? 'การชำระเงิน' : 'Payment'}</h2>
                <label className=" text-secondary mb-0" >{ setLanguage === 'TH' ? 'ทั้งหมด' : 'Total'} : {Payment.length}</label>
                <label className=" text-secondary" style={{marginLeft : '10px'}} >{ setLanguage === 'TH' ? 'ใหม่' : 'New'} : {Payment.filter( p => DetectNew(p.created_at , 2 , 1)).length}</label>
                <div className="block-list-view-dashboard" >
                  <input type="checkbox" id="checkbox-list-view-dashboard-toggle" className="checkbox-list-view-dashboard" hidden/>
                  <label htmlFor="checkbox-list-view-dashboard-toggle" className="button-list-view-dashboard" >{
                    setLanguage === 'TH' ? 
                      viewState === 'All' ? 'ทั้งหมด' : 
                      viewState === 'Status' ? 'สถานะ' :
                      viewState === 'Status confirm' ? 'สถานะยืนยัน' :
                      viewState === 'Status waitting' ? 'สถานะรอยืนยัน' :
                      viewState === 'Today' ? 'วัน  ' :
                      viewState === 'This Month' ? 'เดือน  ' :
                      viewState === 'This Year' ? 'ปี  ' :
                      viewState === 'Custom' ? 'กำหนดเอง' :
                      viewState === 'ID User' ? 'รหัสผู้ใช้' :
                      viewState === 'ID Employee' ? 'รหัสพนักงาน' :
                      viewState === 'User Name' ? 'ชื่อผู้ใช้' :
                      viewState === 'Employee Name' ? 'ชื่อพนักงาน' :
                      viewState === 'Apartment Name' ? 'ชื่ออพาร์ทเม้นท์' :
                      viewState === 'Price' ? 'ราคา' :
                      ''
                    :
                      viewState
                  }</label>
                  <ul>
                      {list_view.map((item) =>
                        <>
                          { 
                            (viewState === 'Status' || viewState === 'Status confirm' || viewState === 'Status waitting') && item  === 'Status' ?
                            <>
                                <li onClick={() => setViewState('All')}   className={`active`}>
                                  {setLanguage === 'TH' ? 'สถานะ' : 'Status'}
                                </li>
                                <li onClick={() => setViewState('Status confirm')}   className={`custom-list-view-dashboard-child ${viewState === 'Status confirm' ? 'active' : ''}`}>
                                  {setLanguage === 'TH' ? 'สถานะยืนยัน' : 'Status confirm'}
                                </li>
                                <li onClick={() => setViewState('Status waitting')}   className={`custom-list-view-dashboard-child ${viewState === 'Status waitting' ? 'active' : ''}`}>
                                  {setLanguage === 'TH' ? 'สถานะรอการยืนยัน' : 'Status waitting'}
                                </li>
                            </>
                          : ( viewState === 'Custom' || list_view_custom.includes(viewState) ) && item === 'Custom' ?
                            <>
                                <li onClick={() => setViewState('All')}   className={`active`}>
                                  {setLanguage === 'TH' ? 'ตัวเลือก' : 'Custom'}
                                </li>                             
                                { list_view_custom.map((item2 , index2) => (
                                    <li key={index2} onClick={() => setViewState(item2)}   className={`custom-list-view-dashboard-child ${viewState === item2 ? 'active' : ''}`}>
                                      {
                                        setLanguage === 'TH' ? 
                                          item2 === 'ID User' ? 'รหัสผู้ใช้' : 
                                          item2 === 'ID Employee' ? 'รหัสพนักงาน' : 
                                          item2 === 'User Name' ? 'ชื่อผู้ใช้' : 
                                          item2 === 'Employee Name' ? 'ชื่อพนักงาน' : 
                                          item2 === 'Apartment Name' ? 'ชื่ออพาร์ทเม้นท์' : 
                                          item2 === 'Price' ? 'ราคา' : 
                                          item2
                                        : 
                                          item2
                                      }
                                    </li>
                                ))
                                }
                                { customPosition && customSearch ?                              
                                    <li onClick={() => (setViewState('All') , setCustomPosition() , setCustomSearch())}   className={`custom-list-view-dashboard-child`}>
                                      { setLanguage === 'TH' ? 'ยกเลิก' : 'Cancle'}
                                    </li>
                                    :
                                    <></>
                                }
                            </>
                          :
                            <li onClick={() => setViewState(item)} key={item} className={`${viewState === item ? 'active' : ''}`}>
                                {
                                  setLanguage === 'TH' ?
                                    item === 'All' ? 'ทั้งหมด' : 
                                    item === 'Status' ? 'สถานะ' :
                                    item === 'Status confirm' ? 'สถานะยืนยัน' :
                                    item === 'Status waitting' ? 'สถานะรอการยืนยัน' :
                                    item === 'Today' ? 'วัน  ' :
                                    item === 'This Month' ? 'เดือน  ' :
                                    item === 'This Year' ? 'ปี  ' :
                                    item === 'Custom' ? 'ตัวเลือก' :
                                    item === 'ID User' ? 'รหัสผู้ใช้' : 
                                    item === 'ID Employee' ? 'รหัสพนักงาน' : 
                                    item === 'User Name' ? 'ชื่อผู้ใช้' : 
                                    item === 'Employee Name' ? 'ชื่อพนักงาน' : 
                                    item === 'Apartment Name' ? 'ชื่ออพาร์ทเม้นท์' : 
                                    item === 'Price' ? 'ราคา' : 
                                    ''
                                  :
                                    item
                                }
                            </li>
                          }
                        </>
                      )}
                  </ul>
                </div>
            </div>

            <ProgressChart data={data_chart} percentage_day={percentage_day} percentage_month={percentage_month} percentage_year={percentage_year} title={ setLanguage === 'TH' ? 'การชําระเงิน' : 'Payment'} setLanguage={setLanguage}/>
            
            {Payment.length > 0 ? 
              <div className="block-btn-select-all-dashboard">
                <button className="btn btn-outline-warning custom-btn-select-all" onClick={handleSelectAll}>{setLanguage === 'TH' ? 'เลือกทั้งหมด' : 'SELECT ALL'}</button>
              </div> 
            :
              <>
              </>
            }
            
            <table className="table table-payment-dashboard">
                  <thead className="table-head-payment-dashboard">
                      <tr>
                      <th scope="col">{ setLanguage === 'TH' ? 'ลำดับ' : 'ID'}</th>
                      <th scope="col">{ setLanguage === 'TH' ? 'ชื่อผู้ใช้' : 'User-Name'}</th>
                      <th scope="col">{ setLanguage === 'TH' ? 'ชื่อพนักงาน' : 'Employee-Name'}</th>
                      <th scope="col">{ setLanguage === 'TH' ? 'ชื่ออาคาร' : 'Apartment'}</th>
                      <th scope="col">{ setLanguage === 'TH' ? 'สถานะผู้ใช้' : 'Status_user'}</th>
                      <th scope="col">{ setLanguage === 'TH' ? 'สถานะพนักงาน' : 'Status_employee'}</th>
                      <th scope="col">{ setLanguage === 'TH' ? 'ราคา' : 'Price'}</th>
                      </tr>
                  </thead>
                  <tbody className="table-body-payment-dashboard">
                      {Payment.length > 0 ?
                        <>
                          {// new update data
                            Payment.map( (item,index) => (
                              DetectNew(item.updated_at , 2 , 1) &&
                              (viewState ===  'Status confirm' ? item.status === 1 : viewState === 'Status waitting' ? item.status === 0 : 
                                viewState === 'Today' ? new Date(item.created_at).getDate() === today.getDate() :
                                viewState === 'This Month' ? new Date(item.created_at).getMonth() === today.getMonth() :
                                viewState === 'This Year' ? new Date(item.created_at).getFullYear() === today.getFullYear()  : 
                                ( list_view_custom.includes(viewState) && customSearch && customPosition ) ? 
                                ( customPosition.InItem ?
                                   (customPosition.position === 'name' || customPosition.position === 'english_fname' || customPosition.position === 'english_lname' ) ?
                                      DetectText(item[customPosition.InItem][customPosition.position] , customSearch ,customSearch.length > 1 ? 2 : 1) 
                                    :
                                      item[customPosition.InItem][customPosition.position]  === customSearch   : item[customPosition.position] === customSearch )                          
                            
                                : true)
                               ?
                              <tr className={`table${Active ? Active.find(id => id === item.id_payment) ? '-active' : '-warning' : '-warning'} column-body-payment-dashboard `} 
                                key={index} onClick={() => item.user && item.employee  && item.apartment ? handleActive(item.id_payment) : alert( setLanguage === 'TH' ? 'ไม่สามารถคลิกได้ เนื่องจากข้อมูลถูกลบ' :'Can not click this has been deleted.') }>
                                <td >
                                    {Active ? Active.find(id => id === item.id_payment) ?
                                    '':                                   
                                    <b style={{color : "#ff9900"}}>{setLanguage === 'TH' ? 'ใหม่' :  'New'} </b>:
                                    <b style={{color : "#ff9900"}}>{setLanguage === 'TH' ? 'ใหม่' :  'New'} </b> 
                                    }
                                  {item.id_payment}
                                </td>
                                <td >{item.user ? item.user.english_fname+'-'+item.user.english_lname : <p className="text-danger">{setLanguage === 'TH' ? 'ลบ' : 'Delete'}</p>}</td>
                                <td >{item.employee ? item.employee.thai_fname+'-'+item.employee.thai_lname : <p className="text-danger">{setLanguage === 'TH' ? 'ลบ' : 'Delete'}</p>}</td>
                                <td >{item.apartment ? setLanguage === 'TH' ? item.apartment.thai_name : item.apartment.name : <p className="text-danger">{setLanguage === 'TH' ? 'ลบ' : 'Delete'}</p>}</td>
                                <td >{ setLanguage === 'TH' ? item.status_user === 0 ? 'ยังไม่ชำระเงิน' : 'ชำระเงินแล้ว': item.status_user === 0 ? 'Unpaid' : 'Paid'}</td>
                                <td >{ setLanguage === 'TH' ? item.status_employee === 0 ? 'รอยืนยัน' : 'ยืนยัน': item.status_employee === 0 ? 'Waitting' : 'Confirm'}</td>
                                <td >{item.price}</td>
                            </tr>
                            :''
                            ))
                          }
                          {// normal update data
                            Payment.map( (item,index) => (
                              DetectNew(item.updated_at , 1 , 1)&&
                              (viewState ===  'Status confirm' ? item.status === 1 : viewState === 'Status waitting' ? item.status === 0 : 
                                viewState === 'Today' ? new Date(item.created_at).getDate() === today.getDate() :
                                viewState === 'This Month' ? new Date(item.created_at).getMonth() === today.getMonth() :
                                viewState === 'This Year' ? new Date(item.created_at).getFullYear() === today.getFullYear() :
                                ( list_view_custom.includes(viewState) && customSearch && customPosition ) ? 
                                ( customPosition.InItem ?
                                  (customPosition.position === 'name' || customPosition.position === 'english_fname' || customPosition.position === 'english_lname' ) ?
                                    DetectText(item[customPosition.InItem][customPosition.position] , customSearch , customSearch.length > 1 ? 2 : 1) 
                                  :
                                    item[customPosition.InItem][customPosition.position]  === customSearch   : item[customPosition.position] === customSearch ) 
                                : true)
                             ?
                                <tr className={`table${Active ? Active.find(id => id === item.id_payment) ? '-active' : '' : ''} column-body-payment-dashboard `} 
                                  key={index} onClick={() => item.user && item.employee  && item.apartment ? handleActive(item.id_payment) : alert(setLanguage === 'TH' ? 'ไม่สามารถคลิกได้ เนื่องจากข้อมูลถูกลบ' :'Can not click this has been deleted.') }>
                                    <td >{item.id_payment}</td>
                                    <td >{item.user ? item.user.english_fname+'-'+item.user.english_lname : <p className="text-danger">{setLanguage === 'TH' ? 'ลบ' : 'Delete'}</p>}</td>
                                    <td >{item.employee ? item.employee.thai_fname+'-'+item.employee.thai_lname : <p className="text-danger">{setLanguage === 'TH' ? 'ลบ' : 'Delete'}</p>}</td>
                                    <td >{item.apartment ? setLanguage === 'TH' ? item.apartment.thai_name : item.apartment.name : <p className="text-danger">{setLanguage === 'TH' ? 'ลบ' : 'Delete'}</p>}</td>
                                    <td >{ setLanguage === 'TH' ? item.status_user === 0 ? 'ยังไม่ชำระเงิน' : 'ชำระเงินแล้ว': item.status_user === 0 ? 'Unpaid' : 'Paid'}</td>
                                    <td >{ setLanguage === 'TH' ? item.status_employee === 0 ? 'รอยืนยัน' : 'ยืนยัน': item.status_employee === 0 ? 'Waitting' : 'Confirm'}</td>
                                    <td >{item.price}</td>
                                </tr>
                                :''
                            ))
                          }
                          </>
                          :
                          <>
                              <tr>
                                  <td>{setLanguage === 'TH' ? 'ไม่พบข้อมูล' : 'No data found'}</td>
                              </tr>
                          </>
                      }
                  </tbody>
              </table>
              {Active !== null ?
                 Active.length > 0  ? 
                    <button className="btn btn-success  m-2 mb-3" onClick={() => handleConfirm()}>{setLanguage === 'TH' ? 'ยืนยัน' : 'Confirm'}</button>  
                :
                    <></>
            :
            <></>
            }
            </div>
            <PopupdashboardHome setModal={popup} outModal={() => setPopup(false)} setValue={value} outStatus={() => setStatusPayment(true)} setLogin={setLogin} setState={"payment"} outSelect={setSelected} setLanguage={setLanguage}/>
        
            { list_view_custom.includes(viewState) ?
              <PopupCustomValue 
                setModalState={viewState} outModalState={() => setViewState('All')}
                setCustomPosition={ {table : 'payments' , position : viewState} } outCustomPosition={setCustomPosition}
                outCustomValue={setCustomSearch}
                setLanguage={setLanguage}
              />
            :
              <></>
          }
        </>
    )
}

export default DashboardHomePayment