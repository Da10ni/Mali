import React, { Suspense } from "react";
import MainLayout from "../components/UI/Mainlayout";
import VerifyLink from "../components/Signup/VerifyLink";

const page = () => {
  return (
    <MainLayout>
      <Suspense> 
      <VerifyLink />
      </Suspense>
    </MainLayout>
  );
};

export default page;
