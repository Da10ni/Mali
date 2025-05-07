import React from "react";
import MainLayout from "../components/UI/Mainlayout";
import UsernamePage from "../components/Signup/Username";

const username = () => {
  return (
    <MainLayout header={false}>
      <UsernamePage />
    </MainLayout>
  );
};

export default username;
