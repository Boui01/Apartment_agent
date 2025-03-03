import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from 'react-router-dom';
import "./EmailValidate.css"
import PopupSuccess from "../PopupSuccess/PopupSuccess";
function EmailValidate({ setLanguage }) {
    const [searchParams] = useSearchParams();
    const [Confirm , setConfirm] = useState(false)
    const [Email , setEmail] = useState('')
    const [ModalSuccess , setModalSuccess] = useState(false)
    const [ModalSuccessDetail , setModalSuccessDetail] = useState()
    const token = searchParams.get('token'); // Extract the token from the query parameter
    const navigate = useNavigate();
 
    // find token
    useEffect(() => {
       const freshdata = async () => {
            if(token){
                try{
                    const response = await axios.get(`http://127.0.0.1:8000/api/token/${token}`)
                    if(response.data[422]){
                        console.log('Token error : ',response.data[422])
                    }
                    else{
                        console.log('response : ' , response.data)
                        setConfirm(true)
                        setEmail(response.data.data)
                    }
                }
                catch(error){
                    console.log('Token error : ',error)
                }
            }
       } 
       freshdata()

    },[token])

    // verify
    const handleConfirmVerify = async () => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/emailVerify/${Email}`)
            if(response.data[422]){
                console.log('Verrify error : ',response.data[422])
            }
            else{
                console.log('response : ' , response.data)
                const image = response.data.image;
                const image_src = 'data:image/jpeg;base64,' + image;
                    
                sessionStorage.setItem('token',JSON.stringify(response.data.user))
                sessionStorage.setItem('token_bank',JSON.stringify(response.data.bank))
                sessionStorage.setItem('token_image',JSON.stringify(image_src))
                sessionStorage.setItem('token_id',JSON.stringify(response.data.user_token))

                setModalSuccess(true)
                setModalSuccessDetail( setLanguage === 'TH' ? 'ยืนยันอีเมลสําเร็จ' : 'Email Verify Success!')

            }
        }
        catch (error) {
            console.log('Verrify error : ',error)
        }
    }

    return(
        <>
            <video autoPlay loop muted className='videoBackground-emailvalidate'>
                <source src="..\Video\Profile.mp4" type="video/mp4" />
            </video>
            <div className="block-emailvalidate-main">
                <h1>{setLanguage === 'TH' ? 'ยืนยันอีเมล' : 'Validation Email'} </h1>
                {Confirm ?
                        <>
                            <p>{Email}</p>
                            <button className="btn custom-btn-confirm-emailvalidate" onClick={handleConfirmVerify}>{setLanguage === 'TH' ? 'ยืนยัน' : 'Confirm'} </button>
                        </>
                    :
                    <>
                        {setLanguage === 'TH' ? 'คุณไม่ได้ยืนยันอีเมล กรุณากลับไปที่หน้าหลัก' : 'You can not access this page'}
                    </>
                }
            </div>
            <PopupSuccess message={ModalSuccessDetail} show={ModalSuccess} onHide={() => (  setModalSuccess(false),
                                                                                            navigate('/home'),
                                                                                            window.location.reload() 
                                                                                        )} />
        </>
    )
}

export default EmailValidate