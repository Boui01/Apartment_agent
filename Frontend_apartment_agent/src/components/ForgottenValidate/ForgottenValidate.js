import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from 'react-router-dom';
import  "./ForgottenValidate.css"

function ForgoottenValidate( { setLanguage } ) {
    const [searchParams] = useSearchParams();
    const [Confirm , setConfirm] = useState(false)
    const [Email , setEmail] = useState('')
    const [Password , setPassword] = useState('')
    const [ConfirmPassword , setConfirmPassword] = useState('')
    const navigate = useNavigate();
    const token = searchParams.get('token'); // Extract the token from the query parameter

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


    // New password
    const handleConfirmNewPassword = async (e) => {
        e.preventDefault()
        if(Password !== ConfirmPassword){
            alert('Password not match!')
            return
        }
        else{
            e.preventDefault()     
            try {
                const response = await axios.put(`http://127.0.0.1:8000/api/forgotPassword/${Email}`,
                        {
                            password : e.target.password.value , 
                            password_confirmation: e.target.password_confirmation.value
                        }
                    )
                if(response.data[422] || response.data[404]){
                    console.log('New password error : ',response.data)
                }
                else{
                    console.log('response-new-password : ' , response.data)
                    alert( setLanguage === 'TH' ? 'เปลี่ยนรหัสผ่านสําเร็จ' : 'Change password Success!')
                    navigate('/home')
                    window.location.reload()

                }
            }
            catch (error) {
                console.log('New password error : ',error)
            }
        }
    }
         
    return (
        <>
            <video autoPlay loop muted className='videoBackground-forgottenvalidate'>
                <source src="..\Video\Profile.mp4" type="video/mp4" />
            </video>
            <div className="block-forgottenvalidate-main">
                {   
                    Confirm ?
                        <form onSubmit={handleConfirmNewPassword}>
                            <h1 className="text-head-forgottenvalidate">{setLanguage === 'TH' ? 'ตั้งรหัสผ่านใหม่' : 'New Password'}</h1>
                            <input className="form-control mb-3" name="password" type="password" placeholder={ setLanguage === 'TH' ? 'รหัสผ่านใหม่' : "Enter Password"} onChange={(e) => setPassword(e.target.value)} value={Password} required/>
                            <input className="form-control mb-3"  name="password_confirmation" type="password" placeholder={ setLanguage === 'TH' ? 'ยืนยันรหัสผ่านใหม่' : "Enter Confirm Password"} onChange={(e) => setConfirmPassword(e.target.value)} value={ConfirmPassword} required/>
                            <button className="btn custom-confirm-forgottenvalidate" type="submit"> {setLanguage === 'TH' ? 'ยืนยัน' : "Confirm"}</button>
                        </form>
                    :
                        <h1>{setLanguage === 'TH' ? 'กรุณาตรวจสอบอีเมลและรหัสผ่าน' : "You don't have in this page"}</h1>
                }
            </div>
        </>
    )
}

export default ForgoottenValidate