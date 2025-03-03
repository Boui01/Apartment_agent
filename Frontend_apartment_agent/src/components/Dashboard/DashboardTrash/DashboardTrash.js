import axios from "axios";
import {  useState,useEffect } from "react";
import { Modal, Button, Form } from 'react-bootstrap'
import DetectNew from "../../../Function/DetectNew";
import './DashboardTrash.css'
import ProgressChart from "../DashboardHome/ProgressChart/ProgressChart";
import DatacreateChart from "../DatacreateChart/DatacreateChart";

function DashboardTrash( {outTrash ,setLogin , setLanguage}) {
    const [trash , setTrash] = useState([])
    const [service , setService ] = useState([])
    const [active , setActive] = useState(null);
    const [value , setValue] = useState([]);
    const [popup , setPopup] = useState(false);
    const [status , setStatus] = useState(false);
    const [data_chart , setData_chart] = useState([])
    const Login = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : setLogin
    const today = new Date()
    const rate_percentage_day = 10;
    const rate_percentage_month = 100;
    const rate_percentage_year = 1000;
    const percentage_day = (trash.filter( (item) => (new Date(item.deleted_at).getDate() === today.getDate())).length * 100) / rate_percentage_day;
    const percentage_month = (trash.filter( (item) => ( new Date(item.deleted_at).getMonth() === today.getMonth())).length * 100) / rate_percentage_month;
    const percentage_year = (trash.filter( (item) => (new Date(item.deleted_at).getFullYear() === today.getFullYear())).length * 100) / rate_percentage_year;
    const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : ''

    ///// API //////
  useEffect(() => {
    const fetchData = async () => {
      try {
          const response = await axios.get('http://127.0.0.1:8000/api/apartment/trash',{ 
            params: { status_user: Login.status }, // Use 'params' for query parameters
            headers: {
              Authorization: `Bearer ${token}`,
            }
          } 
        );
          if(response.data[404] || response.data[422]){
            console.log('Error Data Trash : ',response.data);
            setTrash([]);
            setService([]);
          } 
          else{
            console.log('Data Trash :', response.data); 
            setTrash(response.data.data);
            setService(response.data.services);
            setData_chart(DatacreateChart(response.data.data,'deleted_at' , setLanguage = setLanguage));

            // set active table
            if(status === true){
              setActive((previous) => {
                const filter = previous.find(item => response.data.data.find(item2 => item === item2.id_apartment))// check value previous equal new data sent
                const list = filter === undefined ? [] : [filter] // set new value at still data already
                setValue(response.data.data.filter(check => list.find(check2 => check.id_apartment === check2))) // set for save value has already in list
                return list;
              })
              setStatus(false) // update status to true to fetch data again after status change
            }
          }
      }
      catch (error) {
        console.error('There was an error!', error);

      }
    }
    fetchData();
  }, [status]);


  const handleActive = (item) => {
    setActive( (previous) => {
        const filter = previous ? previous.includes(item.id_apartment) :false;// check id same
        const filter_out = previous ? previous.find(id => id !== item.id_apartment) : undefined; // remove id same
        const newlist = filter ? filter_out === undefined ? [] : [filter_out] : previous ? [ ...previous,item.id_apartment] : [item.id_apartment];
        setValue(trash.filter(check => newlist.find(check2 => check.id_apartment === check2)))
        newlist.sort()
        return newlist;

    })
    console.log('Item :', value);
  }

  const handleConfirm = () => {
    setPopup(true)
  }
    return(
        <>
          <div style={{marginTop : '55px'}}>
            <div>
              <nav className="navbar navbar-dark bg-dark fixed-top">
                <div className="container-fluid custom-navbar-dashboard-trash">
                  <button className="btn btn-outline-light" onClick={() =>  outTrash()}>{ setLanguage === "TH" ? "กลับ" : "Back"}</button>
                  <div className="row">
                    <p>{ setLanguage === "TH" ? "ทั้งหมด" : "Total"} : {trash.length}</p>
                    <p>{ setLanguage === "TH" ? "ใหม่" : "New"}: {trash.filter(item => DetectNew(item.deleted_at , 2 , 1)).length}</p>
                  </div>
                </div>
              </nav>
            </div>
            <div className="custom-head-text-dashboard-trash">
              <h3 >{ setLanguage === "TH" ? "ข้อมูลรวม ที่ถูกลบ" : "Dashboard Trash"}</h3>
            </div>
          </div>
          <ProgressChart data={data_chart} percentage_day={percentage_day} percentage_month={percentage_month} percentage_year={ percentage_year } title={ setLanguage === "TH" ? "ข้อมูลรวมที่ถูกลบ" : "Trash"} setLanguage={setLanguage}/>
          <table className="table table-problem-dashboard">
            <thead className="table-dark">
              <tr>
                <th scope="col">{ setLanguage === 'TH' ? 'ลำดับ' : 'ID Apartment'}</th>
                <th scope="col">{ setLanguage === 'TH' ? 'ชื่อ' : 'Name'}</th>
                <th scope="col">{ setLanguage === 'TH' ? 'บริการ' : 'Service'}</th>
                <th scope="col">{ setLanguage === 'TH' ? 'ราคา' : 'Price'}</th>
                <th scope="col">{ setLanguage === 'TH' ? 'รายละเอียด' : 'Other'}</th>
              </tr>
            </thead>
            <tbody>
              {trash.length > 0?
                <>
                  { trash.map((item,index) =>(
                        DetectNew(item.deleted_at , 2 , 1)?
                          <tr className={`table${active ? active.find(id => id === item.id_apartment) ? '-active' : '-warning' :'-warning'}`} key={index} onClick={() => handleActive(item)} >
                              <td>{active ? active.find(id => id === item.id_apartment) ?
                                  '':                                   
                                  <b style={{color : "#ff9900"}}>{ setLanguage === 'TH' ? 'ใหม่' : 'New'} </b>:
                                  <b style={{color : "#ff9900"}}>{ setLanguage === 'TH' ? 'ใหม่' : 'New'} </b> 
                                  }
                                  {item.id_apartment}
                              </td>
                              <td>{ setLanguage === 'TH' ? item.thai_name : item.name}</td>  
                              <td width={"300px"}>{service.filter( s => s.apartment_id === item.id_apartment).map( s =>  s.services.name + ' | ')}</td>
                              <td>{item.price}</td>
                              <td>{ setLanguage === 'TH' ? item.thai_description : item.description}</td>
                          </tr>
                          :<></>
                        ))
                  }
                  { trash.map((item,index) =>(
                        DetectNew(item.deleted_at , 1 , 1)?
                          <tr className={`table${active ? active.find(id => id === item.id_apartment) ? '-active' : '' :''}`} key={index} onClick={() => handleActive(item)} >
                              <td>{item.id_apartment}</td>
                              <td>{ setLanguage === 'TH' ? item.thai_name : item.name}</td>  
                              <td width={"300px"}>{service.filter( s => s.apartment_id === item.id_apartment).map( s => setLanguage === 'TH' ? s.services.thai_name+ ' | ' : s.services.name + ' | ')}</td>
                              <td>{item.price}</td>
                              <td>{ setLanguage === 'TH' ? item.thai_description : item.description}</td>
                          </tr>
                          :<></>
                        ))
                    }
                </>
              :
                <p>{ setLanguage === 'TH' ? 'ไม่พบข้อมูล' : 'No data found'}</p>
              }
            </tbody>
          </table>
            {active !== null ?
                 active.length > 0  ? 
                    <button className="btn btn-success" onClick={() => handleConfirm()}>{ setLanguage === 'TH' ? 'ยืนยัน' : 'Confirm'}</button>  
                :
                    <></>
            :
            <></>
            }
            <PopupDashboardTrash setModal={popup} outModal={() => setPopup(false)} setValue={value} outStatus={() => setStatus(true)} setLogin={setLogin} setLanguage={setLanguage}/>
        </>
    )
}

function PopupDashboardTrash ({ setModal ,  outModal ,setValue , outStatus , setLogin , setLanguage}) {
    const [Restore,setRestore] = useState(false);
    const [Delete,setDelete] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [selected, setSelected] = useState([]);
    const Login = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : setLogin;
    const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : '';

    useEffect(() => {
      const fetchData = async () => {
        if(confirm === true){
          if(Restore === true){
            try {
              const response = await axios.put(`http://127.0.0.1:8000/api/apartment/restore`,{ ids: selected ,status_user : Login.status},{ 
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              } 
            );
              if(response.data[404]){
                alert(response.data);
              }
              else{
                console.log('Data Restore :', response.data); 
                setConfirm(false)
                setSelected([])
                setRestore(false)
                outStatus()
                outModal() 
              }     
            }
            catch (e) {
                console.error('Error:', e);
              }
          }
          else if (Delete === true){
            try {
              const response = await axios.delete(`http://127.0.0.1:8000/api/destroy/apartment`,{data: { ids: selected , ids: selected ,status_user : Login.status} , 
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              } 
            );
              if(response.data[404]){
                alert(response.data);
              }
              else{
                console.log('Data Delete :', response.data); 
                setConfirm(false)
                setSelected([])
                setDelete(false)
                outStatus()
                outModal()
              }     
            }
            catch (e) {
              console.error('Error:', e);
            }
          }

        }              
      }
      fetchData();

    },[confirm, selected, outModal, outStatus,Delete,Restore])

    const handleRestore = () => {
      console.log("Select : " , selected)
      setRestore(true);
    }
    const handleDelete = () => {
      console.log("Select : " , selected)
      setDelete(true);
    }
    const handleAll = () => {
      setSelected(setValue.map(value => value.id_apartment))     
    }
    const handleCancle = () => {
      setRestore(false);
      setDelete(false);
    }
    const handleConfirm = () => {
      setConfirm(true);
    }

    return(
        <Modal show={setModal} onHide={outModal}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                {Restore || Delete ?  
                  <>
                    <h5>{ setLanguage === 'TH' ? 'คุณต้องการ' : 'Are you sure to'} {Restore? setLanguage === 'TH' ? 'กู้คืน':'restore': setLanguage === 'TH' ? 'ลบ' : 'delete'}{ setLanguage === 'TH' ? 'ทั้งหมด' : 'these apartments?'}</h5>
                    <Button className="btn btn-secondary" onClick={handleCancle}>{ setLanguage === 'TH' ? 'ยกเลิก' : 'Cancle'}</Button>
                    <Button className="btn btn-danger" onClick={handleConfirm} style={{marginLeft : 10}}>{ setLanguage === 'TH' ? 'ยืนยัน' : 'Confirm'}</Button>
                  </>
                :
                  <>
                    <Form>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>{ setLanguage === 'TH' ? 'เลือกอาคาร' : 'Select Apartment'}</Form.Label>
                            <Form.Control as="select" multiple onChange={(e) => setSelected([parseInt(e.target.value)])} className="form-control-selected-PopupDashboardTrash">
                              {setValue?
                                setValue.map((item,index) =>(
                                  <option key={index}  value={item.id_apartment} className={` ${selected.includes(item.id_apartment) ? 'active-selected-PopupDashboardTrash' : 'non-active-selected-PopupDashboardTrash'} `}>
                                    {item.id_apartment} - {  setLanguage === 'TH' ? item.thai_name : item.name}
                                  </option>
                                ))
                              :
                                <p>{ setLanguage === 'TH' ? 'ไม่พบข้อมูล' : 'No data found'}</p>
                              }
                            </Form.Control>
                        </Form.Group>
                        <Button className="btn btn-warning"  style={{marginTop : 10} } onClick={handleRestore} disabled={selected.length === 0}>{ setLanguage === 'TH' ? 'กู้คืน' : 'Restore'}</Button>
                        <Button className="btn btn-danger"  style={{marginTop : 10, marginLeft : 10}} onClick={handleDelete} disabled={selected.length === 0}>{ setLanguage === 'TH' ? 'ลบ' : 'Delete'}</Button>
                        <Button className="btn btn-info"  style={{marginTop : 10, marginLeft : 10}} onClick={handleAll} >{ setLanguage === 'TH' ? 'ทั้งหมด' : 'All'}</Button>
                    </Form>
                  </>
                }
            </Modal.Body>

        </Modal>
    )
}

export default DashboardTrash;