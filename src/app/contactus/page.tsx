import React from "react";
import Navbar from "../components/UI/Navbar";
import MainLayout from "../components/UI/Mainlayout";
import MultiStepForm from "../components/Signup/Multistepform";

const Contactus = () => {
  return (
    <MainLayout header={false}>
      <MultiStepForm />
    </MainLayout>
  );
};

export default Contactus;
