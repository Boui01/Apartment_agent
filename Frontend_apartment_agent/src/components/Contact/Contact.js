import { useState } from 'react'
import './Contact.css'
import PopupContact from './PopupContact/PopupContact'

function Contact( { setLanguage } ){
    const [popup , setPopup] = useState(0)
    const [showModal , setShowModal] = useState(false)

    const handlePopup = (n) => {
        setPopup(n)
        setShowModal(true)
    }
    return(
        <>  
            <div class="container-contact">
                <div class="box">
                    <span></span>
                    <div class="content">
                        <h2>{setLanguage === 'TH' ? 'ผู้พัฒนา' : 'Developer'}</h2>
                        <p>{setLanguage === 'TH' ? 'นายณัฐพล อัศวาภิรมย์' : 'Natthapol Assawapirom'}</p>
                        <button className='btn-contact' onClick={() => handlePopup(1)}>{setLanguage === 'TH' ? 'ติดต่อ' : 'Contact'}</button>
                    </div>
                </div>
                <div class="box">
                    <span></span>
                    <div class="content">
                        <h2>{setLanguage === 'TH' ? 'ผู้จัดทําหนังสือ' : 'Book drafter'}</h2>
                        <p>{setLanguage === 'TH' ? 'นายธนัชชัย สรีเพชรโฮ' : 'Thanunchai Sripechtho'}</p>
                        <button className='btn-contact' onClick={() => handlePopup(2)}>{setLanguage === 'TH' ? 'ติดต่อ' : 'Contact'}</button>
                    </div>
                </div>
                <div class="box">
                    <span></span>
                    <div class="content">
                        <h2>{setLanguage === 'TH' ? 'อีเมล์' : 'Email'}</h2>
                        <p>{setLanguage === 'TH' ? 'อีเมล์ทางการ สําหรับติดต่อกับผู้ดูแล' : 'Email official for contact with admin.'}</p>
                        <button className='btn-contact' onClick={() => handlePopup(3)}>{setLanguage === 'TH' ? 'ติดต่อ' : 'Contact'}</button>
                    </div>
                </div>
            </div>
            <PopupContact setShowModal={showModal} outShowModal={() => setShowModal(false)} popupNum={popup} setLanguage={setLanguage}/>
        </>
    )
}

export default Contact