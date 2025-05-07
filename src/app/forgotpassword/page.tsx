import React from "react";
import MainLayout from "../components/UI/Mainlayout";
import ForgotPassword from "../components/Login/ForgotPassword";

const forgotpassword = () => {
  return (
    <MainLayout header={false}>
      <ForgotPassword />
    </MainLayout>
  );
};

export default forgotpassword;
