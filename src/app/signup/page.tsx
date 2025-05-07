import React from "react";
import MainLayout from "../components/UI/Mainlayout";
import Register from "../components/Signup/Register";

const Signup = () => {
  return (
    <MainLayout header={false}>
      <Register />
    </MainLayout>
  );
};

export default Signup;
