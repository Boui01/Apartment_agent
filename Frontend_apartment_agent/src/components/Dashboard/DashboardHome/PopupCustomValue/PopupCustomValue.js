import { useEffect, useState } from "react";
import { Button, Form, Modal, Placeholder } from "react-bootstrap";
import './PopupCustomValue.css'
function PopupCustomValue( { setModalState , outModalState , setCustomPosition , outCustomPosition  ,outCustomValue , setLanguage } ){
    const [modal , setModal] = useState(true)
    const [customValue , setCustomValue] = useState()
    const [customSearchPosition , setCustomSearchPosition] = useState('english_fname')

    useEffect(() => {
        setModal(true)
        setCustomValue()
        setCustomSearchPosition('english_fname')
    },[setModalState])

    const handleSubmitSearch = (e) => {
        e.preventDefault();

        // check table
        if( setCustomPosition.table === 'reservations'){
            
            // check change position to column
            outCustomPosition( 
                setCustomPosition.position === 'ID User' ? { InItem : null , position : 'card_id' } :
                setCustomPosition.position === 'User Name' ? { InItem : 'user' , position : customSearchPosition } :
                setCustomPosition.position === 'Apartment Name' ? { InItem : 'apartment' , position :'name' } : 
                setCustomPosition.position === 'Room' ? { InItem : null , position :'room' } : 
                setCustomPosition.position === 'People' ? { InItem : null , position :'people' } : 
                setCustomPosition.position === 'Price' ? { InItem : 'apartment' , position :'price' } : 
                ''
            )

            // check change type
            if( setCustomPosition.position === 'Price' || setCustomPosition.position === 'Room' || setCustomPosition.position === 'People' ){
                outCustomValue( parseInt(customValue) )
            }
            else{
                outCustomValue( customValue )
            }
        }
        else if ( setCustomPosition.table === 'apartment'){
            // check change position to column
            outCustomPosition( 
                setCustomPosition.position === 'ID User' ? { InItem : null , position : 'card_id' } :
                setCustomPosition.position === 'User Name' ? { InItem : 'user' , position : customSearchPosition } :
                setCustomPosition.position === 'Apartment Name' ? { InItem : null , position :'name' } : 
                setCustomPosition.position === 'Bedroom' ? { InItem : null , position :'bedroom' } : 
                setCustomPosition.position === 'Bathroom' ? { InItem : null , position :'bathroom' } : 
                setCustomPosition.position === 'Total room' ? { InItem : null , position :'total_room' } : 
                setCustomPosition.position === 'Score' ? { InItem : null , position :'score' } : 
                setCustomPosition.position === 'Pet' ? { InItem : null , position : 'pet' } : 
                setCustomPosition.position === 'Rule' ? { InItem : null , position :'rule' } : 
                setCustomPosition.position === 'Price' ? { InItem : null , position :'price' } : 
                ''
            )

            // check change type
            if( setCustomPosition.position === 'Price' || setCustomPosition.position === 'Bedroom' || setCustomPosition.position === 'Bathroom' || setCustomPosition.position === 'Total room' || setCustomPosition.position === 'Score' || setCustomPosition.position === 'Pet' ){
                outCustomValue( parseInt(customValue) )

            }
            else{
                outCustomValue( customValue )
            }
        }
        else if( setCustomPosition.table === 'payments' ){
            // check change position to column
            outCustomPosition( 
                setCustomPosition.position === 'ID User' ? { InItem : null , position : 'user_card_id' } :
                setCustomPosition.position === 'ID Employee' ? { InItem : null , position :'employee_card_id' } : 
                setCustomPosition.position === 'User Name' ? { InItem : 'user' , position : customSearchPosition } : 
                setCustomPosition.position === 'Employee Name' ? { InItem : 'employee' , position : customSearchPosition  } :
                setCustomPosition.position === 'Apartment Name' ? { InItem : 'apartment' , position :'name' } : 
                setCustomPosition.position === 'Price' ? { InItem : null , position :'price' } : 
                ''
            )

            // check change type
            if( setCustomPosition.position === 'Price' || setCustomPosition.position === 'Room' || setCustomPosition.position === 'People' ){
                outCustomValue( parseInt(customValue) )
            }
            else{
                outCustomValue( customValue )
            }
        }
        else if( setCustomPosition.table === 'problems' ){
            // check change position to column
            outCustomPosition( 
                setCustomPosition.position === 'ID User' ? { InItem : null , position : 'user_card_id' } :
                setCustomPosition.position === 'ID Employee' ? { InItem : null , position :'employee_card_id' } : 
                setCustomPosition.position === 'User Name' ? { InItem : 'user' , position : customSearchPosition } : 
                setCustomPosition.position === 'Employee Name' ? { InItem : 'employee' , position : customSearchPosition  } :
                setCustomPosition.position === 'Content' ? { InItem : null , position :'content' } : 
                setCustomPosition.position === 'Type' ? { InItem : null , position :'type' } : 
                ''
            )

            // check change type
            if( setCustomPosition.position === 'Price' || setCustomPosition.position === 'Room' || setCustomPosition.position === 'People' ){
                outCustomValue( parseInt(customValue) )
            }
            else{
                outCustomValue( customValue )
            }
        }


        setModal(false)
    }
    const handleHideModal = () => {
        setModal(false)
        outModalState()
    }
    return(
        <> 
            <Modal className="Modal-main-PopupCustomValue" show={modal} onHide={handleHideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{ setLanguage === 'TH' ? 'กรอก' : 'Input' + '&nbsp;'}
                        {
                            setCustomPosition.position === 'ID User' ? (setLanguage === 'TH' ? 'รหัสผู้ใช้งาน' : setCustomPosition.position) :
                            setCustomPosition.position === 'User Name' ? (setLanguage === 'TH' ? 'ชื่อผู้ใช้' : setCustomPosition.position) :
                            setCustomPosition.position === 'Apartment Name' ? (setLanguage === 'TH' ? 'ชื่ออพาร์ทเม้นท์' : setCustomPosition.position) :
                            setCustomPosition.position === 'Room' ? (setLanguage === 'TH' ? 'ห้อง' : setCustomPosition.position) :
                            setCustomPosition.position === 'People' ? (setLanguage === 'TH' ? 'จำนวนคน' : setCustomPosition.position) :
                            setCustomPosition.position === 'Price' ? (setLanguage === 'TH' ? 'ราคา' : setCustomPosition.position) :
                            setCustomPosition.position === 'Bedroom' ? (setLanguage === 'TH' ? 'ห้องนอน' : setCustomPosition.position) :
                            setCustomPosition.position === 'Bathroom' ? (setLanguage === 'TH' ? 'ห้องน้ำ' : setCustomPosition.position) :
                            setCustomPosition.position === 'Total room' ? (setLanguage === 'TH' ? 'จำนวนห้อง' : setCustomPosition.position) :
                            setCustomPosition.position === 'Pet' ? (setLanguage === 'TH' ? 'สัตว์เลี้ยง' : setCustomPosition.position) :
                            setCustomPosition.position === 'Status' ? (setLanguage === 'TH' ? 'สถานะ' : setCustomPosition.position) :
                            setCustomPosition.position === 'Service' ? (setLanguage === 'TH' ? 'บริการ' : setCustomPosition.position) :
                            setCustomPosition.position === 'ID Employee' ? (setLanguage === 'TH' ? 'รหัสพนักงาน' : setCustomPosition.position) :
                            setCustomPosition.position === 'Employee Name' ? (setLanguage === 'TH' ? 'ชื่อพนักงาน' : setCustomPosition.position) :
                            setCustomPosition.position === 'Score' ? (setLanguage === 'TH' ? 'คะแนน' : setCustomPosition.position) :
                            setCustomPosition.position === 'Rule' ? (setLanguage === 'TH' ? 'เงื่อนไข' : setCustomPosition.position) :
                            setCustomPosition.position === 'Content' ? (setLanguage === 'TH' ? 'เนื้อหา' : setCustomPosition.position) :
                            setCustomPosition.position === 'Type' ? (setLanguage === 'TH' ? 'ประเภท' : setCustomPosition.position) :

                            setCustomPosition.position
                        }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="Modal-body-PopupCustomValue">
                    <Form className="block-input-search-dashboard" onSubmit={handleSubmitSearch}>
                        {   setCustomPosition.table === 'apartment' && setCustomPosition.position === 'Pet' ?
                            <Form.Select  className="mt-3  ml-3 mr-3 custom-select-dashboard" value={customValue}  onChange ={(data) => setCustomValue(data.target.value) }>
                                <option disabled>{setLanguage === 'TH' ? 'เลือกสถานะ' : 'Selected permission pet'}</option>
                                <option value=''></option>
                                <option value={1}>{setLanguage === 'TH' ? 'มี' : 'Yes'}</option>
                                <option value={0}>{setLanguage === 'TH' ? 'ไม่มี' : 'No'}</option>
                            </Form.Select>
                        :
                            <Form.Control value={customValue} onChange={(data) => setCustomValue(data.target.value) }  placeholder={
                                setLanguage === 'TH' ? 
                                    'กรอก' +
                                    (
                                        setCustomPosition.position === 'ID User' ? 'รหัสที่จะค้นหา' : 
                                        setCustomPosition.position === 'User Name' ? 'ชื่อที่จะค้นหา' : 
                                        setCustomPosition.position === 'Apartment Name' ? 'ชื่ออพาร์ทเม้นท์' : 
                                        setCustomPosition.position === 'Room' ? 'ห้อง' : 
                                        setCustomPosition.position === 'People' ? 'จำนวนคน' : 
                                        setCustomPosition.position === 'Price' ? 'ราคา' : 
                                        setCustomPosition.position === 'Bedroom' ? 'ห้องนอน' :
                                        setCustomPosition.position === 'Bathroom' ? 'ห้องน้ำ' :
                                        setCustomPosition.position === 'Total room' ? 'จำนวนห้อง' :
                                        setCustomPosition.position === 'Pet' ? 'สัตว์เลี้ยง' :
                                        setCustomPosition.position === 'Status' ? 'สถานะ' :
                                        setCustomPosition.position === 'Service' ? 'บริการ' :
                                        setCustomPosition.position === 'ID Employee' ? 'รหัสพนักงาน' :
                                        setCustomPosition.position === 'Employee Name' ? 'ชื่อพนักงาน' :
                                        setCustomPosition.position === 'Score' ? 'คะแนน' :
                                        setCustomPosition.position === 'Rule' ? 'เงื่อนไข' :
                                        setCustomPosition.position === 'Content' ? 'เนื้อหา' :
                                        setCustomPosition.position === 'Type' ? 'ประเภท' :
                                        setCustomPosition.position
                                    )   
                                : 
                                    'Enter data '+
                                        setCustomPosition.position

                            }  
                            required/>
                        }
                        {
                            setCustomPosition.position === 'User Name' || setCustomPosition.position === 'Employee Name' ? 
                                <Form.Select className="mt-3  ml-3 mr-3 custom-select-dashboard" value={customSearchPosition}  onChange ={(data) => setCustomSearchPosition(data.target.value) } >
                                    <option disabled>{setLanguage === 'TH' ? 'เลือกตําแหน่ง' : 'Selected position name'}</option>
                                    <option  value={'english_fname'}>{setLanguage === 'TH' ? 'ชื่อ' : 'Frist name'}</option>
                                    <option value={'english_lname'}>{setLanguage === 'TH' ? 'นามสกุล' : 'Last name'}</option>
                                </Form.Select>
                            :
                                <></>
                        }
                        <Button className="btn-input-search-dashboard" type="submit">{ setLanguage === 'TH' ? 'ค้นหา' : 'Search'}</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
    
}

export default PopupCustomValue;