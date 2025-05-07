import React from "react";
import MainLayout from "../components/UI/Mainlayout";
import PrivacyPolicy from "../components/PrivacyPolicy/PrivacyPolicy";

const policy = () => {
  return (
    <MainLayout header={false}>
      <PrivacyPolicy />
    </MainLayout>
  );
};

export default policy;
