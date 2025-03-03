import React, { useEffect, useState} from 'react';
import './MainLayout.css'
import HeadLayout from './Layout/HeadLayout.js';
import BodyLayout from './Layout/BodyLayout.js';
import FooterLayout from './Layout/FooterLayout.js';
import RegisterForm from './components/Register/Register.js';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import DashboardForm from './components/Dashboard/Dashboard.js';
import ProfileForm from './components/User/Profile/Profile.js';
import AccountForm from './components/User/Account/Account.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';


function MainLayout( ) {
    const [Page,setPage] = useState('');
    const [PositionPage , setPositionPage] = useState();
    const [Search,setSearch] = useState('');
    const [notification,setnotification] = useState('');
    const [login , setLogin] = useState();
    const [language , setLanguage] = useState();
    const user = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem("token")) : login
    const session = sessionStorage.getItem('token_remember');
    const navigate = useNavigate();


    // Set login with false remember
    useEffect( () => {
        const session_Login = JSON.parse(sessionStorage.getItem("token"))
        // Set for waiting reload page
        setTimeout(() => {
            if(session_Login && session) {
                setLogin(session_Login)
                console.log('SETLogin :', login);
                sessionStorage.removeItem('token_remember');
                sessionStorage.removeItem('token')
            }
        },1000)
    },[session,login])

    ///// Delete  real time //////
    useEffect(() => {
        const interval = setInterval(async ()  => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/tokens/delete')
                console.log('Token delete 1 Hour : ', response.data)
            } catch (error) {
                console.log('Error Token delete 1 Hour : ', error)
            }

        }, (60 * 60 * 1000)); // 1 hour

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, []);

    ///// Language  real time //////
    useEffect(() => {
        const interval = setInterval(() => {
            const language = sessionStorage.getItem('language');
            if(language) {
                setLanguage(language);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if(Page === 'dashboard'){
            navigate('/dashboard')
        }
        else if(Page === 'profile'){
            navigate('/profile')
        }
        else if(Page === 'account'){
            navigate('/account')
        }

    },[Page , PositionPage])
    


    return (
        <>  
            <Routes>
                <Route path='*' element={
                    <>
                        <HeadLayout 
                            setPage={setPage} 
                            searchData={setSearch} 
                            setNotification={notification} 
                            setLogin={login} 
                            setPagestate={PositionPage} 
                            outPagestate={setPositionPage} 
                            setLanguage={setLanguage}
                        />   
                        <BodyLayout 
                            setSearch={Search} 
                            setNotification={setnotification} 
                            setLogin ={login} setPage={setPage} 
                            setPaymentPage={setPositionPage} 
                            setPagestate={setPositionPage} 
                            setLanguage={language}
                        />
                        <FooterLayout /> 
                    </>
                } />
                
                <Route path='/register' element={ <RegisterForm setLogin={login} setLanguage={language}/>}  />
                {
                    user?.status === 'user' || user?.status === 'employee' || user?.status === 'admin' ?
                        <>
                            <Route path='/profile' element={<ProfileForm setLogin={login} setState={PositionPage} outState={setPositionPage} setLanguage={language}/>} />
                            <Route path='/account' element={<AccountForm setLogin={login} setLanguage={language}/>} />
                            {
                                user?.status === 'employee' || user?.status === 'admin' ?
                                    <Route path='/dashboard' element={<DashboardForm setLogin={login} setLanguage={language}/>} />
                                :
                                    <></>
                            }
                        </>
                    :
                        <></>
                }
            </Routes>      
        </>
        
    );
    }

export default MainLayout;
