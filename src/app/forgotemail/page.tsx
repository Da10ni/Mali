import React from "react";
import MainLayout from "../components/UI/Mainlayout";
import ForgotEmail from "../components/Login/ForgotEmail";

const forgotemail = () => {
  return (
    <MainLayout header={false}>
      <ForgotEmail />
    </MainLayout>
  );
};

export default forgotemail;
