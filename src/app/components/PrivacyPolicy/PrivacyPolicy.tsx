import React from 'react'
import Link from 'next/link'

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between">
        {/* Left Content */}
        <div className="w-2/4 space-y-8">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p>
            This Privacy Policy outlines how we collect, use, and protect your
            personal information when you use our services. By accessing or using
            our website or services, you consent to the practices described in this
            policy.
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Information Collection</h2>
            <p>
              We may collect a variety of personal information when you visit our
              site or use our services, including:
            </p>
            <ul className="list-disc list-inside">
              <li>Your full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Payment information (e.g., credit card details)</li>
              <li>Usage data, such as browsing behavior and device information</li>
            </ul>
            <p>
              This information is necessary to provide and improve our services and
              to process any transactions.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Data Usage</h2>
            <p>
              We use the collected data for a variety of purposes to enhance your
              experience with our services. These include:
            </p>
            <ul className="list-disc list-inside">
              <li>Personalizing your experience on our site</li>
              <li>Improving and optimizing the performance of our services</li>
              <li>Processing payments and transactions securely</li>
              <li>Providing customer support and responding to inquiries</li>
              <li>Sending relevant updates, newsletters, or promotional offers (with your consent)</li>
            </ul>
            <p>
              We also may use this data for internal analytics and reporting to
              better understand user behavior.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Data Protection</h2>
            <p>
              We are committed to protecting your personal data. We implement
              industry-standard security measures to safeguard your information,
              such as:
            </p>
            <ul className="list-disc list-inside">
              <li>Encryption to protect sensitive data during transmission</li>
              <li>Regular security audits to identify vulnerabilities</li>
              <li>Access controls to ensure only authorized personnel can access your data</li>
            </ul>
            <p>
              While we take every precaution to protect your data, please note that
              no data transmission over the internet can be guaranteed to be 100%
              secure. As such, we cannot guarantee the absolute security of your data.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Third-Party Sharing</h2>
            <p>
              We respect your privacy and will not sell or share your personal data
              with third parties, except for the following:
            </p>
            <ul className="list-disc list-inside">
              <li>When required by law (e.g., to comply with a subpoena)</li>
              <li>With trusted third-party service providers who assist us in operating
                our services (e.g., payment processors, email marketing services)</li>
              <li>With affiliates or subsidiaries that help us deliver services to you</li>
            </ul>
            <p>
              In all cases, we ensure that these third parties handle your data in
              accordance with this privacy policy and applicable laws.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Rights</h2>
            <p>
              As a user, you have certain rights concerning your personal data, including:
            </p>
            <ul className="list-disc list-inside">
              <li>The right to access and review the personal information we hold about you</li>
              <li>The right to request corrections or updates to your personal information</li>
              <li>The right to request the deletion of your personal data (in certain circumstances)</li>
              <li>The right to withdraw consent for marketing communications at any time</li>
            </ul>
            <p>
              You can exercise these rights by contacting us directly, and we will
              respond promptly to your request.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we
              will post the updated policy on this page, and the "Last Updated" date
              at the top of the page will be revised.
            </p>
            <p>
              It is your responsibility to review this policy periodically to stay
              informed of any changes. Continued use of our services after the
              changes will constitute your acceptance of the updated terms.
            </p>
          </div>

          <p>If you have any questions or concerns about this policy, feel free to contact us.</p>
        </div>

        {/* Right Content */}
        <div className="w-1/4 bg-gray-50 p-6 rounded-lg space-y-4">
          <h3 className="text-2xl font-semibold">Quick Links</h3>
          <ul className="space-y-4">
            <li>
              <Link href="/privacypolicy" className="text-blue-500 hover:underline">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms" className="text-blue-500 hover:underline">Terms and Conditions</Link>
            </li>
           
          </ul>

          <div className="space-y-2">
            <h4 className="text-xl font-semibold">Crafted by</h4>
            <Link href="" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">mali</Link>
          </div>

          <div className="space-y-2">
            <h4 className="text-xl font-semibold">Follow Us</h4>
            <a href="" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">@mali</a>
          </div>

          <div className="space-y-2">
            <h4 className="text-xl font-semibold">Contribute</h4>
            <a href="https://github.com" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Send a Pull Request</a>
          </div>

          <div className="space-y-2">
            <h4 className="text-xl font-semibold">License</h4>
            <Link href="/license" className="text-blue-400 hover:underline">View License</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
