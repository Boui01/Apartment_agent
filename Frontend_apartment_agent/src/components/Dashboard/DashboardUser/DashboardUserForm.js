import { Link } from "react-router-dom"
import DashboardUser from "./DashboardUser/DashboardUser"

import DashboardEmployee from "./DashboardEmployee/DashboardEmployee"
import {  useState } from "react";

function DashboardUserForm({setLogin, outDashboard , setLanguage}) {
    const [active , setActive] = useState('user')

    return (
        <>
            <nav className="navbar navbar-dark bg-dark fixed-top">
              <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="offcanvas offcanvas-start text-bg-dark" tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                  <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">{ setLanguage === 'TH' ? 'ผู้ใช้งานทั้งหมด' : 'User Dashboard'}</h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                  </div>
                  <div className="offcanvas-body">
                    <ul className="navbar-nav justify-content-start flex-grow-1 pe-3">
                      <li className="nav-item">
                        <Link className={`nav-link ${active === 'user' ? 'active' : ''}`} aria-current="page" onClick={()=> setActive("user")}>{ setLanguage === 'TH' ? 'สมาชิก' : 'User'}</Link>
                      </li>              
                      <li className="nav-item">
                        <Link className={`nav-link ${active === 'employee' ? 'active' : ''}`}  onClick={()=> setActive("employee")}>{ setLanguage === 'TH' ? 'พนักงาน' : 'Employee'}</Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <button className="btn btn-outline-secondary" onClick={() => outDashboard()}>{ setLanguage === "TH" ? 'กลับ' :'Back'}</button>
              </div>
            </nav>            
            {active === 'user'?
                <DashboardUser setLogin={setLogin} setLanguage={setLanguage}/>
            : active === 'employee' ?
                <DashboardEmployee setLogin={setLogin} setLanguage={setLanguage}/>
            :
            <></>
            }

        </>
    )
}

export default DashboardUserForm