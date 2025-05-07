import React from "react";
import MainLayout from "../components/UI/Mainlayout";
import EarnMoneySelection from "../components/EarnSelection/EarnSelection";

const page = () => {
  return (
    <MainLayout header={false}>
      <EarnMoneySelection />
    </MainLayout>
  );
};

export default page;
