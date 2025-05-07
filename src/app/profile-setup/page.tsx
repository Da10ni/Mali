import React from "react";
import MainLayout from "../components/UI/Mainlayout";
import ProfileSetup from "../components/Signup/ProfileSetup";

const page = () => {
  return (
    <MainLayout header={false}>
      <ProfileSetup />
    </MainLayout>
  );
};

export default page;
