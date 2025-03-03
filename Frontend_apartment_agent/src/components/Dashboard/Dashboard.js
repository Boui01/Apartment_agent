import './Dashboard.css'
import {  useState } from "react";
import DashboardTrash from "./DashboardTrash/DashboardTrash.js";
import DashboardHomeForm from './DashboardHome/DashboardHome.js';
import DashboardUserForm from './DashboardUser/DashboardUserForm.js';
import { useNavigate } from 'react-router-dom';


function DashboardForm({setLogin , setLanguage}) {
    const [trash , setTrash] = useState(false);
    const [dashboard ,setDashboard] = useState(false);
    const [user ,setUser] = useState(false);
    const session_Login = sessionStorage.getItem('token')? JSON.parse(sessionStorage.getItem('token')) : setLogin ;
    const navigator = useNavigate();

    const handleTrash = () => {
        setTrash(true);
    }
    const handleDashboard = () => {
        setDashboard(true);
    }
    const handleUser = () => {
        setUser(true);
    }
    return (
        <>
          {trash ?
            <DashboardTrash outTrash={() => setTrash(false)} setLogin={setLogin} setLanguage={setLanguage}/>
            :
            <>
              {dashboard ?
                <DashboardHomeForm outDashboard={() => setDashboard(false) } setLogin={setLogin} setLanguage={setLanguage}/>
                :
                <>
                  {user && session_Login.status === 'admin' ? 
                    <DashboardUserForm setLogin={setLogin}  outDashboard={() => setUser(false) } setLanguage={setLanguage} />
                    :
                    <>
                      <video autoPlay loop muted className="videoBackground">
                          <source src="..\Video\Dashboard.mp4" type="video/mp4" />
                      </video>
                      <div className="container text-center marginMain">
                        <button onClick={() => navigator('/')} className="btnBack"><h3>{setLanguage === 'TH' ? 'กลับ' : 'Back'}</h3></button>
                        <div className="row align-items-center">
                          <div className="col">
                            <div className="card" style={{width: "18rem"}} onClick={handleTrash}>
                              <div className="card-head">
                                <img src="/icon/trash.svg" className="card-img-top-custom" alt="..."/>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title">{setLanguage === 'TH' ? 'ถังขยะ' : 'Delete Trash'}</h5>
                              </div>
                            </div>
                          </div>
                          <div className="col">
                            <div className="card" style={{width: "18rem"}} onClick={handleDashboard}>
                            <div className="card-head">
                                <img src="/icon/home.svg" className="card-img-top-custom" alt="..."/>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title">{setLanguage === 'TH' ? 'หน้าหลัก' : 'Dashboard'}</h5>
                              </div>
                            </div>
                          </div>
                          <div className="col">
                            <div className="card" style={{width: "18rem"}} onClick={handleUser}>
                            <div className="card-head">
                                <img src="/icon/report.svg" className="card-img-top-custom" alt="..."/>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title">{setLanguage === 'TH' ? 'ผู้ใช้งาน' : 'Dashboard User'}</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  }
                </>
              }
            </>
          }
      </>
    );
}

export default DashboardForm;