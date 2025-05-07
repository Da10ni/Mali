import React from "react";
import MainLayout from "../components/UI/Mainlayout";
import LinksPage from "../components/Links/LinksPage";

const page = () => {
  return (
    <MainLayout header={false}>
      <LinksPage />
    </MainLayout>
  );
};

export default page;
