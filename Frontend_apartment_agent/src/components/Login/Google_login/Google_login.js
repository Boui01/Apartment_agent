import React from 'react';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';

const clientId = 'YOUR_GOOGLE_CLIENT_ID';

function GoogleLoginComponent() {
  const onSuccess = (response) => {
    console.log('Login Success:', response);
    // Handle login success and store the user token in session storage or state
    sessionStorage.setItem('token', response.credential);
  };

  const onError = () => {
    console.log('Login Failed');
  };

  const onLogout = () => {
    googleLogout();
    console.log('Logged out successfully');
    // Clear the token from session storage or state
    sessionStorage.removeItem('token');
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div>
        <GoogleLogin onSuccess={onSuccess} onError={onError} />
        <button onClick={onLogout}>Logout</button>
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginComponent;
