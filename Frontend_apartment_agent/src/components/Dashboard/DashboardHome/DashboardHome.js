import { Link } from "react-router-dom"
import { useState } from "react"
import DashboardHomeReservation from "./DashboardHomeReservation/DashboardHomeReservation"
import DashboardHomePayment from "./DashboardHomePayment/DashboardHomePayment"
import DashboardHomeProblem from "./DashboardHomeProblem/DashboardHomeProblem"
import DashboardHomeApartment from "./DashboardHomeApartment/DashboardHomeApartment"

function DashboardHomeForm ( {outDashboard,setLogin , setLanguage}) {
    const [status , setStatus] = useState(false)
    const [active , setActive] = useState('home')
    return(
        <>
            <nav className="navbar navbar-dark bg-dark fixed-top">
              <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="offcanvas offcanvas-start text-bg-dark" tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                  <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">{setLanguage === 'TH' ? 'หน้าหลัก' : 'Home Dashboard'}</h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                  </div>
                  <div className="offcanvas-body">
                    <ul className="navbar-nav justify-content-start flex-grow-1 pe-3">
                      <li className="nav-item">
                        <Link className={`nav-link ${active === 'home' ? 'active' : ''}`} aria-current="page" onClick={()=> setActive("home")}>{setLanguage === 'TH' ? 'จองห้องพัก' : 'Reservation'}</Link>
                      </li> 
                      <li className="nav-item">
                        <Link className={`nav-link ${active === 'apartment' ? 'active' : ''}`}  onClick={()=> setActive("apartment")}>{setLanguage === 'TH' ? 'อพาร์ตเม้นท์' : 'Apartmnet'}</Link>
                      </li>                                   
                      <li className="nav-item">
                        <Link className={`nav-link ${active === 'payment' ? 'active' : ''}`}  onClick={()=> setActive("payment")}>{setLanguage === 'TH' ? 'การชําระเงิน' : 'Payment'}</Link>
                      </li>
                      <li className="nav-item">
                        <Link className={`nav-link ${active === 'problem' ? 'active' : ''}`}  onClick={()=> setActive("problem")}>{setLanguage === 'TH' ? 'ปัญหาการใช้งาน' : 'Problem'}</Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <button className="btn btn-outline-secondary" onClick={() => outDashboard()}>{setLanguage === 'TH' ? 'กลับหน้าหลัก' : 'Back'}</button>
              </div>
            </nav>
            {
            active === 'home'?
              <DashboardHomeReservation setLogin={setLogin} outStatus={setStatus} setLanguage={setLanguage}/>
            : active === 'apartment' ?
              <DashboardHomeApartment setStatus={status} setLogin={setLogin} setLanguage={setLanguage}/>
            : active === 'payment' ?
              <DashboardHomePayment setStatus={status} setLogin={setLogin} setLanguage={setLanguage}/>
            : active === 'problem' ?
              <DashboardHomeProblem setStatus={status} setLogin={setLogin} setLanguage={setLanguage}/>
            :
            <></>
            }
        </>
    )
}





export default DashboardHomeForm