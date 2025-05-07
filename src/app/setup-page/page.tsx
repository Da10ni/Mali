import React from "react";
import MainLayout from "../components/UI/Mainlayout";
import SetupPage from "../components/Signup/SetupPage";

const page = () => {
  return (
    <MainLayout header={false}>
      <SetupPage />
    </MainLayout>
  );
};

export default page;
