import { Modal } from "react-bootstrap"
import './Bank.css'

function Bank ( { showModal , outModal , setMoney , setSuccess , setLanguage} ) {
    return (
        <Modal show={showModal} onHide={() => outModal()}>
            <Modal.Header closeButton closeVariant="white" style={{background : "#262626" , color : "white" }}>
                <Modal.Title style={{fontSize : "28px"}}>{setLanguage === 'TH' ? 'ธนาคาร' : 'Bank'}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{textAlign : "center" , padding : "50px"}}>
                <div className="block-image-bank-page">
                    <img src=".\Image\QR_code.jpg" />
                </div>
                <div className="text-bank-page">
                    <p>{setLanguage === 'TH' ? 'คุณสามารถใช้ QR code เพื่อชำระเงิน' : 'You can use this QR code to payment.'} </p>
                    <p>{setLanguage === 'TH' ? 'ราคา : ' : 'Price : '} {setMoney} {setLanguage === 'TH' ? 'บาท ' : 'THB '}</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-success" onClick={() => setSuccess()}>{setLanguage === 'TH' ? 'ยืนยัน' : 'Confirm'}</button>
            </Modal.Footer>
        </Modal>
    )
}
export default Bank