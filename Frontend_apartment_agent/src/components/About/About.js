import { useState } from 'react';
import './About.css';   
function About(){
	const [isShow, setIsShow] = useState(1);
	const [page, setPage] = useState(false);

	const handleClickNext = () => {
		setIsShow( isShow + 1 );
		setPage( false);
	}
	const handleClickBack = () => {
		setPage( true );
		setTimeout(() => {
			setPage( false );
			setIsShow( isShow - 1 );
		},1500)
	}
    return(
        <>	
			<video autoPlay loop muted className='videoBackground-about'>
				<source src="..\Video\About.mp4" type="video/mp4" />
			</video>
			<main className='main-about'>
				<div className="book">
					<div className="book-cover">
						<div>
							<h1 className='book-title-h1'>Mr. Bou</h1>
							<div className="separator"></div>
							<h2 className='book-title-h2'>by Natthapol Assawapirom</h2>
						</div>
					</div>
					<>
					{isShow === 1 ?
						<>
							<div className='book-content'>
								<h3 className='book-content-title-h3'>Hello , My name is Bou</h3>
								<h6 className='book-content-title-h3'>about Developer</h6>
								<p  className='book-content-body'>This is project end of graduated from Southeast University in IT department. I am Web Developer this website.</p>					
								<h6 className='book-content-title-h3'>Language Program</h6>
								<p  className='book-content-body'>This web use 3 framework for make this website React and laravel and CSS framework is Bootstratp.</p>
								<h6 className='book-content-title-h3'>aboute website</h6>	
								<p  className='book-content-body'>This website about buyer and seller of Apartment for easy to find between buyer to want to buy and seller to want to sell.</p>		
								<p className='book-content-body'>You can click NEXT for details more.</p>	
								<img className='book-content-image' style={{position:'absolute',top: '40%' ,left: '30%'}} src='./Image/Southeast.png' width={'40%'} height={'20%'} alt='...'/>
								<button  className='btn book-content-button' onClick={() => handleClickNext()}>NEXT</button>
							</div>
						</>
					:
						<>
							<div style={{position:'absolute'}} className={`${ page === true ?'page-change-close' : 'page-change-open'}`}></div>
							<div className="book-content-2">
								<h3 className='book-content-title-h3'>This my picture with my partner.</h3>
								<div className='block-image-book-content-2 row'>
									<img src='./Image/Me.png' className='col-5' width={'100%'} height={'100%'} alt='...'/>
									<p className='mt-3'>Natthapol Assawapirom</p>
									<p>Developer</p>
								</div>	
								<div className='block-image-book-content-2 row'>
									<img src='./Image/Partner.jpg' className='col-5' width={'100%'} height={'100%'} alt='...'/>
									<p className='mt-3'>Thanunchai Sripechtho</p>
									<p>Book drafter</p>
								</div>			
								<button  className='btn book-content-button-back' onClick={() => handleClickBack()}>BACK</button>
							</div>
						</>
					}
					</>
				</div>
			</main>
        </>
    )
}

export default   About;