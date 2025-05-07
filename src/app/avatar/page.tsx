import React from "react";
import AvatarSelection from "../components/Avatar/AvatarSelection";
import MainLayout from "../components/UI/Mainlayout";

const page = () => {
  return (
    <MainLayout header={false}>
      <AvatarSelection />
    </MainLayout>
  );
};

export default page;
