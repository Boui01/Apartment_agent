import { useEffect, useState } from "react";
import RandomNum from "../../../Function/RandomNum";
import "../ImageSlide/ImageSlide.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ImageSlideForm( {setImage} ) {
    const image = Object.values(setImage);
    const [Click , setClick] = useState();
    const [NumRandom , setNumRandom] =  useState({1 : 0 , 2 : 0 , 3 : 0})
    const navigate = useNavigate();

    useEffect(() => {
        const freshdata = async () => {
             if(Click){
                 console.log("Click",Click)
                 try{
                     const response = await axios.get(`http://127.0.0.1:8000/api/data/${Click.apartment_id}`)
                     if (response.data[404] || response.data[422]) {
                         console.log('error response apartment category :',response.data)
                         setClick()
                     }
                     else{
                        console.log('response apartment category : ' , response.data)
                        sessionStorage.setItem('apartmentPageValue' , JSON.stringify({data : response.data.data , service : response.data.service , image : response.data.image }) )
                        navigate(`/apartment`) 
                        setClick() 
                    }

                 }
                 catch(error){
                     console.log(error)
                 }
             }
        } 


        freshdata()
     },[Click,navigate])

    useEffect(() => {
        setNumRandom({1 : RandomNum(0,image.length-1) , 2 : RandomNum(0,image.length-1) , 3 : RandomNum(0,image.length-1)}) 
    },[setImage])

    const handleClick = (id) => {
        setClick({apartment_id : id})
    }

    const getKeys = (obj) => {
        const keys = Object.keys(obj)
        console.log(keys)
        return keys
    }
   
    return(
        <>
            <div id="carouselExample" className="carousel slide">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src={ image[NumRandom[1]] !== undefined ? 'data:image/jpeg;base64,'+  image[NumRandom[1]] : '/Image/null.jpg'} className="d-block custom-img" alt='...' onClick={() => handleClick( getKeys(setImage)[NumRandom[1]] ) }/>
                    </div>
                    <div className="carousel-item">
                        <img src={ image[NumRandom[2]] !== undefined? 'data:image/jpeg;base64,'+  image[NumRandom[2]] : '/Image/null.jpg'} className="d-block custom-img" alt="..." onClick={() => handleClick( getKeys(setImage)[NumRandom[2]] ) }/>
                    </div>
                    <div className="carousel-item">
                        <img src={ image[NumRandom[3]] !== undefined? 'data:image/jpeg;base64,'+  image[NumRandom[3]] : '/Image/null.jpg'} className="d-block custom-img" alt="..." onClick={() => handleClick( getKeys(setImage)[NumRandom[3]] ) }/>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </>
    )
}

export default ImageSlideForm;