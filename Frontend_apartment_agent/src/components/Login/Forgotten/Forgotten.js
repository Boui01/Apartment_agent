import { Button, Form, Modal } from "react-bootstrap";
import './Forgotten.css'
import emailjs from 'emailjs-com';
import axios from "axios";
function ForgottenForm ( {setModal , outModal , setLanguage} ){
    return(
        <Modal show={setModal} onHide={() => outModal()} className="modal-forgotten">
            <Modal.Header closeButton>
                <Modal.Title>{setLanguage === 'TH' ? 'ลืมรหัสผ่าน' : 'Forgotten Password'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Forgotten setLanguage={setLanguage}/>
            </Modal.Body>
        </Modal>
    )
}

function Forgotten({setLanguage}) {
    
    const handleSubmitForgotten = async (e) => {
        e.preventDefault();
        const validationToken = Math.random().toString(36).slice(-8);
        const validationLink = `http://localhost:3000/validate-forgotten?token=${validationToken}`
        const ms =  `Please click the following link to change your password: 
                        <a href="${validationLink}">Change New Password</a>                     
                    `

            // save token
            const history_save = { email : e.target.email.value , token : validationToken}
            try{
                const response = await axios.post(`http://127.0.0.1:8000/api/token`, {history : history_save})
                if(response.data[404] || response.data[422]){
                    alert( setLanguage === 'TH' ? 'กรุณาเช็คที่อีเมลของคุณ.' : 'Please valify your email!')
                    console.log('error-forgotten : ', response.data)
                }
                else{
                    console.log('response-save-tokens : ' , response.data)

                    //send email
                    try{
                        const response2 = await emailjs.send(
                            'service_7im7vlo', 'template_nuqayod', 
                            {
                                from_name: 'cecezx111@gmail.com',
                                to_email: e.target.email.value,
                                message: ms,
                            }, 
                            'jw32AzeO3ezAw8l91')
            
                        if(response2){
                            console.log('Email sent successfully:', response2);
                            alert('Please check your email!')
                        }
                    }
                    //error send email
                    catch (error) {
                        console.error('Error-sent-tokens  : ', error);
                    }

                }
            }
            // error save token
            catch (error) {
                console.error('Error-save-tokens : ', error);
            }
    }


    return(
        <>
            <Form onSubmit={handleSubmitForgotten}>
                <Form.Group>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder={setLanguage === 'TH' ? 'กรอกอีเมลล์' : "Enter email"}
                        className="mb-3 custom-input-forgotten"
                    />
                    <Button type="submit" className="btn-forgotten">
                        {setLanguage === 'TH' ? 'ตกลง' : 'Submit'}
                    </Button>
                </Form.Group>
            </Form>
        </>
    )
}

export default ForgottenForm;