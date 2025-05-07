import React from 'react'
import Sidebar from './Sidebar'
import Header from './UI/Header';

interface MainProps {
  children: React.ReactNode;
}

const Main : React.FC<MainProps> = ({children}) => {
  return (
    <div className='bg-gray-50 w-full h-screen flex'>
        <div className='sticky top-0 z-50'>
        <Sidebar/>
        </div>
        <div className='w-full h-screen overflow-y-scroll'>

        {/* <Header title='Dashboard'/> */}
        {
            React.Children.map(children, (child) => {
                return React.cloneElement(child as React.ReactElement, {
                });
            })
        }
        </div>


    </div>
  )
}

export default Main