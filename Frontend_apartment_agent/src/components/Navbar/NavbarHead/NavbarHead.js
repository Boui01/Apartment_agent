import React, {  useEffect, useState} from 'react';
import { Link, useNavigate } from "react-router-dom";

import Search from '../../Search/Search.js';
import LoginForm from '../../Login/Login/Login.js';
import ReportPDF from '../../ReportPDF/ReportPDF.js';
import './NavbarHead.css';

function NavbarHead ({ setnotification , setSearchData , setPage , setLogin , setPagestate ,outPagestate , setLanguage}){
    const [notifications , setNotifications] = useState(0);
    const [tokens,setToken] = useState(sessionStorage.getItem('token'));
    const [active , setActive] = useState("home");
    const [hover, setHover] = useState();
    const [showModalPDF , setShowModalPDF] = useState(false)
    const [versionLanguage , setVersionLanguage] = useState("EN");
    const navigation = useNavigate();


    useEffect(() => {
        const selectedItems = sessionStorage.getItem('selected');
        console.log("Notification : " ,selectedItems)
        if (selectedItems) {
            const parsedItems = JSON.parse(selectedItems);
            setNotifications(parsedItems.length);
        }
        else{
            setNotifications(0);
        }
    }, [setnotification]);


    useEffect(() => {
        const language = sessionStorage.getItem('language');
        if(language) {
            setLanguage(language);
            setVersionLanguage(language);
        }
        else{
            setLanguage(versionLanguage);
            setVersionLanguage(versionLanguage);
            sessionStorage.setItem("language" , versionLanguage);
        }
        console.log("Language : " , language )

    }, [versionLanguage]);


    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('selected');
        sessionStorage.removeItem('selected_detail');
        sessionStorage.removeItem('selected_payment');
        sessionStorage.removeItem('user_online_contact');
        sessionStorage.removeItem('token_bank');
        sessionStorage.removeItem('chat');       
        setToken(null);
        window.location.reload();
    };
   const handleRegister = () => {
        setPage("register")
        navigation('/register')  
   }
   const handleFavorite = (e) => {
        e.preventDefault();
        navigation('/favorite')  
    };
   const handlePayment = (e) => {
        e.preventDefault();
        navigation('/payment')  
   };
   const handleActive = (page) => {
        setActive(page)
    };
    const handleDashboard = () => {
        setPage('dashboard')
        navigation('/dashboard')
    }
    const handleProfile = () => {
        setPage('profile')
        navigation('/profile')
    }
    const handleAccount = () => {
        setPage('account')
        navigation('/account')
    }


    return (
            <>
                <div className="collapse navbar-collapse " id="navbarNavAltMarkup" >
                    <div className="navbar-nav ">
                        <Link className={`nav-link ${active === "home" ? 'active' : ''}`} onClick={() =>handleActive("home")} aria-current="page" to="/home">{ versionLanguage === "TH" ? "หน้าแรก" : "Home"}</Link>
                        <Link className={`nav-link ${active === "category" ? 'active' : ''}`} onClick={() =>handleActive("category")} to='/category'>{ versionLanguage === "TH" ? "หมวดหมู่" : "Category"}</Link>
                        <Link className={`nav-link ${active === "about" ? 'active' : ''}`} onClick={() =>handleActive("about")} to="/about">{ versionLanguage === "TH" ? "เกี่ยวกับ" : "About"}</Link>
                        <Link className={`nav-link ${active === "contact" ? 'active' : ''}`} onClick={() =>handleActive("contact")} to="/contact">{ versionLanguage === "TH" ? "ติดต่อ" : "Contact"}</Link>
                        <li className='nav-item dropdown'>
                            <div className=' nav-link dropdown-toggle'role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            { versionLanguage === "TH" ? "เพิ่มเติม" : "Service"}
                            </div>
                            <ul className="dropdown-menu">
                                <li><Link className={`dropdown-item ${active === "report" ? 'active' : ''}`} onClick={() =>handleActive("report")} to="/report" >{ versionLanguage === "TH" ? "รายงานปัญหา" : "Report"}</Link></li>
                            </ul>
                        </li>
                        <div className="form-check form-switch m-2">
                            <input className="form-check-input custom-checkbox-versionlanguage"
                                type="checkbox" role="switch" 
                                checked={versionLanguage === "TH" ? true : false} 
                                id="flexSwitchCheckDefault" 
                                onChange={() => setVersionLanguage(() => {
                                    const result = versionLanguage === "TH" ? "EN" : "TH"

                                    sessionStorage.setItem("language" , result);
                                    return result
                                })}
                            />
                            <label className="form-check-label text-light" htmlFor="flexSwitchCheckDefault">{versionLanguage}</label>
                        </div>
                        <div className="navbar-nav" style={{ position: "absolute",right : 10}}>
                            <Search setData={setSearchData} setLanguage={versionLanguage}/>                              
                            {setLogin || tokens ?
                                <>                              
                                    <nav className="navbar bg-dark">
                                        <div className="container-fluid justify-content-start">
                                            <form style={{marginRight : 15}} onSubmit={handleFavorite}>
                                                <button type="submit" className="btn btn btn-success position-relative">
                                                    { versionLanguage === "TH" ? "ชื่นชอบ" : "Favorite"}
                                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                        {notifications}
                                                        <span className="visually-hidden">unread messages</span>
                                                    </span>
                                                </button>
                                            </form>
                                            {(tokens ? JSON.parse(tokens).status : '') === 'admin' || (tokens ? JSON.parse(tokens).status : '') === 'employee' || (setLogin ? setLogin.status : '') === 'admin' || (setLogin ? setLogin.status : '') === 'employee'?
                                                <>       
                                                    <button className="btn btn-outline-light" onClick={handleDashboard} style={{marginRight : 15}}>{ versionLanguage === "TH" ? "หน้ารายงาน" : "Dashboard"}</button>
                                                    {((tokens ? JSON.parse(tokens).status : '') === 'admin') || ((setLogin ? setLogin.status : '') === 'admin') ?
                                                        <>                                                    
                                                            <button className="btn btn-outline-danger" onClick={() => setShowModalPDF(true)} style={{marginRight : 15}}>{ versionLanguage === "TH" ? "ออกรายงาน" : "Report PDF"}</button>
                                                            <ReportPDF setShowModal={showModalPDF} setHideModal={() => setShowModalPDF(false)} setLogin={setLogin}/>
                                                        </>
                                                        :
                                                        <></>
                                                    }
                                                </>
                                                :
                                                <>
                                                </>
                                            }
                                            <form onSubmit={handlePayment} style={{marginRight : 30}} >
                                                <button className="btn btn-outline-warning" >{ versionLanguage === "TH" ? "รายการชําระเงิน" : "Payment"} </button>
                                            </form>
                                            <div className={`text-user-hover ${hover === 'profile'? 'text-user-hover-up' : 'text-user-hover-down'}`}>
                                                <p style={{color:'#16da78',marginBottom : 0}}>{ versionLanguage === "TH" ? "อีเมลล์" : "Email : "} <label style={{color:'white'}}>{tokens?JSON.parse(tokens).email : setLogin.email}</label></p>  
                                                <p style={{color:'#16da78'}}>{ versionLanguage === "TH" ? "ชื่อ - นามสกุล : " : "Name : "}<label style={{color:'white'}}>{ 
                                                versionLanguage === "TH" ? 
                                                    tokens ?  JSON.parse(tokens).th_fname +' - '+ JSON.parse(tokens).th_lname 
                                                    : setLogin.th_fname +' - '+ setLogin.th_lname 
                                                : 
                                                    tokens ?  JSON.parse(tokens).fname +' - '+ JSON.parse(tokens).lname 
                                                    : setLogin.fname +' - '+ setLogin.lname }</label></p>
                                            </div>
                                            <div className="dropdown-center" style={{marginRight : 10, textAlign: 'center'}} >
                                                <div className='btn btn-light btn-profile' data-bs-toggle="dropdown" aria-expanded="false" style={{borderRadius : "100%"}} onMouseEnter={()=> setHover('profile')} onMouseLeave={() => setHover()}>
                                                    <img  src='./icon/person.svg' style={{width : "100%" , height : 25  }} alt='...'/>
                                                </div>
                                                <ul className="dropdown-menu text-center"  style={{ left: "50%", transform: "translateX(-65%)",cursor : 'pointer' }}>
                                                    <li className="dropdown-item " onClick={handleProfile}>{ versionLanguage === "TH" ? "โปรไฟล์" : "Profile"}</li>
                                                    <li className="dropdown-item" onClick={handleAccount} >{ versionLanguage === "TH" ? "บัญชี" : "Account"}</li>
                                                    <li className="dropdown-item" onClick={handleRegister} >{ versionLanguage === "TH" ? "สมัครสมาชิก" : "Sigin"}</li>
                                                    <li className="dropdown-item" onClick={handleLogout}>{ versionLanguage === "TH" ? "ออกจากระบบ" : "Logout"}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </nav>
                                </> 
                                :   
                                <>  
                                    <LoginForm setPagestate={setPagestate} outPagestate={outPagestate} setLanguage={versionLanguage}/>
                                    <form onSubmit={handleRegister}>
                                        <button className="btn btn-sm btn-outline-secondary" style={{margin: (13)}} type='submit' >{ versionLanguage === "TH" ? "สมัครสมาชิก" : "Sigin"}</button>
                                    </form>                                                           
                                    
                                </>  
                                
                            }
                        </div>   
                    </div>
                </div>

              </>
            )
}

export default NavbarHead;