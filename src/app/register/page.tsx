import React from "react";
import MainLayout from "../components/UI/Mainlayout";
import MultiStepForm from "../components/Signup/Multistepform";
// import Registerpage from '../components/Register'

const Register = () => {
  return (
    <MainLayout className="bg-gray-200" links={false}>
      <MultiStepForm />
    </MainLayout>
  );
};

export default Register;
