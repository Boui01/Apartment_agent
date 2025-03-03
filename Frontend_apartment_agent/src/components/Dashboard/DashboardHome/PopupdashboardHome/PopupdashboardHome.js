import axios from "axios"
import { useEffect, useState } from "react"
import { Modal, Button, Form } from 'react-bootstrap'
import './PopupdashboardHome.css'


function PopupdashboardHome({ setModal ,  outModal ,setValue , outStatus , setLogin , setState ,outSelect ,setLanguage}){
    const [Payment,setPayment] = useState(false);
    const [Reservation,setReservation] = useState(false);
    const [Apartment,setApartment] = useState(false);
    const [PaymentStatus,setPaymentStatus] = useState(false)
    const [Problem,setProblem] = useState(false);
    const [DeleteReservation,setDeleteReservation] = useState(false);
    const [DeleteApartment,setDeleteApartment] = useState(false);
    const [DeletePayment,setDeletePayment] = useState(false);
    const [DeleteProblem,setDeleteProblem] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [selected, setSelected] = useState([]);
    const [edite , setEdite] = useState([]);
    const session_Login = sessionStorage.getItem('token')? JSON.parse(sessionStorage.getItem('token')) : setLogin ;
    const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : ''

    useEffect(() => {
      const fetchData = async () => {
        if(confirm === true){
          // reservation
          if(Payment === true){
              try {
                console.log('Data Reservation : ', session_Login,selected);
                const response = await axios.post(`http://127.0.0.1:8000/api/payment/${session_Login.id}`,{ ids : selected , status_user : session_Login.status},{ 
                  headers: {
                    Authorization: `Bearer ${token}`,
                  }
                } 
              )
                if(response.data[404] || response.data[422]){
                  alert(response.data[404] ? response.data[404] : response.data[422]);
                  setPayment(false)
                  setConfirm(false)
                  setSelected([])
                }
                else{
                  console.log('Data Reservation Create :', response.data); 
                  setConfirm(false)
                  outSelect(selected)
                  setSelected([])
                  setPayment(false)
                  outStatus()
                  outModal() 
                }     
              }
              catch (e) {
                  console.error('Error:', e);
                }                             
          }

          else if (Reservation === true){
            try {
              const response = await axios.put(`http://127.0.0.1:8000/api/reservation/${session_Login.id}`,{ ids : selected , status_user : session_Login.status},{ 
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              } 
            )
              if(response.data[404] || response.data[422]){
                alert(response.data[404] ? response.data[404] : response.data[422]);
                setReservation(false)
                setConfirm(false)
                setSelected([])
              }
              else{
                console.log('Data Reservation Upadate :', response.data); 
                setConfirm(false)
                outSelect(selected)
                setSelected([])
                setReservation(false) 
                outStatus()
                outModal()
              } 
            }
            catch (e) {
              console.error('Error:', e);
            }
          }
          // delete reservation
          else if (DeleteReservation === true){
            try {
              const response = await axios.delete(`http://127.0.0.1:8000/api/reservation`,{ data : { ids : selected, status_user : session_Login.status }, 
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              } 
            )
              if(response.data[404] || response.data[422]){
                alert(response.data);
                setConfirm(false)
                setDeleteReservation(false)
              }
              else{
                console.log('Data Delete :', response.data); 
                setConfirm(false)
                outSelect(selected)
                setSelected([])
                setDeleteReservation(false)
                outStatus()
                outModal()
              }     
            }
            catch (e) {
              console.error('Error:', e);
            }
          }

          // apartment
          else if (Apartment === true){
            try {
              const response = await axios.put(`http://127.0.0.1:8000/api/apartment/edite/${session_Login.id}`,{ids : selected , status_user : session_Login.status},{ 
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              } 
            );
              if(response.data[422] || response.data[404]){
                alert(JSON.stringify(response.data));
                setConfirm(false)
                setApartment(false)
              }
              else{
                console.log('Data Apartment :', response.data); 
                setConfirm(false)
                outSelect(selected)
                setSelected([])
                setApartment(false)
                outStatus()
                outModal()
              }
            }
            catch (e) {
              console.error('Error:', e);
            }
          }
          else if (DeleteApartment === true){

            try {
              const response = await axios.delete(`http://127.0.0.1:8000/api/apartment/${session_Login.id}`,{data: { ids: selected , status_user: session_Login.status },
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              }
            );
              if(response.data[422] || response.data[404]){
                alert(JSON.stringify(response.data));
                setConfirm(false)
                setDeleteApartment(false)
              }
              else{
                console.log('Data Delete :', response.data); 
                setConfirm(false)
                outSelect(selected)
                setSelected([])
                setDeleteApartment(false)
                outStatus()
                outModal()
              }
            }
            catch (e) {
              console.error('Error:', e);
            }
          }
          
          // payment
          else if (PaymentStatus === true){
            try {
              const response = await axios.put(`http://127.0.0.1:8000/api/payment/${session_Login.id}`,{ids : selected , status_user : session_Login.status},{ 
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              } 
            );
              if(response.data[422] || response.data[404]){
                alert(JSON.stringify(response.data));
                setConfirm(false)
                setPaymentStatus(false)
              }
              else{
                console.log('Data PaymentStatus :', response.data); 
                setConfirm(false)
                outSelect(selected)
                setSelected([])
                setPaymentStatus(false)
                outStatus()
                outModal()
              }     
            }
            catch (e) {
              console.error('Error:', e);
            }
          }

          // delete payment
          else if(DeletePayment === true){
            try {
              const response = await axios.delete(`http://127.0.0.1:8000/api/payment/${session_Login.id}`,{data : { ids : selected , status_user : session_Login.status } ,
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              } 
            );
              if(response.data[422] || response.data[404]){
                alert(JSON.stringify(response.data));
                setConfirm(false)
                setDeletePayment(false)
              }
              else{
                console.log('Data DeletePayment :', response.data); 
                setConfirm(false)
                outSelect(selected)
                setSelected([])
                setDeletePayment(false)
                outStatus()
                outModal()
              }     
            }
            catch (e) {
              console.error('Error:', e);
            }
          }

          // problem
          else if(Problem === true){
            try {
              const response = await axios.put(`http://127.0.0.1:8000/api/problem/${session_Login.id}`,{  ids: selected , edite : edite  , status_user : session_Login.status},{ 
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              } 
            );
              if(response.data[422] || response.data[404]){
                alert(JSON.stringify(response.data));
                setConfirm(false)
                setProblem(false)
              }
              else{
                console.log('Data EditeProblem :', response.data); 
                setConfirm(false)
                outSelect(selected)
                setSelected([])
                setEdite([])
                setProblem(false)
                outStatus()
                outModal()
              }     
            }
            catch (e) {
              console.error('Error:', e);
            }
          }

          // delete problem
          else if(DeleteProblem === true){
            try {
              const response = await axios.delete(`http://127.0.0.1:8000/api/problem/${session_Login.id}`,{data : {ids: selected}  , status_user : session_Login.status},{ 
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              } 
            );
              if(response.data[422]){
                alert(JSON.stringify(response.data[422]));
                setConfirm(false)
                setDeleteProblem(false)
              }
              else{
                console.log('Data EditeProblem :', response.data); 
                setConfirm(false)
                outSelect(selected)
                setSelected([])
                setEdite([])
                setDeleteProblem(false)
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

    },[confirm, selected, outModal, outStatus,DeletePayment,Payment, Reservation,Apartment ,PaymentStatus, outSelect,session_Login,DeleteReservation,edite,Problem,DeleteProblem])



    const handlePayment = () => {
      console.log("Select : " , selected)
      setPayment(true);
    }
    const handleReservation = () => {
      console.log("Select : " , selected)
      setReservation(true);
    }
    const handleApartment = () => {
      console.log("Select : " , selected)
      setApartment(true);
    }
    const handlePaymentStatus = () => {
      console.log("Select : " , selected)
      setPaymentStatus(true);
    }
    const handleProblem = () => {
      console.log("Select : " , selected)
      setProblem(true);
    }
    const handleDeleteReservation = () => {
      console.log("Select : " , selected)
      setDeleteReservation(true);
    }
    const handleDeleteApartment = () => {
      console.log("Select : " , selected)
      setDeleteApartment(true);
    }
    const handleDeletePayment = () => {
      console.log("Select : " , selected)
      setDeletePayment(true);
    }
    const handleDeleteProblem = (e) => {
      console.log("Select : " , selected)
      setDeleteProblem(true);
    }
    const handleAll = () => {
      setState === "reservation"? setSelected(setValue.map(value => value.id_reservation))  :
      setState === "apartment"? setSelected(setValue.map(value => value.id_apartment)) :
      setState === "payment"? setSelected(setValue.map(value => value.id_payment)) :
      setState === 'problem'? setSelected(setValue.map(value => value.id_problem)) :
      setSelected([])   
    }
    const handleCancle = () => {
      // btn edit
      setReservation(false);
      setPayment(false);
      setApartment(false);
      setPaymentStatus(false);
      setProblem(false);
      // btn del
      setDeleteReservation(false);
      setDeleteApartment(false);
      setDeletePayment(false);
      setDeleteProblem(false);
      setConfirm(false);
    }

    const handleConfirmProblem = (e) => {
      e.preventDefault();
      const list = {
        type : e.target.type.value,
        permission : e.target.permission.value,
        solve : e.target.solve.value
      }
      console.log('check List : ', list )
      setEdite(list)
      setConfirm(true);
    }
    
    const handleConfirm = (e) => {
      setConfirm(true);
    }
    const handleOutModal = () => {
      setSelected([])
      outModal()
    }

    return(
        <Modal show={setModal} onHide={handleOutModal}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
              <>
                {Payment || Reservation || DeleteReservation  || Apartment || DeleteApartment ||PaymentStatus || DeletePayment ||  DeleteProblem?  
                  <>
                    <h5>
                      {setLanguage === 'TH' ? 'คุณต้องการ' : 'Are you sure to '}
                      { 
                        setLanguage === 'TH' ? 
                          Payment?  'สร้างการชําระเงิน?':
                          PaymentStatus  ?'ยืนยันการชำระเงิน':
                          Apartment ? 'ยืนยันอพาร์ตเมนต์':
                          Reservation ? 'ยืนยันการจองห้องเช่า':
                          Problem?'แก้ไขปัญหา':
                          'ลบข้อมูลนี่จริงหรือไม่?'
                        : 
                          Payment?  'create these payments?':
                          PaymentStatus ? 'confirm payment':
                          Apartment ? 'confirm apartment':
                          Reservation ?'confirm rental room':
                          Problem?'edite':
                          'delete this data?'
                        } 
                    </h5>
                    <Button className="btn btn-secondary" onClick={handleCancle}> {setLanguage === 'TH' ? 'ยกเลิก' : 'Cancle'} </Button>
                    <Button className="btn btn-danger" onClick={handleConfirm} style={{marginLeft : 10}}> {setLanguage === 'TH' ? 'ยืนยัน' : 'Confirm'}</Button>
                  </>
                : Problem ?
                  <>
                    <Form onSubmit={handleConfirmProblem}>
                      <Form.Group controlId="exampleForm.ControlSelect1">
                          <Form.Control as={'div'} multiple>
                              <div className="mb-3">
                                <Form.Label>{setLanguage === 'TH' ? 'ประเภทปัญหา' : 'Input type'}</Form.Label>
                                <input type="text" name="type" className="form-control" placeholder={setLanguage === 'TH' ? "ประเภทปัญหา" : "Input type"}  maxLength={255} value={edite.tpye} onChange={(e) => setEdite((prev) => { return prev ? {...prev , tpye : e.target.value} : {tpye : e.target.value} } ) }  required></input>
                              </div>
                              <div className="mb-3">
                                <Form.Label>{setLanguage === 'TH' ? 'สิทธิ์' : 'Input permission'}</Form.Label>
                                <input type="number" name="permission"  className="form-control" placeholder={ setLanguage === 'TH' ? "สิทธิ์" : "Input permission"} min={1} max={10} value={edite.permission}  onChange={(e) => setEdite((prev) => { return prev ? {...prev , permission : e.target.value} : {permission : e.target.value} } ) } required></input>
                              </div>
                              <Form.Label>{setLanguage === 'TH' ? 'แก้ไขปัญหา' : 'Input solve'}</Form.Label>
                              <div className="input-group">
                                <textarea className="form-control" aria-label="With textarea" type="text" name="solve" maxLength={255} value={edite.solve}  onChange={(e) => setEdite((prev) => { return prev ? {...prev , solve : e.target.value} : {solve : e.target.value} } ) }  required></textarea>
                              </div>
                          </Form.Control>
                        </Form.Group>
                        <Button type="submit" className="btn btn-warning"  style={{marginTop : 10} }  disabled={selected.length === 0}>{setLanguage === 'TH' ? 'ยืนยัน' : 'Confirm'}</Button>
                        <Button className="btn btn-danger"  style={{marginTop : 10, marginLeft : 10}} onClick={handleCancle} disabled={selected.length === 0}>{setLanguage === 'TH' ? 'ยกเลิก' : 'Cancle'}</Button>
                    </Form>
                  </>
                :
                  <>
                    {setState === "reservation" ?
                      <>
                        <Form>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>{setLanguage === 'TH' ? "เลือกการจอง" : 'Select Reservation'}</Form.Label>
                                <Form.Control as="select" multiple onChange={(e) => setSelected([parseInt(e.target.value)])} className="form-control-selected-PopupDashboardHome">
                                  {setValue.length > 0?
                                    setValue.map((item,index) =>(
                                      <>
                                        <option key={index}  value={item.id_reservation} className={` ${selected.includes(item.id_reservation) ? 'active-selected-PopupDashboardHome' : 'non-active-selected-PopupDashboardHome'} `}>
                                          {item.id_reservation} - {item.user.english_fname} {item.user.english_lname} - { setLanguage === 'TH' ? item.apartment.thai_name : item.apartment.name} - { setLanguage === 'TH' ? item.status === 1 ? 'ยืนยัน' : 'กำลังรอยืนยัน' : item.status === 1 ? 'Confirm' : 'Waiting'}
                                        </option>
                                      </>
                                    ))
                                  :
                                    <></>
                                  }
                                </Form.Control>
                                { setValue.map( v => v.status).includes(1) && setValue.map( v => v.status).includes(0) ? <label className="text-danger">{ setLanguage === 'TH' ? 'กรุณาเลือกสถานะการจองเหมือนกัน' : 'Plase select Reservation status same.'}</label> : <></> }
                            </Form.Group>
                              { setValue.map( v => v.status).includes(1) ?  
                                <Button className="btn btn-warning"  style={{marginTop : 10} } onClick={handlePayment} disabled={selected.length === 0}>{  setLanguage === 'TH' ? 'ชําระเงิน' : 'Playment'}</Button>
                              :
                                <Button className="btn btn-success"  style={{marginTop : 10, marginLeft : 10} } onClick={handleReservation} disabled={selected.length === 0}>{ setLanguage === 'TH' ? 'ยืนยันการจอง' : 'Confirm'}</Button>
                              }
                              <Button className="btn btn-danger"  style={{marginTop : 10, marginLeft : 10}} onClick={handleDeleteReservation} disabled={selected.length === 0}>{ setLanguage === 'TH' ? 'ลบการจอง' : 'Delete'}</Button>
                              <Button className="btn btn-info"  style={{marginTop : 10, marginLeft : 10}} onClick={handleAll} >{  setLanguage === 'TH' ? 'ทั้งหมด' : 'All'}</Button>
                        </Form>
                      </>
                      : setState === "apartment" ?
                      <>
                        <Form>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>{setLanguage === 'TH' ? "เลือกอพาร์ทเม้นท์" : 'Select Apartment'}</Form.Label>
                                <Form.Control as="select" multiple onChange={(e) => setSelected([parseInt(e.target.value)])} className="form-control-selected-PopupDashboardHome">
                                  {setValue.length > 0?
                                    setValue.map((item,index) =>(
                                      <>
                                        <option key={index}  value={item.id_apartment} className={` ${selected.includes(item.id_apartment) ? 'active-selected-PopupDashboardHome' : 'non-active-selected-PopupDashboardHome'} `}>
                                          {item.id_apartment} - {item.user.english_fname} {item.user.english_lname} - { setLanguage === 'TH' ? item.thai_name : item.name} - { setLanguage === 'TH' ? item.status === 1 ? 'ยืนยัน' : 'กำลังรอยืนยัน' : item.status === 1 ? 'Confirm' : 'Waiting'}
                                        </option>
                                      </>
                                    ))
                                  :
                                    <></>
                                  }
                                </Form.Control>
                            </Form.Group>
                            { 
                              (setValue.filter(item => item.status === 1).length !== 0 && setValue.filter(item => item.status === 0).length !== 0) ? 
                                <Form.Label className="text-danger">*{setLanguage === 'TH' ? "โปรดเลือกสถานะอพาร์เม้นท์ให้เหมือนกัน" : 'Plase select Apartment status same all.'}</Form.Label>
                              :
                                <></>
                            }
                            <br></br>
                              <Button 
                                className="btn btn-warning" 
                                style={{ marginTop: 10 }} 
                                onClick={handleApartment} 
                                disabled={
                                  selected.length === 0 || 
                                  (setValue.filter(item => item.status === 1).length !== 0 && setValue.filter(item => item.status === 0).length !== 0)
                                }>
                                {setLanguage === 'TH' ? 'ยืนยัน' : 'Confirm'}
                              </Button>
                              <Button className="btn btn-danger"  style={{marginTop : 10, marginLeft : 10}} onClick={handleDeleteApartment} disabled={selected.length === 0 || session_Login.status !== 'admin'}>{setLanguage === 'TH' ? 'ลบอพาร์ทเม้นท์' : 'Delete'}</Button>
                              <Button className="btn btn-info"  style={{marginTop : 10, marginLeft : 10}} onClick={handleAll} >{setLanguage === 'TH' ? 'ทั้งหมด' : 'All'}</Button>
                        </Form>
                      </>
                      : setState === "payment" ?
                      <>
                        <Form>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>{ setLanguage === 'TH' ? "เลือกการชําระเงิน" : 'Select Payments'}</Form.Label>
                                <Form.Control as="select" multiple onChange={(e) => setSelected([parseInt(e.target.value)])}  className="form-control-selected-PopupDashboardHome">
                                  {setValue.length > 0?
                                    setValue.map((item,index) =>(
                                      <>                              
                                          <option key={index}  value={item.id_payment} className={` ${selected.includes(item.id_payment) ? 'active-selected-PopupDashboardHome' : 'non-active-selected-PopupDashboardHome'} `}>
                                            {item.id_payment} - {item.user.english_fname} {item.user.english_lname} - { setLanguage === 'TH' ? item.apartment.thai_name : item.apartment.name}  - { setLanguage === 'TH' ? item.status_user === 0 ? 'กำลังรอยืนยัน' : 'ยืนยัน' : item.status_user === 0 ? 'Waiting' : 'Confirm' }
                                          </option>
                                      </>
                                    ))
                                  :
                                    <></>
                                  }
                                </Form.Control>
                                { 
                                  setValue.map( v => v.status_user).includes(0) ?
                                    <label className="text-danger">{setLanguage === 'TH' ? "โปรดรอสถานะของสมาชิกยืนยันก่อน" : 'Plase select payment status user confirm.'}</label> 
                                  : setValue.map( v => v.status_user).includes(0) && setValue.map( v => v.status_user).includes(1)  ? 
                                    <label className="text-danger">{setLanguage === 'TH' ? "โปรดเลือกสถานะการชำระเงินให้เหมือนกัน" : 'Plase select payment status user confirm.'}</label> 
                                  : 
                                  <></> 
                                }
                            </Form.Group>
                              <Button className="btn btn-warning"  style={{marginTop : 10} } onClick={handlePaymentStatus} disabled={selected.length === 0  || setValue.map( v => v.status_user).includes(0) || setValue.map( v => v.status_user).includes(0) || setValue.map( v => v.status_user).includes(0) && setValue.map( v => v.status_user).includes(1) }>{ setLanguage === 'TH' ? 'ยืนยันชําระเงิน' : 'Fix status'}</Button>
                              <Button className="btn btn-danger"  style={{marginTop : 10, marginLeft : 10}} onClick={handleDeletePayment} disabled={selected.length === 0}>{setLanguage === 'TH' ? 'ลบการชำระเงิน' : 'Delete'}</Button>
                              <Button className="btn btn-info"  style={{marginTop : 10, marginLeft : 10}} onClick={handleAll} >{setLanguage === 'TH' ? 'ทั้งหมด' : 'All'}</Button>
                        </Form>
                      </>
                      : setState === "problem" ?
                      <>
                        <Form>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>{ setLanguage === 'TH' ? "เลือกปัญหา" : 'Select Problems'}</Form.Label>
                                <Form.Control as="select" multiple onChange={(e) => setSelected([parseInt(e.target.value)])} className="form-control-selected-PopupDashboardHome">
                                  {setValue.length > 0?
                                    setValue.map((item,index) =>(
                                      <>                              
                                          <option key={index}  value={item.id_problem} className={` ${selected.includes(item.id_reservation) ? 'active-selected-PopupDashboardHome' : 'non-active-selected-PopupDashboardHome'} `}>
                                            {item.id_problem} - {item.user.english_fname} {item.user.english_lname} - {item.content}
                                          </option>
                                      </>
                                    ))
                                  :
                                    <></>
                                  }
                                </Form.Control>
                            </Form.Group>
                              <Button className="btn btn-warning"  style={{marginTop : 10} } onClick={handleProblem} disabled={(selected.length === 0)}>{ setLanguage === 'TH' ? 'แก้ไขปัญหา'  : 'Edite'}</Button>
                              <Button className="btn btn-danger"  style={{marginTop : 10, marginLeft : 10}} onClick={handleDeleteProblem} disabled={selected.length === 0}>{setLanguage === 'TH' ? 'ลบปัญหา' : 'Delete'}</Button>
                              <Button className="btn btn-info"  style={{marginTop : 10, marginLeft : 10}} onClick={handleAll} >{setLanguage === 'TH' ? 'ทั้งหมด' : 'All'}</Button>
                        </Form>
                      </>
                      :
                      <>
                      </>
                    }
                  </>
                }                    
              </>
            </Modal.Body>

        </Modal>
    )
}

export default PopupdashboardHome