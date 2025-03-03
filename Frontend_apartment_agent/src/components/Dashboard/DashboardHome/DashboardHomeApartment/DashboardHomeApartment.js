import { useEffect, useState } from "react";
import DetectNew from "../../../../Function/DetectNew"
import DetectText from "../../../../Function/DetectText"
import axios from "axios"
import PopupdashboardHome from "../PopupdashboardHome/PopupdashboardHome";
import 'react-circular-progressbar/dist/styles.css';
import './DashboardHomeApartment.css'
import PopupCustomValue from "../PopupCustomValue/PopupCustomValue";
import ProgressChart from "../ProgressChart/ProgressChart";
import DatacreateChart from "../../DatacreateChart/DatacreateChart";

function DashboardHomeApartment ( {setStatus , setLogin , setLanguage}) {
    const [apartment,setApartment] = useState([])
    const [service , setService ] = useState([])
    const [Active,setActive] = useState([])
    const [value , setValue] = useState([]);
    const [popup, setPopup] = useState(false)
    const [Statusapartment , setStatusapartment] = useState(false)
    const [selected , setSelected] = useState([])
    const [customPosition , setCustomPosition] = useState()
    const [customSearch , setCustomSearch] = useState()
    const [viewState , setViewState] = useState('All')
    const [data_chart , setData_chart] = useState([])
    const list_view = ['All' ,'Status', 'Today' , 'This Month' , 'This Year' , 'Service' , 'Custom']
    const list_view_custom = ['ID User','User Name' , 'Apartment Name', 'Bedroom', 'Bathroom', 'Total room', 'Score','Pet','Rule', 'Price']
    const [serviceViewState , setServiceViewState] = useState([])
    const Login = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : setLogin
    const today = new Date()
    const late_percentage_day = 10;
    const late_percentage_month = 100;
    const late_percentage_year = 1000;
    const percentage_day = (apartment.filter( (item) => (new Date(item.created_at).getDate() === today.getDate())).length * 100) / late_percentage_day;
    const percentage_month = (apartment.filter( (item) => (  new Date(item.created_at).getMonth() === today.getMonth())).length  * 100 ) / late_percentage_month;
    const percentage_year = (apartment.filter( (item) => (new Date(item.created_at).getFullYear() === today.getFullYear())).length * 100) / late_percentage_year;
    const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : ''

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get('http://localhost:8000/api/apartment/dashboard',{ 
                  params: { status_user: Login.status }, // Use 'params' for query parameters
                  headers: {
                    Authorization: `Bearer ${token}`,
                  }
                } 
              )
                if(response.data[422] || response.data[404]){
                    setApartment([])
                    setService([])
                    setData_chart( DatacreateChart([],'created_at') )
                    console.log('apartment-error : ' , response.data)
                }
                else{
                    console.log("apartment : ",response.data)
                    setApartment(response.data.data)
                    setService(response.data.service)
                    setData_chart( DatacreateChart(response.data.data , 'created_at' , setLanguage = setLanguage) )

                    if(Statusapartment === true){
                      setActive((previous) => {
                        const filter = previous.filter(item => item !== selected.find(item2 => item === item2))// check value previous equal new data sent
                        const list = filter.length === 0? [] : filter // set new value at still data already
                        setValue(response.data.data.filter(check => check.id_apartment === list.find(check2 => check.id_apartment === check2))) // set for save value has already in list
                        return list;
                      })
                      setStatusapartment(false) // update status to true to fetch data again after status change
                    }
                }
                
            }
            catch (err) {
                console.error("apartment-error : ",err)
            }
        }
        fetchData()
    },[setStatus,Statusapartment,selected])

    useEffect(() => {
      const fetchData = async () => {
           try {
              const response = await axios.get('http://localhost:8000/api/services',{ 
                  params: {}, // Use 'params' for query parameters
                  headers: {
                    Authorization: `Bearer ${token}`,
                  }
                } 
              )
              if(response.data[422] || response.data[404]){
                console.log("service_ViewState-error : ",response.data)
              }
              else{
                console.log("service_ViewState : ", response.data.data)
                setServiceViewState(response.data.data.map(ser => setLanguage === "TH" ? ser.thai_name : ser.name))
              }
           }
           catch( e){
            console.error("service_ViewState-error : ",e)
           }
        } 

        fetchData()
    },[])

    const handleActive = (item) => {
      setActive( (previous) => {
          const filter = previous ? previous.includes(item) :false;// check id same
          const filter_out = previous ? previous.find(id => id !== item) : undefined; // remove id same
          const newlist = filter ? filter_out === undefined ? [] : [filter_out] : previous ? [ ...previous,item] : [item];
          setValue(apartment.filter(check => newlist.find(check2 => check.id_apartment === check2)))
          console.log('Item :', newlist);
          newlist.sort()
          return newlist;
  
      })
    }
    const handleSelectAll = () => {
      const list = []

      // Make for have change show data
      apartment.map( item =>                             
      (viewState ===  'Status confirm' ? item.status === 1 : viewState === 'Status waitting' ? item.status === 0 : 
        viewState === 'Today' ? new Date(item.created_at).getDate() === today.getDate() :
        viewState === 'This Month' ? new Date(item.created_at).getMonth() === today.getMonth() :
        viewState === 'This Year' ? new Date(item.created_at).getFullYear() === today.getFullYear()  : 
        serviceViewState.includes(viewState) ? service.filter( s => s.apartment_id === item.id_apartment).map( s => s.services.name).some(name => viewState.includes(name)):
        ( list_view_custom.includes(viewState) && customSearch  || customSearch === 0 && customPosition ) ? 
        ( customPosition.InItem ?
            (customPosition.position === 'name' || customPosition.position === 'english_fname' || customPosition.position === 'english_lname' ) ?
              DetectText(item[customPosition.InItem][customPosition.position] , customSearch ,customSearch.length > 1 ? 2 : 1) 
              :
              customPosition.position === 'name' ? 
                DetectText(item[customPosition.position] , customSearch ,customSearch.length > 1 ? 2 : 1)
            :
              item[customPosition.InItem][customPosition.position]  === customSearch   : item[customPosition.position] === customSearch )                          
    
        : true)
        ?
        list.push(item) : null
      )

      setActive(list.map(item => item.id_apartment))
      setValue(list)
      console.log("seleted all : ",list)
    }
    const handleConfirm = () => {
      setPopup(true)
    }
    console.log('value : ',apartment,customPosition , customSearch)
    return(
        <>
          <div style={{marginTop : '3%'}} className="block-main-dashboard-apartment">

            <div className="block-title-head-dashboard-apartment">
                <h2>{setLanguage === 'TH' ? 'อพาร์ทเม้นท์' : 'Apartment'}</h2>
                <label className=" text-secondary mb-0" >{ setLanguage === 'TH' ? 'ทั้งหมด' : 'Total'} : {apartment.length}</label>
                <label className=" text-secondary" style={{marginLeft : '10px'}} >{ setLanguage === 'TH' ? 'ใหม่' : 'New'} : {apartment.filter( p => DetectNew(p.created_at , 2 , 1)).length}</label>
                <div className="block-list-view-dashboard" >
                  <input type="checkbox" id="checkbox-list-view-dashboard-toggle" className="checkbox-list-view-dashboard" hidden/>
                  <label htmlFor="checkbox-list-view-dashboard-toggle" className="button-list-view-dashboard" >{
                    setLanguage === 'TH' ? 
                      viewState === 'All' ? 'ทั้งหมด' :
                      viewState === 'Status' ? 'สถานะ' :
                      viewState === 'Status confirm' ? 'สถานะยืนยัน' :
                      viewState === 'Status waitting' ? 'สถานะรอการยืนยัน' :
                      viewState === 'Service' ? 'บริการ' :
                      viewState === 'Today' ? 'วันนี้' :
                      viewState === 'This Month' ? 'เดือนนี้' :
                      viewState === 'This Year' ? 'ปีนี้' :
                      viewState === 'Custom' ? 'Custom' :
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
                                  { setLanguage === 'TH' ? 'สถานะ' : 'Status'}
                                </li>
                                <li onClick={() => setViewState('Status confirm')}   className={`custom-list-view-dashboard-child ${viewState === 'Status confirm' ? 'active' : ''}`}>
                                  { setLanguage === 'TH' ? 'สถานะยืนยัน' : 'Status confirm'}
                                </li>
                                <li onClick={() => setViewState('Status waitting')}   className={`custom-list-view-dashboard-child ${viewState === 'Status waitting' ? 'active' : ''}`}>
                                  { setLanguage === 'TH' ? 'สถานะรอการยืนยัน' : 'Status waitting'}
                                </li>
                            </>
                          : ( viewState === 'Service' || serviceViewState.includes(viewState)) && item === 'Service' ? 
                            <>
                                <li onClick={() => setViewState('All')}   className={`active`}>
                                  { setLanguage === 'TH' ? 'บริการ' : 'Service'}
                                </li>
                                { serviceViewState.map((ser , index) => (
                                    <li key={index} onClick={() => setViewState(ser)}   className={`custom-list-view-dashboard-child ${viewState === ser ? 'active' : ''}`}>
                                      { ser }
                                    </li>
                                ))
                                }

                            </>
                          : ( viewState === 'Custom' || list_view_custom.includes(viewState) ) && item === 'Custom' ?
                            <>
                                <li onClick={() => setViewState('All')}   className={`active`}>
                                  { setLanguage === 'TH' ? 'ตัวเลือก' : 'Custom'}
                                </li>                             
                                { list_view_custom.map((item2 , index2) => (
                                    <li key={index2} onClick={() => setViewState(item2)}   className={`custom-list-view-dashboard-child ${viewState === item2 ? 'active' : ''}`}>
                                      {
                                        setLanguage === 'TH' ?
                                          item2 === 'ID User' ? 'รหัสผู้ใช้งาน' :
                                          item2 === 'User Name' ? 'ชื่อผู้ใช้งาน' :
                                          item2 === 'Apartment Name' ? 'ชื่อห้องพัก' :
                                          item2 === 'Bedroom' ? 'ห้องนอน' :
                                          item2 === 'Bathroom' ? 'ห้องน้ำ' :
                                          item2 === 'Total room' ? 'จำนวนห้อง' :
                                          item2 === 'Score' ? 'คะแนน' :
                                          item2 === 'Pet' ? 'สัตว์เลี้ยง' :
                                          item2 === 'Rule' ? 'กฎ' :
                                          item2 === 'Price' ? 'ราคา' :
                                          ''
                                        :
                                        item2
                                      }
                                    </li>
                                ))
                                }
                                { customPosition && customSearch || customSearch === 0 ?                              
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
                                    item === 'Today' ? 'วันนี้' :
                                    item === 'This Month' ? 'เดือนนี้' :
                                    item === 'This Year' ? 'ปีนี้' :
                                    item === 'Service' ? 'บริการ' :
                                    item === 'Custom' ? 'กำหนดเอง' :
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

            <ProgressChart data={data_chart} percentage_day={percentage_day} percentage_month={percentage_month} percentage_year={percentage_year} title={ setLanguage === 'TH' ? 'อพาร์ทเม้นท์' : 'Apartment'} setLanguage={setLanguage}/>
            
            {apartment.length > 0 ? 
              <div className="block-btn-select-all-dashboard">
                <button className="btn btn-outline-warning custom-btn-select-all" onClick={handleSelectAll}>{ setLanguage === 'TH' ? 'เลือกทั้งหมด' : 'SELECT ALL'}</button>
              </div> 
            :
              <>
              </>
            }
            
            <table className="table table-apartment-dashboard">
                  <thead className="table-head-apartment-dashboard">
                      <tr>
                        <th scope="col">{setLanguage === 'TH' ? 'ลำดับ' : 'ID Apartment'}</th>
                        <th scope="col">{setLanguage === 'TH' ? 'ชื่อห้องพัก' : 'Apartment Name'}</th>
                        <th scope="col">{setLanguage === 'TH' ? 'บริการ' : 'Service'}</th>
                        <th scope="col">{setLanguage === 'TH' ? 'ราคา' : 'Price'}</th>
                        <th scope="col">{setLanguage === 'TH' ? 'ห้องนอน' : 'Bedroom'}</th>
                        <th scope="col">{setLanguage === 'TH' ? 'ห้องน้ำ' : 'Bathroom'}</th>
                        <th scope="col">{setLanguage === 'TH' ? 'จำนวนห้อง' : 'Total room'}</th>
                        <th scope="col">{setLanguage === 'TH' ? 'รายละเอียด' : 'Description'}</th>
                        <th scope="col">{setLanguage === 'TH' ? 'สัตว์เลี้ยง' : 'Pet'}</th>
                        <th scope="col">{setLanguage === 'TH' ? 'สถานะ' : 'Status'}</th>
                      </tr>
                  </thead>
                  <tbody className="table-body-apartment-dashboard">
                      {apartment.length > 0 ?
                        <>
                          {// new update data
                            apartment.map( (item,index) => (
                              DetectNew(item.created_at , 2 , 1) &&
                              (viewState ===  'Status confirm' ? item.status === 1 : viewState === 'Status waitting' ? item.status === 0 : 
                                viewState === 'Today' ? new Date(item.created_at).getDate() === today.getDate() :
                                viewState === 'This Month' ? new Date(item.created_at).getMonth() === today.getMonth() :
                                viewState === 'This Year' ? new Date(item.created_at).getFullYear() === today.getFullYear()  : 
                                serviceViewState.includes(viewState) ? service.filter( s => s.apartment_id === item.id_apartment).map( s => setLanguage === 'TH' ? s.services.name_th : s.services.name).some(name => viewState.includes(name)):
                                ( list_view_custom.includes(viewState) && customSearch  || customSearch === 0 && customPosition ) ? 
                                ( customPosition.InItem ?
                                   ( customPosition.position === 'english_fname' || customPosition.position === 'english_lname' ) ?
                                      DetectText(item[customPosition.InItem][customPosition.position] , customSearch ,customSearch.length > 1 ? 2 : 1) :
                                      item[customPosition.InItem][customPosition.position]  === customSearch   
                                    :
                                      customPosition.position === 'name' ? 
                                        DetectText(item[customPosition.position] , customSearch ,customSearch.length > 1 ? 2 : 1)
                                    :
                                      item[customPosition.position] === customSearch )                          
                            
                                : true)
                               ?
                              <tr className={`table${Active ? Active.find(id => id === item.id_apartment) ? '-active' : '-warning' : '-warning'} column-body-apartment-dashboard `} 
                                key={index} onClick={() => item.user && service.map(s => s.apartment_id).includes(item.id_apartment) ? handleActive(item.id_apartment) : alert('Can not click this has been deleted.') }>
                                <td>{Active ? Active.find(id => id === item.id_apartment) ?
                                    '':                                   
                                    <b style={{color : "#ff9900"}}>{ setLanguage === 'TH' ? 'ใหม่' : 'New'} </b>:
                                    <b style={{color : "#ff9900"}}>{ setLanguage === 'TH' ? 'ใหม่' : 'New'} </b> 
                                    }
                                    {item.id_apartment}
                                </td>
                                <td>{ setLanguage === 'TH' ? item.thai_name : item.name}</td>  
                                <td width={"300px"}>{service.filter( s => s.apartment_id === item.id_apartment).map( s => setLanguage === 'TH' ? s.thai_name : s.services.name + ' | ')}</td>
                                <td>{item.price}</td>
                                <td>{item.bedroom}</td>
                                <td>{item.bathroom}</td>
                                <td>{item.total_room}</td>
                                <td>{ setLanguage === 'TH' ? item.thai_description : item.description}</td>
                                <td>{ setLanguage === 'TH' ? item.pet === 1 ? 'อนุญาติ' : 'ไม่อนุญาติ' : item.pet === 1 ? 'Yes' : 'No'}</td>
                                <td>{ setLanguage === 'TH' ? item.status === 1 ? 'ยืนยัน' : 'รอการยืนยัน' : item.status === 1 ? 'Confirm' : 'Waitting'}</td>
                            </tr>
                            :''
                            ))
                          }
                          {// normal update data
                            apartment.map( (item,index) => (
                              DetectNew(item.created_at , 1 , 1) &&
                              (viewState ===  'Status confirm' ? item.status === 1 : viewState === 'Status waitting' ? item.status === 0 : 
                                viewState === 'Today' ? new Date(item.created_at).getDate() === today.getDate() :
                                viewState === 'This Month' ? new Date(item.created_at).getMonth() === today.getMonth() :
                                viewState === 'This Year' ? new Date(item.created_at).getFullYear() === today.getFullYear() :
                                serviceViewState.includes(viewState) ? service.filter( s => s.apartment_id === item.id_apartment).map( s => setLanguage === 'TH' ? s.services.thai_name : s.services.name).some(name => viewState.includes(name)):
                                ( list_view_custom.includes(viewState) && customSearch || customSearch === 0 && customPosition ) ? 
                                ( customPosition.InItem ?
                                  (customPosition.position === 'name' || customPosition.position === 'english_fname' || customPosition.position === 'english_lname' ) ?
                                    DetectText(item[customPosition.InItem][customPosition.position] , customSearch ,customSearch.length > 1 ? 2 : 1) :
                                    item[customPosition.InItem][customPosition.position]  === customSearch   
                                    :
                                    customPosition.position === 'name' || customPosition.position === 'rule'  ? 
                                      DetectText(item[customPosition.position] , customSearch ,customSearch.length > 1 ? 2 : 1)
                                  : 
                                  item[customPosition.position] === customSearch ) 
                                : true)
                             ?
                                <tr className={`table${Active ? Active.find(id => id === item.id_apartment) ? '-active' : '' : ''} column-body-apartment-dashboard `} 
                                  key={index} onClick={() => item.user && service.map(s => s.apartment_id).includes(item.id_apartment) ? handleActive(item.id_apartment) : alert('Can not click this has been deleted.') }>
                                    <td>{item.id_apartment}</td>
                                    <td>{ setLanguage === 'TH' ? item.thai_name : item.name}</td>  
                                    <td width={"300px"}>{service.filter( s => s.apartment_id === item.id_apartment).map( s => setLanguage === 'TH' ? s.thai_name : s.services.name + ' | ')}</td>
                                    <td>{item.price} </td>
                                    <td>{item.bedroom}</td>
                                    <td>{item.bathroom}</td>
                                    <td>{item.total_room}</td>
                                    <td>{ setLanguage === 'TH' ? item.thai_description : item.description}</td>
                                    <td>{ setLanguage === 'TH' ? item.pet === 1 ? 'อนุญาติ' : 'ไม่อนุญาติ' : item.pet === 1 ? 'Yes' : 'No'}</td>
                                    <td>{ setLanguage === 'TH' ? item.status === 1 ? 'ยืนยัน' : 'รอการยืนยัน' : item.status === 1 ? 'Confirm' : 'Waitting'}</td>
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
            <PopupdashboardHome setModal={popup} outModal={() => setPopup(false)} setValue={value} outStatus={() => setStatusapartment(true)} setLogin={setLogin} setState={"apartment"} outSelect={setSelected} setLanguage={setLanguage}/>
        
            { list_view_custom.includes(viewState) ?
              <PopupCustomValue 
                setModalState={viewState} outModalState={() => setViewState('All')}
                setCustomPosition={ {table : 'apartment' , position : viewState} } 
                outCustomPosition={setCustomPosition}
                outCustomValue={setCustomSearch}
                setLanguage={setLanguage}
              />
            :
              <></>
          }
        </>
    )
}

export default DashboardHomeApartment