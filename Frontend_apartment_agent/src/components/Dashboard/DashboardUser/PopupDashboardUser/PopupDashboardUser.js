import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import './PopupDashboardUser.css'
import axios from "axios";
function PopupDashboardUser( { setModal,outModal,setValue,outStatus,outSelect,setLogin,setPosition , setLanguage , rule} ) {
    const [ButtonState,setButtonState] =  useState('');
    const [positionEdite , setPositionEdite] = useState();
    const [valueEdite , setvalueEdite] = useState();
    const [ConfirmEdite ,setConfirmEdite] = useState(false);
    const [selected, setSelected] = useState([]);
    const session_Login = sessionStorage.getItem('token')? JSON.parse(sessionStorage.getItem('token')) : setLogin ; 
    const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : ''


    useEffect(() => {
        const fetchData = async () => {

            if(ConfirmEdite === true){
                console.log('Data Edite : ', session_Login , selected);

                if (rule === 'user'){
                    if(positionEdite === 'id_bank' || positionEdite === 'type'){
                        try {
                            const response = await axios.put(`http://127.0.0.1:8000/api/banks/dashboard/${session_Login.id}`,
                                {
                                    ids  : selected,
                                    position : positionEdite,
                                    value : valueEdite ,
                                    type : 'admin' , 
                                    status_user : session_Login.status
                                },{
                                headers: {
                                Authorization: `Bearer ${token}`,
                                }
                            }             
                            ); 
                            if( response.data[404] || response.data[422] ){
                                console.log('Error Data Edite reponse :', response.data);
                                alert('Error Data Edite reponse :', response.data);
                                setSelected([])
                                setButtonState('')
                                setConfirmEdite(false)
                            }
                            else{
                                console.log('Data Edite reponse :', response.data); 
                                outSelect(selected)
                                setPositionEdite()
                                setvalueEdite()
                                setSelected([])
                                setButtonState('')
                                setConfirmEdite(false)
                                outStatus(true)   
                            }

                        }
                        catch (error) {              
                            console.error('Error:', error);
                        }
                    }
                    else{
                        try{
                            const response = await axios.put(`http://127.0.0.1:8000/api/users/dashboard/${session_Login.id}`,{ position : positionEdite,value : valueEdite , ids : selected , status_user : session_Login.status},{ 
                                headers: {
                                Authorization: `Bearer ${token}`,
                                }
                            } 
                            );
                            if( response.data[404] || response.data[422] ){
                                console.log('Error Data Edite reponse :', response.data);
                                alert('Error Data Edite reponse :', response.data);
                                outSelect(selected)
                                setSelected([])
                                setButtonState('')
                                setConfirmEdite(false)
                                outStatus(true)
                            }
                            else{
                                console.log('Data Edite reponse :', response.data);
                                outSelect(selected)
                                setPositionEdite()
                                setvalueEdite()
                                setSelected([])
                                setButtonState('')
                                setConfirmEdite(false)
                                outStatus(true)
                            }
                        }
                        catch (err) {
                            console.error(err)
                        }
                    }

                }
                else if (rule === 'employee'){
                    try{
                        const response = await axios.put(`http://127.0.0.1:8000/api/employees/dashboard/${session_Login.id}`,{ position : positionEdite,value : valueEdite , ids : selected , status_user : session_Login.status},{ 
                            headers: {
                            Authorization: `Bearer ${token}`,
                            }
                        } 
                        );
                        if( response.data[404] || response.data[422] ){
                            console.log('Error Data Edite reponse :', response.data);
                            alert('Error Data Edite reponse :', response.data);
                            outSelect(selected)
                            setSelected([])
                            setButtonState('')
                            setConfirmEdite(false)
                            outStatus(true)
                        }
                        else{
                            console.log('Data Edite reponse :', response.data);
                            outSelect(selected)
                            setPositionEdite()
                            setvalueEdite()
                            setSelected([])
                            setButtonState('')
                            setConfirmEdite(false)
                            outStatus(true)
                        }
                    }
                    catch (err) {
                        console.error(err)
                    }
                }
            }

        }
        fetchData();
    },[ConfirmEdite ])

    const handleEdite = (e) => {
        e.preventDefault();
        console.log("Select : " , selected)
        setButtonState('edite');
    }
    const handleAll = () => {
        setSelected(setValue.map(value => value.id_card))
    }
    const handleEdite_value = (e) => {
        e.preventDefault();
        setButtonState('edite_value');  
    }
    const handleConfirm = (e) => {
        e.preventDefault();
        setConfirmEdite(true);
    }
    const handleCancle = (backTo) => {
        setButtonState(backTo);
    }
    return(
        <>
         <Modal show={setModal} onHide={outModal}>
            <Modal.Header closeButton>
            </Modal.Header>

            <Modal.Body>
                {ButtonState === 'edite'?  
                  <>
                    <Form onSubmit={handleEdite_value}>
                      <Form.Group controlId="exampleForm.ControlSelect1">
                              <Form.Label>{ setLanguage === 'TH' ? 'เลือกตําแหน่งที่ต้องการแก้ไข' : 'Select edite position'}</Form.Label>
                              <Form.Control as="select" multiple onChange={(e) => setPositionEdite(e.target.value)}>
                                    {setPosition.map((item) =>(
                                        <>
                                            <option value={item}>{
                                                setLanguage === 'TH' ? 
                                                    item === 'thai_fname' ? 'ชื่อ-สมาชิกภาษาไทย' :
                                                    item === 'thai_lname' ? 'นามสกุล-สมาชิกภาษาไทย' :
                                                    item === 'english_fname' ? 'ชื่อ-สมาชิกภาษาอังกฤษ' :
                                                    item === 'english_lname' ? 'นามสกุล-สมาชิกภาษาอังกฤษ' :
                                                    item === 'religion' ? 'ศาสนา' :
                                                    item === 'sex' ? 'เพศ' :
                                                    item === 'age' ? 'อายุ' :
                                                    item === 'email' ? 'อีเมล' :
                                                    item === 'password' ? 'รหัสผ่าน' :
                                                    item === 'id_bank' ? 'เลขบัญชีธนาคาร' :
                                                    item === 'type' ? 'ประเภทบัญชีธนาคาร' :
                                                    item === 'id_card' ? 'เลขบัตรประชาชน' :
                                                    item === 'financial_statement' ? 'ระดับวงเงิน' :
                                                    item === 'line_id' ? 'ไลน์ไอดี' :
                                                    item === 'phone' ? 'เบอร์โทร' :
                                                    item === 'guarantor_english_fname' ? 'ชื่อผู้ประกัน' :
                                                    item === 'guarantor_english_lname' ? 'นามสกุลผู้ประกัน' :
                                                    item === 'guarantor_address' ? 'ที่อยู่ผู้ประกัน' :
                                                    item === 'guarantor_phone' ? 'เบอร์โทรผู้ประกัน' :
                                                    item === 'name' ? 'ชื่อ' :
                                                    item === 'address' ? 'ที่อยู่' :
                                                    item === 'birthday' ? 'วันเกิด' : item
                                                :
                                                    item
                                            }</option>
                                        </>
                                    ))}
                              </Form.Control>
                          </Form.Group>
                            <Button className="btn btn-warning" type="submit"  style={{marginTop : 10} } disabled={positionEdite === null}>{ setLanguage === 'TH' ? 'แก้ไข' : 'Input'}</Button>
                            <Button className="btn btn-danger"  style={{marginTop : 10, marginLeft : 10}} onClick={() => handleCancle()} disabled={selected.length === 0}>{ setLanguage === 'TH' ? 'ยกเลิก' : 'Cancle'}</Button>
                      </Form>
                  </>
                : ButtonState === 'edite_value'?
                    <>
                        <Form onSubmit={handleConfirm}>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>{ setLanguage === 'TH' ? 
                                    'แก้ไขข้อมูล'+(
                                        positionEdite === 'thai_fname' ? ' ชื่อ-สมาชิกภาษาไทย' :
                                        positionEdite === 'thai_lname' ? ' นามสกุล-สมาชิกภาษาไทย' :
                                        positionEdite === 'english_fname' ? ' ชื่อ-สมาชิกภาษาอังกฤษ' :
                                        positionEdite === 'english_lname' ? ' นามสกุล-สมาชิกภาษาอังกฤษ' :
                                        positionEdite === 'religion' ? 'ศาสนา' :
                                        positionEdite === 'sex' ? 'เพศ' :
                                        positionEdite === 'age' ? 'อายุ' :
                                        positionEdite === 'email' ? 'อีเมล' :
                                        positionEdite === 'password' ? 'รหัสผ่าน' :
                                        positionEdite === 'id_bank' ? 'เลขบัญชีธนาคาร' :
                                        positionEdite === 'type' ? 'ประเภทบัญชีธนาคาร' :
                                        positionEdite === 'id_card' ? 'เลขบัตรประชาชน' :
                                        positionEdite === 'financial_statement' ? 'ระดับวงเงิน' :
                                        positionEdite === 'line_id' ? 'ไลน์ไอดี' :
                                        positionEdite === 'phone' ? 'เบอร์โทร' :
                                        positionEdite === 'guarantor_english_fname' ? 'ชื่อผู้ประกัน' :
                                        positionEdite === 'guarantor_english_lname' ? 'นามสกุลผู้ประกัน' :
                                        positionEdite === 'guarantor_address' ? 'ที่อยู่ผู้ประกัน' :
                                        positionEdite === 'guarantor_phone' ? 'เบอร์โทรผู้ประกัน' :
                                        positionEdite === 'name' ? 'ชื่อ' :
                                        positionEdite === 'address' ? 'ที่อยู่' :
                                        positionEdite === 'birthday' ? 'วันเกิด' : positionEdite

                                    ) 
                                    : 
                                    'Input value edite'+(
                                        positionEdite
                                    )}
                                </Form.Label>
                                { positionEdite === 'birthday' ? 
                                
                                    <Form.Control type="date" onChange={(e) => {
                                        const date = e.target.valueAsDate;
                                        if(date && date.getTime() > new Date().getTime()){
                                            alert( setLanguage === 'TH' ? 'วันที่ควรจะไม่เกินวันนี้และไม่น้อยกว่า 18' : 'Date of birth should not be later than today');
                                            setvalueEdite(null);
                                        } else {
                                            setvalueEdite(date);
                                        }
                                    }} />
                                : positionEdite === 'age' ?
                                    <Form.Control type="number" onChange={(e) => setvalueEdite(e.target.value)} max="100" min="1" required/>
                                : positionEdite === 'sex' ?
                                    <Form.Select onChange={(e) => setvalueEdite(e.target.value)} >
                                        <option value="Men">{ setLanguage === 'TH' ? 'ชาย' : 'Men'}</option>
                                        <option value="Women">{ setLanguage === 'TH' ? 'หญิง' : 'Women'}</option>
                                        <option value="Transgender">{ setLanguage === 'TH' ? 'แปลงเพศ' : 'Transgender'}</option>
                                    </Form.Select>
                                : positionEdite === 'email' ?
                                    <Form.Control type="email" onChange={(e) => setvalueEdite(e.target.value)} required/>
                                : positionEdite === 'password' ?
                                    <Form.Control type="password" onChange={(e) => setvalueEdite(e.target.value)} minLength={8} required/>
                                : positionEdite === 'phone' || positionEdite === 'guarantor_phone' ?
                                    <Form.Control type="text" onChange={(e) => setvalueEdite(e.target.value)} minLength={10} maxLength={10} required/>
                                : positionEdite === 'id_bank' || positionEdite === 'id_card' ?
                                    <Form.Control type="text" onChange={(e) => setvalueEdite(e.target.value)} minLength={13} maxLength={13} required/>
                                : positionEdite === 'type' ?
                                    <Form.Select  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="bank_type" maxLength="30" minLength="1" placeholder="Bank_type" onChange={(e) => setvalueEdite(e.target.value)} required>
                                        <option value="" disabled>{ setLanguage === 'TH' ? "เลือกประเภทบัญชี" :'Select Bank Type' }</option>
                                        <option value="SCB">SCB / ไทยพาณิชย์</option>
                                        <option value="KTB">KTB / กรุงไทย</option>
                                        <option value="BBL">BBL / กรุงเทพ</option>
                                        <option value="KBANK">KBANK / กสิกรไทย</option>
                                    </Form.Select>
                                : positionEdite === 'line_id' ?
                                    <Form.Control type="text" onChange={(e) => setvalueEdite(e.target.value)} minLength={1} maxLength={30} required/>
                                : positionEdite === 'financial_statement' ?
                                    <Form.Select className="form-control marginInput" onChange={(e) => setvalueEdite(e.target.value)}   max="999999" min="10000" required>
                                        <option value="" disabled>{ setLanguage === 'TH' ? "เลือกระดับการเงิน" :'Select Financial statemen' }</option>
                                        <option value={10000}>{ setLanguage === 'TH' ? "ต่ำ - 10,000" :'Lower - 10,000' }</option>
                                        <option value={15000}>10,001 - 25,000</option>
                                        <option value={50000}>25,001 - 50,000</option>
                                        <option value={75000}>50,001 - 75,000</option>
                                        <option value={100000}>{ setLanguage === 'TH' ? "75,001 - สูง" :'75,001 - Over' }</option>
                                    </Form.Select>
                                : positionEdite === 'thai_fname' || positionEdite === 'thai_lname' ?
                                    <Form.Control type="text" onChange={(e) => setvalueEdite(e.target.value)}  maxLength="30" pattern="[\u0E00-\u0E7F\s]+"  required/>
                                : positionEdite === 'english_fname' || positionEdite === 'english_lname' || positionEdite === 'guarantor_english_fname' || positionEdite === 'guarantor_english_lname' ?
                                    <Form.Control type="text" onChange={(e) => setvalueEdite(e.target.value)}    maxLength="30" pattern="[a-zA-Z]+$"   required/>
                                :
                                    <Form.Control as="input" onChange={(e) => setvalueEdite(e.target.value)} required/>

                                }
                            </Form.Group>
                            <Button className="btn btn-warning"  style={{marginTop : 10} } type="submit" disabled={valueEdite === null}>{ setLanguage === 'TH' ? 'ยืนยัน' : 'Confirm'}</Button>
                            <Button className="btn btn-danger"  style={{marginTop : 10, marginLeft : 10}} onClick={() => handleCancle('edite')} disabled={selected.length === 0}>{ setLanguage === 'TH' ? 'ยกเลิก' : 'Cancle'}</Button>
                        </Form>
                    </>
                :
                <>
                    <Form onSubmit={handleEdite}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>{ setLanguage === 'TH' ? 'เลือกบัตรที่ต้องการแก้ไข' : 'Select Card'}</Form.Label>
                            <Form.Control as="select" multiple onChange={(e) => setSelected([e.target.value])} style={{overflow : 'auto'}} className="form-control-selected-PopupDashboardUser">
                                {setValue.length > 0?
                                    setValue.map((item,index) =>(
                                        <>
                                        <option key={index}  value={item.id_card} className={` ${selected.includes(item.id_card) ? 'active-selected-PopupDashboardUser' : 'non-active-selected-PopupDashboardUser'} `}>
                                            {item.id_card} - {item.thai_fname} {item.thai_lname} - {item.english_fname} {item.english_lname} - {new Date(item.last_login).toLocaleDateString()} | {new Date(item.last_login).toLocaleTimeString()}
                                        </option>
                                        </>
                                    ))
                                    :
                                    <></>
                                }
                            </Form.Control>
                        </Form.Group>
                            <Button className="btn btn-warning"  style={{marginTop : 10} } type="submit" disabled={selected.length === 0}>{ setLanguage === 'TH' ? 'แก้ไข' : 'Edite'}</Button>
                            <Button className="btn btn-info"  style={{marginTop : 10, marginLeft : 10}} onClick={handleAll} >{ setLanguage === 'TH' ? 'ทั้งหมด' : 'All'}</Button>
                    </Form>
                </>  
                }                
            </Modal.Body>

        </Modal>
        </>
    )
}

export default PopupDashboardUser