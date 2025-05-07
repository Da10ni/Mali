import React from "react";
import MainLayout from "../components/UI/Mainlayout";
import GoalSelection from "../components/Signup/Goals";

const page = () => {
  return (
    <MainLayout header={false}>
      <GoalSelection />
    </MainLayout>
  );
};

export default page;
