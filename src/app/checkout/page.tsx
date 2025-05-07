import React from 'react'
import MainLayout from '../components/UI/Mainlayout'
import CheckoutPage from '../components/stripe/Checkoutpage'

const page = () => {
  return (
    <MainLayout header={false} links={false}>
        <CheckoutPage price={9.99}  />
    </MainLayout>
  )
}

export default page