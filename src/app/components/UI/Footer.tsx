import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className="bg-white text-black py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Left Links */}
        <span className="text-sm">
            Copyrights <Link href="" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">@mali</Link>
        </span>


        {/* Right Links */}
        <div className="flex items-center space-x-4">
        <ul className="flex space-x-4">
          <li className="before:content-['•'] before:mr-2">
            <Link href="/privacypolicy" className="text-black hover:underline hover:text-blue-400">Privacy Policy</Link>
          </li>
          <li className="before:content-['•'] before:mr-2">
            <Link href="/terms" className="text-black hover:underline hover:text-blue-400">Terms and Conditions</Link>
          </li>
        </ul>
        </div>
      </div>
    </div>
  )
}

export default Footer
