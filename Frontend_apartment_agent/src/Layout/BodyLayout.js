import About from '../components/About/About.js';
import Contact from '../components/Contact/Contact.js';
import Category from '../components/Category/Category.js';
import Home from '../components/Home/Home.js';
import { Routes, Route, Navigate, useNavigate} from "react-router-dom";
import Paymentform from '../components/Payment/Payment.js';
import ApartmentPageForm from '../components/ApartmentPage/ApartmentPage.js';
import Favoriteform from '../components/Favorite/Favorite.js';
import ReportPage from '../components/Service/ReportPage/ReportPage.js';
import AdminContactForm from '../components/AdminContact/AdminContact.js';
import Test from '../components/testimageForm/Test.js';
import EmailValidate from '../components/EmailValidate/EmailValidate.js';
import ForgoottenValidate from '../components/ForgottenValidate/ForgottenValidate.js';


function BodyLayout( {setSearch , setNotification , setLogin , setPage , setPaymentPage , setPagestate , setLanguage}){
    const navigate = useNavigate();

    const handleApartmentPage = () => {
        navigate('/apartment')
    }
    const handleReservationPage = () => {
        setPage('profile')
        setPagestate('reservation')
    }
    const handlePaymentPage = () => {
        setPage('profile')
        setPaymentPage('payment')
    }


return(
        <>                                   
            <Routes>
                <Route path='/home/*' element={
                    <Home 
                        setSearch={setSearch} 
                        setnotification={setNotification} 
                        setLogin={setLogin} 
                        setApartmentPage={handleApartmentPage} 
                        setReservationPage={handleReservationPage} 
                        setLanguage={setLanguage}
                    />
                }/>
                <Route path='/category' element={ <Category setLanguage={setLanguage} /> } />
                <Route path='/about' element={<About/>} />
                <Route path='/contact' element={<Contact  setLanguage={setLanguage}/>} />
                <Route path='/report' element={<ReportPage setLogin={setLogin} setLanguage={setLanguage} />} />
                <Route path='/apartment' element={<ApartmentPageForm setLogin={setLogin} setNotification={setNotification} setPagestate={setPagestate} setReservationPage={handleReservationPage} setLanguage={setLanguage}/>}/>
                <Route path='/Test' element={<Test/>}/>
                {sessionStorage.getItem('token') || setLogin?
                    <>
                        <Route path='/payment' element={<Paymentform setLogin={setLogin} setPaymentPage={handlePaymentPage} setLanguage={setLanguage}/>} />
                        <Route path='/favorite' element={<Favoriteform setnotification={setNotification} setLogin={setLogin} setReservationPage={handleReservationPage} setLanguage={setLanguage}/>} />
                        <Route path='/AdminContact' element={<AdminContactForm setLogin={setLogin}/>} />
                    </>
                    :
                    <>
                    </>
                }

                <Route path='/validate-email' element={<EmailValidate setLanguage={setLanguage}/>} />
                <Route path='/validate-forgotten' element={<ForgoottenValidate setLanguage={setLanguage}/>} />
                <Route path='*' element={<Navigate to="/home" />} />
            </Routes> 
                 
        </>
    )
}

export default BodyLayout;