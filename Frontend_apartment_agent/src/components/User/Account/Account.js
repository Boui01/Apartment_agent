import { useEffect, useState } from 'react';
import PopupError from '../../PopupError/PopupError';
import './Account.css'
import axios from "axios";
import emailjs from 'emailjs-com';
import { useNavigate } from 'react-router-dom';

function AccountForm( {setLogin , setLanguage} ){
    const navigate = useNavigate();
    return(
        <>
            <video autoPlay loop muted className="videoBackground">
                <source src="..\Video\Profile.mp4" type="video/mp4"  />
            </video>   
            <div className='Block-background-account'>
                <h1 className='text-head-content'>{setLanguage === 'TH' ? 'บัญชีผู้ใช้' : 'Account'}</h1>
                <Account setLogin={setLogin} setLanguage={setLanguage}/>
                <button className='btn-close btn-back 'aria-label="Close" onClick={() => navigate('/')}></button>
            </div>
        </>
    )
}

function Account( {setLogin , setLanguage} ){
    const User = sessionStorage.getItem('token')? JSON.parse(sessionStorage.getItem('token')) : setLogin;
    const [disabled , setDisabled] = useState('all')
    const [emailValue , setEmailValue] = useState(User.email)
    const [passwordValue , setPasswordValue] = useState("123456789" )
    const [position , setPosition] = useState()
    const [save  ,setSave] = useState(false)
    const [ModalError , setModalError] = useState(false)
    const [ModalErrorDetail , setModalErrorDetail] = useState()
    const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : '';

    useEffect(() => {
        const fetchData = async () => {
            if(save){
                // data for sent token
                const validationToken = Math.random().toString(36).slice(-8);
                const validationLink = `http://localhost:3000/validate-email?token=${validationToken}`
                const ms =  `Please click the following link to change your password: 
                                <a href="${validationLink}">Change New Password</a>                     
                            `
                const history_save = { email : User.email , token : validationToken}

                // sent email
                if(position === 'email'){
                    try{
                        const response =  await axios.put(`http://127.0.0.1:8000/api/user/${User.id}`,{value : emailValue,position : position },{ 
                            headers: {
                              Authorization: `Bearer ${token}`,
                            }
                          } 
                        )
                        if(response.data[404] || response.data[422]){
                            console.log('error-reset-email : ', response.data)
                            // setError
                            setModalError(true)
                            setModalErrorDetail({text : 'Reset-email' , detail : response.data})
                            // setDisabled
                            setDisabled('all')
                            setSave(false)
                        }
                        else{
                            console.log('success-reset-email : ', response.data)
                             
                            // sent token
                            try{
                                const response = await axios.post(`http://127.0.0.1:8000/api/token`, {history : history_save},{ 
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    }
                                  } 
                                )
                                if(response.data[404] || response.data[422]){
                                    console.log('error-save-tokens : ', response.data)
                                    // set error
                                    setModalError(true)
                                    setModalErrorDetail({text : 'Save-tokens' , detail : response.data})
                                    // set disabled
                                    setDisabled('all')
                                    setSave(false) 
                                }
                                else{
                                    console.log('response-save-token : ' , response.data)
                
                                    //send email
                                    try{
                                        const response2 = await emailjs.send(
                                            'service_7im7vlo', 'template_nuqayod', 
                                            {
                                                from_name: 'cecezx111@gmail.com',
                                                to_email: User.email,
                                                message: ms,
                                            }, 
                                            'jw32AzeO3ezAw8l91')
                            
                                        if(response2){
                                            console.log('Email sent successfully:', response2);
                                            alert('Please check your email!')
                                            setDisabled('all')
                                            setSave(false) 
                                        }
                                    }
                                    //error send email
                                    catch (error) {
                                        alert('Error-sent-tokens  : ', error)
                                        console.error('Error-sent-tokens  : ', error);
                                        setDisabled('all')
                                        setSave(false)
                                    }
                
                                }
                            }
                            
                            // error save token
                            catch (error) {
                                alert('Error-save-tokens  : ', error)
                                console.error('Error-save-tokens : ', error);
                                setDisabled('all')
                                setSave(false)
                            }

                        }
                        
                    }
                    catch (error) {
                        alert('Error-sent-email  : ', error)
                        console.error('Error-sent-email: ', error);
                        setSave(false)
                        setDisabled('all')
                    }
                }

                // sent password
                else{
                    try{
                        const response =  await axios.put(`http://127.0.0.1:8000/api/user/${User.id}`,{value : passwordValue,position : position })
                        if(response.data[404] || response.data[422]){
                            console.log('error-reset-password : ', response.data)
                            // setError
                            setModalError(true)
                            setModalErrorDetail({text : 'Reset-password' , detail : response.data})
                            // setDisabled
                            setDisabled('all')
                            setSave(false)
                        }
                        else{
                            console.log('success-reset-password : ', response.data)

                            try{
                                const response = await axios.post(`http://127.0.0.1:8000/api/token`, {history : history_save})
                                if(response.data[404] || response.data[422]){
                                    console.log('error-reset-password : ', response.data)
                                    // set error
                                    setModalError(true)
                                    setModalErrorDetail({text : 'Reset-password' , detail : response.data})
                                    // set disabled
                                    setDisabled('all')
                                    setSave(false) 
                                }
                                else{
                                    console.log('response-reset-password : ' , response.data)
                
                                    //send send token
                                    try{
                                        const response2 = await emailjs.send(
                                            'service_7im7vlo', 'template_nuqayod', 
                                            {
                                                from_name: 'cecezx111@gmail.com',
                                                to_email: User.email,
                                                message: ms,
                                            }, 
                                            'jw32AzeO3ezAw8l91')
                            
                                        if(response2){
                                            console.log('Email sent successfully:', response2);
                                            alert('Please check your email!')
                                            setDisabled('all')
                                            setSave(false) 
                                        }
                                    }
                                    //error send token
                                    catch (error) {
                                        alert('Error-sent-tokens  : ', error)
                                        console.error('Error-sent-tokens  : ', error);
                                        setDisabled('all')
                                        setSave(false)
                                    }
                
                                }
                            }

                            // error sent token
                            catch (error) {
                                alert('Error-save-tokens  : ', error)
                                console.error('Error-save-tokens : ', error);
                                setDisabled('all')
                                setSave(false)
                            }
                        }
                    }
                    // error sent password
                    catch (error) {
                        alert('Error-sent-password  : ', error)
                        console.error('Error-sent-password: ', error);
                        setSave(false)
                        setDisabled('all')
                    }
                }
            }
        }
        fetchData();
    },[save,User,emailValue,passwordValue,position])

    const handleSave = (position) => {
        setSave(true)
        setPosition(position)
    }

    return(
        <>
            <div className='Block-input-content'>
                <div>
                    <b>
                        { setLanguage === "TH" ? "อีเมล" : " Email" } : 
                        <img src="/Icon/edite.svg" className="Button-Edite" onClick={() => setDisabled('email')} alt='...'/>
                    </b>
                    <input className='label-content form-control' type="email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} disabled={disabled !== 'email' || disabled ==='all'}/>
                    {disabled === 'email'?
                        <>
                            <button className='btn btn-success' style={{marginLeft : "1%"}} onClick={() => handleSave('email')}>{ setLanguage === "TH" ? "บันทึก" : " Save" } </button>
                            <button className='btn btn-secondary' style={{marginLeft : "1%"}} onClick={() => setDisabled('all')}>{ setLanguage === "TH" ? "ยกเลิก" : "Cancle"}</button>
                        </>
                    :
                        <></>
                    }
                </div>
                <div> 
                    <b>
                        { setLanguage === "TH" ? "รหัสผ่าน" : "Password"} : 
                        <img src="/Icon/edite.svg" className="Button-Edite" onClick={() => setDisabled('password')} alt='...'/>
                    </b>
                    <input className='label-content form-control' type="password" value={[passwordValue]}  onChange={(e) => setPasswordValue(e.target.value)} disabled={disabled !== 'password' || disabled ==='all'} />
                    {disabled === 'password'?
                        <>
                            <button className='btn btn-success' style={{marginLeft : "1%"}} onClick={() => handleSave('password')}>{ setLanguage === "TH" ? "บันทึก" : " Save" } </button>
                            <button className='btn btn-secondary' style={{marginLeft : "1%"}} onClick={() => setDisabled('all')}>{ setLanguage === "TH" ? "ยกเลิก" : "Cancle"}</button>

                        </>
                    :
                        <></>
                    }
                </div>
            </div>
            <PopupError setModal={ModalError} outModal={() => setModalError(false)}  setDetail={ModalErrorDetail}/>
        </>
    )
}

export default AccountForm;