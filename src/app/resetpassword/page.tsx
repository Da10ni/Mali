import React, { Suspense } from "react";
import MainLayout from "../components/UI/Mainlayout";
import ResetPassword from "../components/Login/ResetPassword";

const page = () => {
  return (
    <MainLayout header={false}>
      <Suspense fallback={<div>Loading...</div>}> 
      <ResetPassword />
      </Suspense>
    </MainLayout>
  );
};

export default page;
