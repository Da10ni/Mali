"use client";
import React from "react";
import MainLayout from "../components/UI/Mainlayout";
import BookingsPage from "../components/Bookings/BookingsPage";
import Main from "../components/Main";

const page = () => {
  return (
    /*<MainLayout header={false}>
      <BookingsPage />
    </MainLayout>*/

    <Main>
      <BookingsPage />
    </Main>
  );
};

export default page;
