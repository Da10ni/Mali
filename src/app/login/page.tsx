import React from "react";
import MainLayout from "../components/UI/Mainlayout";
import LoginPage from "../components/Login/Login";
// import { GoogleLoginButton } from '../components/Googleloginbutton'

const Login = () => {
  return (
    <MainLayout header={false}>
      <LoginPage />
    </MainLayout>
  );
};

export default Login;
