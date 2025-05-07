import React from "react";
import MainLayout from "../components/UI/Mainlayout";
import TermsAndConditions from "../components/PrivacyPolicy/Terms&Conditions";

const page = () => {
  return (
    <MainLayout header={false} className="bg-gray-100">
      <TermsAndConditions />
    </MainLayout>
  );
};

export default page;
