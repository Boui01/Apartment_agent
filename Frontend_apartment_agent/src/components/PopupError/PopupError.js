import { Modal } from "react-bootstrap";
import './PopupError.css'
function PopupError  ({ setModal , outModal , setDetail , setLanguage }) {
    return (
        <Modal show={setModal} onHide={() => outModal()} className="modal-error">
            <Modal.Header closeButton className="modal-error-header">
                <h1>{setLanguage === 'TH' ? 'ข้อผิดพลาด' : 'Failled'}</h1>
            </Modal.Header>
            <Modal.Body className="row align-items-center">
                <div className="block-error-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="50%" fill="orange" className="bi bi-exclamation-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
                    </svg>
                </div>
                {
                    setDetail ?
                        <div className="block-error-text">
                            <p>{setDetail.text}</p>
                            <p>{setDetail.detail[404] ? setDetail.detail[404] : setDetail.detail[422] ? setDetail.detail[422] : setDetail.detail[401]}</p>
                        </div> 

                    :
                    <></>
                }
            </Modal.Body>
        </Modal>
    )
}

export default PopupError;