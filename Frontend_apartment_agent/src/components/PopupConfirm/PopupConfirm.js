import { Button, Modal } from "react-bootstrap";

function PopupConfirm( {setModal , outModal, text , resulte , setLanguage} ) {
   const handleClick = () => {
    resulte()
     outModal()
   }
    return(
        <Modal show={setModal} onHide={() => outModal()}>
            <Modal.Header>
                <Modal.Title>{ 
                    setLanguage === 'TH' ? text ? 
                        text : 'คุณต้องการยืนยันการลบทั้งหมด ?' :
                        text ? text : 'Do you want confirm these Delete all ?'
                    }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Button className="btn btn-secondary" onClick={() => outModal()}>{setLanguage === 'TH' ? 'ยกเลิก' : 'Cancel'}</Button>
                <Button className="btn btn-warning mx-2" onClick={() => handleClick()}>{setLanguage === 'TH' ? 'ยืนยัน' : 'Confirm'}</Button>
            </Modal.Body>
        </Modal>
    )
}

export default PopupConfirm;