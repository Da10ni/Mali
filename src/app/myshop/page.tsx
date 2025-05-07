"use client";
import React from "react";
import MainLayout from "../components/UI/Mainlayout";
import ShopPage from "../components/Products/ShopPage";

const page = () => {
  return (
    <MainLayout header={false}>
      <ShopPage />
    </MainLayout>
  );
};

export default page;
