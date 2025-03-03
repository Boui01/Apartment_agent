import { Link } from "react-router-dom";
import NavbarHead from '../components/Navbar/NavbarHead/NavbarHead';



function HeadLayout( {setPage , searchData , setNotification , setLogin , setPagestate , outPagestate , setLanguage} ) {

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark" style={{paddingBottom:15}}>
                <div className="container-fluid bg-dark" >
                    <Link className="navbar-brand " to="home">
                        <img src='/icon/home.png' alt='' width={50} height={50}/>
                    </Link>
                    <NavbarHead 
                        setnotification={ setNotification } 
                        setSearchData={searchData} 
                        setPage={setPage} 
                        setLogin={setLogin} 
                        setPagestate={setPagestate } 
                        outPagestate={outPagestate}
                        setLanguage={setLanguage}
                    />
                </div>
            </nav>
        </>
        
    );
    }

export default HeadLayout;
