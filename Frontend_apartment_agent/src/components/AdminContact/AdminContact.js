import { useState } from "react";
import './AdminContact.css';
import io from 'socket.io-client';
import { useEffect } from "react";
import 'react-circular-progressbar/dist/styles.css';

const socket = io(/*'http://localhost:3001'*/);
function AdminContactForm ({ setLogin } ) {
    const [sendRequest , setSendRequest] = useState({})
    const [countSendRequest , setCountSendRequest] = useState(0)
    const [reConnect, setReConnect] = useState(false)
    const [confirm , setConfirm] = useState(false)
    const Image = sessionStorage.getItem('token_image') ? JSON.parse(sessionStorage.getItem('token_image')) : ''
    const Login = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : setLogin

    /////////////////////////////// Reset //////////////////////////////
    //sessionStorage.removeItem('user_online_contact')
    //sessionStorage.removeItem('chat')

    ///// Reconnect real time //////
    useEffect(() => {
        const interval = setInterval(() => {
            const session_Data = sessionStorage.getItem('user_online_contact');
            const Json_fix = JSON.parse(session_Data)
            setReConnect(Json_fix ? true : false)
            //console.log('Reconnect  check : ', Json_fix)
            //console.log('Session real time : ' , JSON.parse(session_Data));
        }, 200);

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, []);



    useEffect(() => {
        console.log('Session real time : ' , JSON.parse(sessionStorage.getItem('user_online_contact')),'Count Request : ',countSendRequest);

        socket.on('request-message', (msg) => {
            /// set request for close page    
            if(msg.request && msg.id === Login.id){
                sessionStorage.setItem('user_online_contact', JSON.stringify({id_room : msg.id_room, info : ''}))
            }
            else{
                setSendRequest( {request : true , id : msg.id ,fname : msg.fname , lname : msg.lname})
            }
            console.log('Waitting Page - request : ','response : ',msg.response,'request : ',msg.request ,'id : ',msg.id,'fname : ',msg.fname ,'lname : ',msg.lname  );
        });

        socket.on('connect-message', (msg) => {
            const list_user_request = msg.user_request;
            const list_user_response = msg.user_response;
            const list_user = [list_user_request , list_user_response];
            const room = {id_room : msg.id_room , info : list_user}
            sessionStorage.setItem('user_online_contact' , JSON.stringify(room))
            console.log('check : ',room)
            const check_user = (Login.id === list_user_request.id ||Login.id ===  list_user_response.id) && (Login.status === list_user_request.status || Login.status === list_user_response.status) ? true : false
            setConfirm( check_user);
            
            console.log('Waitting Page - connect: ','response : ',msg.response,'id : ',msg.id,'fname : ',msg.fname ,'lname : ',msg.lname );
        });

        socket.on('reconnect-message', (msg) => {
            const check_reconnect = (Login.id === msg.user_request.id || Login.id ===  msg.user_response.id) && (Login.status === msg.user_request.status || Login.status === msg.user_response.status) ? true : false
            if(check_reconnect){
                const data_user_reconnect = [msg.user_request,msg.user_response]
                const list_user_reconnect = {id_room : msg.id_room ,info : data_user_reconnect}
                const chat_user_reconnect = msg.info.map( (info) => ({...info , time : new Date(info.time).toLocaleString()})  ) // fix to time to new Date
                sessionStorage.setItem('chat', JSON.stringify(chat_user_reconnect));
                sessionStorage.setItem('user_online_contact' , JSON.stringify(list_user_reconnect))
                setConfirm( true );
            }
            console.log('Waitting Page - reconnect: ',msg.user_request,msg.user_response, sessionStorage.getItem('chat') );
        });
        socket.on('disconnect-message', (msg) => {
            console.log('Waitting Page - disconnect : ' , msg.message);

        })

        return () => {
            socket.off('request-message');
            socket.off('reconnect-message');
            socket.off('connect-message');
            socket.off('disconnect-message');
        };
    }, [Login,countSendRequest]);


    const sendRequestToServer = () => {
        setCountSendRequest(1);
        const message = {response : true , request : false ,id : Login.id,  fname : Login.fname , lname : Login.lname,  status : Login.status , image : Image }
        socket.emit('request-message', message);
    }

    const reConnectToserver = () => {
        const session_online = JSON.parse(sessionStorage.getItem('user_online_contact'));
        const message = {id_room : session_online.id_room , response : true, request : true ,id : Login.id,  fname : Login.fname , lname : Login.lname,  status : Login.status }
        socket.emit('reconnect-message', message);
    }
    const sendConfirm = () => {
        const message = {response : true , id : Login.id ,fname : Login.fname , lname : Login.lname,  status : Login.status , id_user_request : sendRequest.id , image : Image }
        socket.emit('connect-message', message);
    };

    return(
        <>
            <video autoPlay loop muted className="videoBackground">
                <source src="..\Video\Dashboard.mp4" type="video/mp4" />
            </video>
            {confirm ?
                <>
                    <AdminContact setLogin={Login}/>
                </>
            :
                <>
                    <div style={{position : "relative", display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop : '20%'}}>
                     {reConnect ?
                        <>            
                             <div className="spinner-grow" style={{width: '3rem',height: '3rem'}} role="status">
                                <span className="visually-hidden">Loading...</span>
                             </div> 
                             <p style={{marginTop : 10}}>...Waitting for reconnect</p>            
                            <button className="btn btn-warning" onClick={reConnectToserver}>Reconnect</button>
                        </>
                        :
                        <>
                            <>
                                { countSendRequest === 0?
                                    sendRequestToServer()
                                    :
                                    <>
                                        {Login.status === 'employee' || Login.status === 'admin' ?
                                            sendRequest.request ?
                                                <>
                                                    <div className="block-img-profile-AdminContact">
                                                        <img width={'100%'} src={'./Image/Home_ImageSlide_2.jfif'} alt=""/>
                                                    </div>
                                                    <p style={{color : '#9c9c9c' , marginTop : 5}}>
                                                        {sendRequest.fname +'   '+sendRequest.lname}
                                                    </p>
                                                    <button className="btn btn-warning" onClick={sendConfirm}>Confirm</button>
                                                </>
                                            :
                                                <>
                                                    <div className="spinner-grow" style={{width: '3rem',height: '3rem'}} role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <p style={{marginTop : 10}}>...Waitting for customer request</p>
                                                </>
                                        :

                                                <>
                                                    <div className="spinner-grow" style={{width: '3rem',height: '3rem'}} role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <p style={{marginTop : 10}}>...Waitting for admin response</p>
                                                </>
            
                                        }
                                    </>
                                }
                            </>
                        </>
                    }
                </div>
            </>
            }
        </>
    )
}

function AdminContact ( {setLogin} ) {
    const [chat, setChat] = useState(sessionStorage.getItem('chat') ? JSON.parse(sessionStorage.getItem('chat')) : []);
    const [text , setText] = useState('');
    const session_online = JSON.parse(sessionStorage.getItem('user_online_contact'))
    const [active , setActive] = useState(true)
    const toDay = new Date();

    ///// Active  real time //////
    useEffect(() => {
        const interval = setInterval(() => {
            socket.emit('active-message', setLogin.id);
            setActive(false);
            //console.log('Session real time : ' , JSON.parse(session_Data));
        }, 30000);

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, [setLogin]);

    useEffect(() => {
        socket.on('message', (msg) => {
            setText('');
            setChat((prev) => {
               const updated = [...prev,{ id_room :  msg.id_room , message : msg.message , status : msg.status,id : setLogin.id, fname : msg.fname , lname : msg.lname , time : new Date(msg.time) }];
               sessionStorage.setItem('chat',JSON.stringify(updated))
               return updated;
            });
            console.log('Admin Page : ' , msg.status , msg.message);
        });

        socket.on('active-message', (msg) => {
            const new_list = session_online.info.filter( user => user.status !== setLogin.status).map(user => user.id);
            const check = new_list.includes(msg.id)
            if(check){
                setActive(true)
            }

            console.log('Admin Page - active: ' ,check,new_list,msg.id);
        });

        return () => {
            socket.off('message');
        };
    },[setLogin,session_online])

    const sendMessage = (e) => {
        e.preventDefault();
        const message = {id_room : session_online.id_room , message : text ,  status : setLogin.status,id : setLogin.id, fname : setLogin.fname , lname : setLogin.lname , time : toDay}
        socket.emit('message', message);
    };

    //

    return ( 
        <>
            <div id="container-chat-contact">
                <aside>
                    <header>
                        <h5 className="headbar-chat-contact">
                            contact
                        </h5>
                    </header>
                    <ul>
                        <li>
                            <img src={`${session_online.info.filter(item =>  item.status !== setLogin.status ).map(item => item.image)}`} alt="..." width={'20%'} height={'auto'}/>
                            <div>
                                <h2>{session_online.info.filter(item =>  item.status !== setLogin.status ).map(item => item.fname+' '+item.lname)}</h2>
                                <h3>
                                    {  active ?
                                        <>                               
                                            <span className="status green"></span>
                                            online
                                        </>  
                                    :
                                        <>
                                            <span className="status orange"></span>
                                            offline
                                        </>
                                    }

                                </h3>
                            </div>
                        </li>
                    </ul>
                </aside>
                <div className="Main-chat-contact">
                    <div className="Head-chat-contact">
                    <img src={`${session_online.info.filter(item =>  item.status === setLogin.status ).map(item => item.image)}`} alt="..." width={'13%'} height={'auto'}/>
                        <div>
                            <h2>{setLogin.fname + '-' + setLogin.lname}</h2>
                            <h3>{chat.length > 0 ? 
                                    chat.filter(item => item.id_room === session_online.id_room).map( item => item.message).length 
                                : 0 +' Message'
                                }
                            </h3>
                        </div>
                    </div>
                    <ul id="chat">
                        { chat.length > 0 ?
                            chat.map((item,index) => (
                                <div  key={index}>
                                    {
                                        item.id_room === session_online.id_room ?
                                            <div>
                                                {( item.status !== 'admin' && setLogin.status === 'admin' ) || (item.status !== 'user' && setLogin.status === 'user')  || (item.status !== 'employee' && setLogin.status === 'employee')?
                                                    <li className="you">
                                                        <div className="entete">
                                                            <span className="status green"></span>
                                                            <h2>{item.fname}</h2>
                                                            <h3>&nbsp;{item.time.toLocaleString()}</h3>
                                                        </div>
                                                        <div className="triangle"></div>
                                                        <div className="message">
                                                            {item.message}
                                                        </div>
                                                    </li>                                    
                                                :
                                                    <li className="me">
                                                        <div className="entete">
                                                            <h3>{item.time.toLocaleString()}&nbsp;</h3>
                                                            <h2>{setLogin.fname}</h2>
                                                            <span className="status blue"></span>
                                                        </div>
                                                        <div className="triangle"></div>
                                                        <div className="message">
                                                            {item.message }
                                                        </div>
                                                    </li>
                                                }
                                            </div>
                                        :
                                        <>
                                        </>
                                    }
                                </div>
                            ))
                        :
                        <>
                        </>
                    }

                    </ul>
                    <div className="footer-chat-contact">
                        <form onSubmit={sendMessage}>
                            <textarea placeholder="Type your message" name="message_input" value={text} onChange={(e) => setText(e.target.value)}></textarea>
                            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_picture.png" alt=""/>
                            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_file.png" alt=""/>
                            <button type="submit" className="a-link-chat-contact" disabled={text === ''}>Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminContactForm;