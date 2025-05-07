import React from "react";
import MainLayout from "../components/UI/Mainlayout";
import Profile from "../components/Profile/Profile";

const page = () => {
  return (
    <MainLayout header={false}>
      <Profile />
    </MainLayout>
  );
};

export default page;
