import DetectNew from "../../../../Function/DetectNew"
import axios from "axios"
import { useEffect, useState } from "react"
import PopupdashboardHome from "../PopupdashboardHome/PopupdashboardHome"
import 'react-circular-progressbar/dist/styles.css';
import './DashboardHomeProblem.css'
import PopupCustomValue from "../PopupCustomValue/PopupCustomValue";
import DetectText from "../../../../Function/DetectText";
import ProgressChart from "../ProgressChart/ProgressChart";
import DatacreateChart from "../../DatacreateChart/DatacreateChart";

function DashboardHomeProblem ({setLogin , setLanguage}) {
    const [Problem ,setProblem ] = useState([])
    const [Active,setActive] = useState([])
    const [value , setValue] = useState([]);
    const [popup, setPopup] = useState(false)
    const [status, setStatus] = useState(false)
    const [selected , setSelected] = useState([])
    const [customPosition , setCustomPosition] = useState()
    const [customSearch , setCustomSearch] = useState()
    const [viewState , setViewState] = useState('All')
    const [data_chart , setData_chart] = useState([]);
    const list_view = ['All' ,'Permission' ,'Solve', 'Today' , 'This Month' , 'This Year' , 'Custom']
    const list_view_custom = ['ID User','ID Employee','User Name','Employee Name','Content','Type']
    const today = new Date()
    const late_percentage_day = 10;
    const late_percentage_month = 100;
    const late_percentage_year = 1000;
    const percentage_day = (Problem.filter( (item) => (new Date(item.created_at).getDate() === today.getDate())).length * 100) / late_percentage_day  ;
    const percentage_month = (Problem.filter( (item) => ( new Date(item.created_at).getMonth() === today.getMonth())).length  * 100) / late_percentage_month;
    const percentage_year = (Problem.filter( (item) => (new Date(item.created_at).getFullYear() === today.getFullYear())).length  * 100) / late_percentage_year;
    const Login = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : setLogin
  const token = sessionStorage.getItem('token_id') ?  JSON.parse(sessionStorage.getItem('token_id')) : '';

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get('http://localhost:8000/api/problems/dashboard',{ 
                  params: { status_user: Login.status }, // Use 'params' for query parameters
                  headers: {
                    Authorization: `Bearer ${token}`,
                  }
                } 
              )
                if(response.data[422] || response.data[404]){
                  console.log("problems-error : ",response.data)
                }
                else{
                  setProblem (response.data.data)
                  setData_chart( DatacreateChart(response.data.data ,'created_at' , setLanguage = setLanguage) )
                  console.log("problems : ",response.data.data)
                  if(status === true){
                      setActive((previous) => {
                        const filter = previous.filter(item => item !== selected.find(item2 => item === item2))// check value previous equal new data sent
                        const list = filter.length === 0 ? [] : filter // set new value at still data already
                        setValue(response.data.data.filter(check => check.id_problem === list.find(check2 => check.id_problem === check2))) // set for save value has already in list
                        return list;
                      })
                      setStatus(false) // update status to true to fetch data again after status change
                  }
                }
            }
            catch (err) {
                console.error(err)
            }
        }
        fetchData()
    },[status,selected])
  
    const handleActive = (item) => {
        setActive( (previous) => {
            const filter = previous ? previous.includes(item) :false;// check id same
            const filter_out = previous ? previous.find(id => id !== item) : undefined; // remove id same
            const newlist = filter ? filter_out === undefined ? [] : [filter_out] : previous ? [ ...previous,item] : [item];
            setValue(Problem.filter(check => newlist.find(check2 => check.id_problem === check2)))
            console.log('Item :', newlist);
            newlist.sort()
            return newlist;
    
        })
  
      }
  
    const handleSelectAll = () => {
      const list = []

      // Make for have change show data
      Problem.map( item =>                             
        ( viewState ===  'Permission' ? true : viewState === 'Permission 1' ? item.permission === 1 : viewState === 'Permission 2' ? item.permission === 2 : viewState === 'Permission 3' ? item.permission === 3 :                                
          viewState === 'Solve' ? true : viewState === 'Solve null' ? item.solve === null : viewState === 'Solve value' ? item.solve !== null :
          viewState === 'Today' ? new Date(item.created_at).getDate() === today.getDate() :
          viewState === 'This Month' ? new Date(item.created_at).getMonth() === today.getMonth() :
          viewState === 'This Year' ? new Date(item.created_at).getFullYear() === today.getFullYear() :                            
          ( list_view_custom.includes(viewState) && customSearch && customPosition ) ? 
          ( customPosition.InItem ?
             (customPosition.position === 'name' || customPosition.position === 'english_fname' || customPosition.position === 'english_lname' ) ?
                DetectText(item[customPosition.InItem][customPosition.position] , customSearch ,customSearch.length > 1 ? 2 : 1) 
              :
                item[customPosition.InItem][customPosition.position]  === customSearch  
            :  
            (customPosition.position === 'content' || customPosition.position === 'type') ?
              DetectText(item[customPosition.position] , customSearch ,customSearch.length > 1 ? 2 : 1) 
            : 
              item[customPosition.position] === customSearch                                  
          )                                                  
          : true
        ) && 
        (Login.status === 'employee' && item.permission === 3 ? false : true)
        ?
          item.apartment !== null  && item.user !== null?
            list.push(item) : null
          :
            null
      )

      setActive(list.map(item => item.id_problem))
      setValue(list)
      console.log("seleted all : ",list)
    }
    const handleConfirm = () => {
        setPopup(true)
      }
    return(
        <>
          <div style={{marginTop : '3%'}} className="block-main-dashboard-problem">
          <div className="block-title-head-dashboard-problem">
              <h2>{setLanguage === 'TH' ? 'ปัญหา' : 'Problem'}</h2>
              <label className=" text-secondary mb-0" >{setLanguage === 'TH' ? 'จํานวน' : 'Total'} : {Problem.length} </label>
              <label className=" text-secondary" style={{marginLeft : '10px'}} >{setLanguage === 'TH' ? 'ปัญหาใหม่' : 'New'} : {Problem.filter( p => DetectNew(p.created_at , 2 , 1)).length}</label>
              <div className="block-list-view-dashboard" >
                <input type="checkbox" id="checkbox-list-view-dashboard-toggle" className="checkbox-list-view-dashboard" hidden/>
                <label htmlFor="checkbox-list-view-dashboard-toggle" className="button-list-view-dashboard" >{
                  setLanguage === 'TH' ? 
                    viewState === 'All' ? 'ทั้งหมด' :
                    viewState === 'Permission' ? 'สิทธิ์' :
                    viewState === 'Permission 1' ? 'สิทธิ์ 1' :
                    viewState === 'Permission 2' ? 'สิทธิ์ 2' :
                    viewState === 'Permission 3' ? 'สิทธิ์ 3' :
                    viewState === 'Solve' ? 'Solve' :
                    viewState === 'Solve null' ? 'Solve null' :
                    viewState === 'Solve value' ? 'Solve value' :
                    viewState === 'Today' ? 'วันนี้' :
                    viewState === 'This Month' ? 'เดือนนี้' :
                    viewState === 'This Year' ? 'ปีนี้' :
                    viewState === 'Custom' ? 'กําหนดเอง' :
                    viewState === 'ID User' ? 'รหัสผู้ใช้' :
                    viewState === 'ID Employee' ? 'รหัสพนักงาน' :
                    viewState === 'User Name' ? 'ชื่อผู้ใช้' :
                    viewState === 'Employee Name' ? 'ชื่อพนักงาน' :
                    viewState === 'Content' ? 'เนื้อหา' :
                    viewState === 'Type' ? 'ประเภท' :
                    viewState
                  :
                    viewState}</label>
                <ul>
                    {list_view.map((item , index) =>
                      <>
                        {
                         ( viewState === 'Permission' || viewState === 'Permission 1' || viewState === 'Permission 2' || viewState === 'Permission 3'  ) && item === 'Permission' ?
                          <>
                              <li onClick={() => setViewState('All')} className={`active`}>
                                {setLanguage === 'TH' ? 'สิทธิ์' : 'Permission'}
                              </li>
                              <li onClick={() => setViewState('Permission 1')} className={`custom-list-view-dashboard-child ${viewState === 'Permission 1' ? 'active' : ''}`}>
                                {setLanguage === 'TH' ? 'สิทธิ์ 1' : 'Permission 1'}
                              </li>
                              <li onClick={() => setViewState('Permission 2')} className={`custom-list-view-dashboard-child ${viewState === 'Permission 2'? 'active' : ''}`}>
                                {setLanguage === 'TH' ? 'สิทธิ์ 2' : 'Permission 2'}
                              </li>
                              <li onClick={() => setViewState('Permission 3')} className={`custom-list-view-dashboard-child ${viewState === 'Permission 3'? 'active' : ''}`}>
                               {setLanguage === 'TH' ? 'สิทธิ์ 3' : ' Permission 3'}
                              </li>
                            </>
                          : ( viewState === 'Solve' || viewState === 'Solve null' || viewState  === 'Solve value') && item === 'Solve' ?
                            <>
                              <li onClick={() => setViewState('All')} className={`active`}>
                                {setLanguage === 'TH' ? 'การแก้ไข' : 'Solve'}
                              </li>
                              <li onClick={() => setViewState('Solve null')} className={`custom-list-view-dashboard-child ${viewState === 'Solve null'? 'active' : ''}`}>
                                {setLanguage === 'TH' ? 'การรอแก้ไข' : 'Solve null'}
                              </li>
                              <li onClick={() => setViewState('Solve value')} className={`custom-list-view-dashboard-child ${viewState === 'Solve value'? 'active' : ''}`}>
                                {setLanguage === 'TH' ? 'การแก้ไขรายละเอียด' : 'Solve value'}
                              </li>
                            </>
                          : ( viewState === 'Custom' || list_view_custom.includes(viewState) ) && item === 'Custom' ?
                          <>
                              <li onClick={() => setViewState('All')}   className={`active`}>
                                {setLanguage === 'TH' ? 'กําหนดเอง' : 'Custom'}
                              </li>                             
                              { list_view_custom.map((item2 , index2) => (
                                  <li key={index2} onClick={() => setViewState(item2)}   className={`custom-list-view-dashboard-child ${viewState === item2 ? 'active' : ''}`}>
                                    {
                                      setLanguage === 'TH' ?
                                        item2 === 'ID User' ? 'รหัสผู้ใช้งาน' :
                                        item2 === 'ID Employee' ? 'รหัสพนักงาน' :
                                        item2 === 'User Name' ? 'ชื่อผู้ใช้งาน' :
                                        item2 === 'Employee Name' ? 'ชื่อพนักงาน' :
                                        item2 === 'Content' ? 'เนื้อหา' :
                                        item2 === 'Type' ? 'ประเภท' :
                                        ''
                                      :
                                        item2
                                    }
                                  </li>
                              ))
                              }
                              { customPosition && customSearch ?                              
                                  <li onClick={() => (setViewState('All') , setCustomPosition() , setCustomSearch())}   className={`custom-list-view-dashboard-child`}>
                                    {setLanguage === 'TH' ? 'ยกเลิก' : 'Cancle'}
                                  </li>
                                  :
                                  <></>
                              }
                          </>
                          :
                            <>
                              <li onClick={() => setViewState(item)} key={index} className={`${viewState === item ? 'active' : ''}`}>
                                {
                                  setLanguage === 'TH' ? 
                                    item === 'All' ? 'ทั้งหมด' :
                                    item === 'Permission' ? 'สิทธิ์' :
                                    item === 'Solve' ? 'การแก้ไข' :
                                    item === 'Custom' ? 'กําหนดเอง' :
                                    item === 'Today' ? 'วันนี้' :
                                    item === 'This Month' ? 'เดือนนี้' :
                                    item === 'This Year' ? 'ปีนี้' :
                                    item === 'Custom' ? 'กําหนดเอง' :
                                    item
                                  : 
                                    item
                                }
                              </li>
                            </>  
                        }                   

                      </>
                    )}
                </ul>
              </div>
           </div>


           <ProgressChart data={data_chart} percentage_day={percentage_day} percentage_month={percentage_month} percentage_year={percentage_year} title={ setLanguage === 'TH' ? 'ปัญหา' : 'Problem'} setLanguage={setLanguage}/>
           
           {Problem.length > 0 ? 
              <div className="block-btn-select-all-dashboard">
                <button className="btn btn-outline-warning custom-btn-select-all" onClick={handleSelectAll}>{setLanguage === 'TH' ? 'SELECT ALL' : 'SELECT ALL'}</button>
              </div> 
            :
              <>
              </>
            }
          
          <table className="table table-problem-dashboard">
                <thead className="table-head-problem-dashboard">
                    <tr>
                    <th scope="col">{setLanguage === 'TH' ? 'รหัส' : 'ID'}</th>
                    <th scope="col">{setLanguage === 'TH' ? 'เนื้อหา' : 'Content'}</th>
                    <th scope="col">{setLanguage === 'TH' ? 'ประเภท' : 'Type'}</th>
                    <th scope="col">{setLanguage === 'TH' ? 'การแก้ไข' : 'Solve'}</th>
                    <th scope="col">{setLanguage === 'TH' ? 'ผู้ใช้งาน' : 'User'}</th>
                    <th scope="col">{setLanguage === 'TH' ? 'พนักงาน' : 'Employee'}</th>
                    <th scope="col">{setLanguage === 'TH' ? 'สิทธิ์' : 'Permission'}</th>
                    </tr>
                </thead>
                <tbody>
                    {Problem.length > 0 ?
                      <>
                        {// new update data
                          Problem.map( (item,index) => (
                              DetectNew(item.updated_at , 2 , 1) && 
                              ( viewState ===  'Permission' ? true : viewState === 'Permission 1' ? item.permission === 1 : viewState === 'Permission 2' ? item.permission === 2 : viewState === 'Permission 3' ? item.permission === 3 :                                
                                viewState === 'Solve' ? true : viewState === 'Solve null' ? item.solve === null : viewState === 'Solve value' ? item.solve !== null :
                                viewState === 'Today' ? new Date(item.created_at).getDate() === today.getDate() :
                                viewState === 'This Month' ? new Date(item.created_at).getMonth() === today.getMonth() :
                                viewState === 'This Year' ? new Date(item.created_at).getFullYear() === today.getFullYear() :                            
                                ( list_view_custom.includes(viewState) && customSearch && customPosition ) ? 
                                ( customPosition.InItem ?
                                   (customPosition.position === 'name' || customPosition.position === 'english_fname' || customPosition.position === 'english_lname' ) ?
                                      DetectText(item[customPosition.InItem][customPosition.position] , customSearch ,customSearch.length > 1 ? 2 : 1) 
                                    :
                                      item[customPosition.InItem][customPosition.position]  === customSearch  
                                  :  
                                  (customPosition.position === 'content' || customPosition.position === 'type') ?
                                    DetectText(item[customPosition.position] , customSearch ,customSearch.length > 1 ? 2 : 1) 
                                  : 
                                    item[customPosition.position] === customSearch                                  
                                )                                                  
                                : true
                              ) && 
                              (Login.status === 'employee' && item.permission === 3 ? false : true)
                               ?
                              <tr className={`table${Active ? Active.find(id => id === item.id_problem) ? '-active' : '-warning' :'-warning'} column-body-problem-dashboard`} 
                                key={index} onClick={() => item.user ? handleActive(item.id_problem) : alert( setLanguage === 'TH' ? 'ไม่สามารถคลิกได้ถ้าผู้ใช้ถูกลบ' : 'Can not click this has no user')}>
                                  <td >
                                      {Active ? Active.find(id => id === item.id_problem)?
                                        ''
                                        : 
                                        <b style={{color : "#ff9900"}}>{ setLanguage === 'TH' ? 'ใหม่' : 'New'} </b>:
                                        <b style={{color : "#ff9900"}}>{ setLanguage === 'TH' ? 'ใหม่' : 'New'} </b> 
                                      }
                                    {item.id_problem}
                                  </td>
                                  <td >{item.content}</td>
                                  <td >{item.type ? item.type : '-'}</td>
                                  <td >{item.solve ? item.solve : '-'}</td>
                                  <td >{item.user ? item.user.english_fname+'-'+item.user.english_lname : <p className="text-danger">{setLanguage === 'TH' ? 'ลบ' : 'Delete'}</p>}</td>
                                  <td >{item.employee ? item.employee.english_fname+'-'+item.employee.english_lname : '-'}</td>
                                  <td >{item.permission}</td>
                              </tr>
                              : ''
                          ))
                        }
                        {// normal update data
                          Problem.map( (item,index) => (
                              DetectNew(item.updated_at , 1 , 1) &&
                              ( viewState ===  'Permission' ? true : viewState === 'Permission 1' ? item.permission === 1 : viewState === 'Permission 2' ? item.permission === 2 : viewState === 'Permission 3' ? item.permission === 3 :                                
                                viewState === 'Solve' ? true : viewState === 'Solve null' ? item.solve === null : viewState === 'Solve value' ? item.solve !== null :
                                viewState === 'Today' ? new Date(item.created_at).getDate() === today.getDate() :
                                viewState === 'This Month' ? new Date(item.created_at).getMonth() === today.getMonth() :
                                viewState === 'This Year' ? new Date(item.created_at).getFullYear() === today.getFullYear() :                            
                                ( list_view_custom.includes(viewState) && customSearch && customPosition ) ? 
                                ( customPosition.InItem ?
                                  ( customPosition.position === 'name' || customPosition.position === 'english_fname' || customPosition.position === 'english_lname' || customPosition.position === 'content' || customPosition.position === 'type') ?
                                      DetectText(item[customPosition.InItem][customPosition.position] , customSearch ,customSearch.length > 1 ? 2 : 1) 
                                    :
                                      item[customPosition.InItem][customPosition.position]  === customSearch  
                                  :  
                                  (customPosition.position === 'content' || customPosition.position === 'type') ?
                                    DetectText(item[customPosition.position] , customSearch ,customSearch.length > 1 ? 2 : 1) 
                                  : 
                                    item[customPosition.position] === customSearch    
                                )                          
                           
                               : true)
                               ? 
                              <tr className={`table${Active ? Active.find(id => id === item.id_problem) ? '-active' : '' : ''}  column-body-problem-dashboard`} 
                                key={index} onClick={() => item.user ? handleActive(item.id_problem) : alert( setLanguage === 'TH' ? 'ไม่สามารถคลิกได้ถ้าผู้ใช้ถูกลบ' : 'Can not click this has no user')}>
                                  <td>{item.id_problem}</td>
                                  <td >{item.content}</td>
                                  <td >{item.type ? item.type : '-'}</td>
                                  <td >{item.solve ? item.solve : '-'}</td>
                                  <td >{item.user ? item.user.english_fname+'-'+item.user.english_lname : <p className="text-danger">{setLanguage === 'TH' ? 'ลบ' : 'Delete'}</p>}</td>
                                  <td >{item.employee ? item.employee.english_fname+'-'+item.employee.english_lname : '-'}</td>
                                  <td >{item.permission}</td>
                              </tr>
                              :''
                          ))
                        }
                      </>
                      :
                      <>
                          <tr>
                              <td>{ setLanguage === 'TH' ? 'ไม่พบข้อมูล' : 'No data found'}</td>
                          </tr>
                      </>
                    }
                </tbody>
            </table>
            {Active !== null ?
                 Active.length > 0  ? 
                    <button className="btn btn-success m-2 mb-3" onClick={() => handleConfirm()}>{ setLanguage === 'TH' ? 'ยืนยันการลบ' : 'Confirm'}</button>  
                :
                    <></>
            :
            <></>
            }
          </div>
            <PopupdashboardHome setModal={popup} outModal={() => setPopup(false)} setValue={value} outStatus={() => setStatus(true)} setLogin={setLogin} setState={"problem"} outSelect={setSelected} setLanguage={setLanguage}/>
            { list_view_custom.includes(viewState) ?
              <PopupCustomValue 
                setModalState={viewState} outModalState={() => setViewState('All')}
                setCustomPosition={ {table : 'problems' , position : viewState} } outCustomPosition={setCustomPosition}
                outCustomValue={setCustomSearch}
                setLanguage={setLanguage}
              />
            :
              <></>
          }
        </>
    )
  }
  
  export default DashboardHomeProblem