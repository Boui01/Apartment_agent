import React, { useEffect } from 'react';

const FacebookLoginComponent = ({ onLogin }) => {
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '1807249233095949', // Replace with your Facebook app ID
        cookie: true,
        xfbml: true,
        version: 'v12.0'
      });
    };
  }, []);

  const handleResponse = (response) => {
    if (response.status === 'connected') {
      window.FB.api('/me', { fields: 'name,email,picture' }, (userInfo) => {
        onLogin(userInfo);
      });
    }
  };

  const handleClick = () => {
    window.FB.login(handleResponse, { scope: 'public_profile,email' });
  };

  return (
    <div>
      <button onClick={handleClick}>Login with Facebook</button>
    </div>
  );
};

export default FacebookLoginComponent;

