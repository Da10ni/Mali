import React, { Suspense } from "react";
import MainLayout from "../components/UI/Mainlayout";
import VerifyEmail from "../components/Signup/Verifyemail";

const page = () => {
  return (
    <MainLayout header={false}>
      <Suspense>
        <VerifyEmail />
      </Suspense>
    </MainLayout>
  );
};

export default page;
