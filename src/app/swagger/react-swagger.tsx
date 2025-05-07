// app/swagger/react-swagger.tsx
// import SwaggerUI from 'swagger-ui-react';  // Import Swagger UI component
// import 'swagger-ui-react/swagger-ui.css';  // Import the Swagger UI CSS

// type Props = {
//   spec: Record<string, any>,  // Define the prop type for `spec`
// }]

// const SwaggerPage: React.FC<Props> = ({ spec }) => {
//   return <SwaggerUI spec={spec} />;  // Pass the spec to Swagger UI for rendering
// };

// export default SwaggerPage;

// 'use client';

// import dynamic from 'next/dynamic';
// import { useEffect, useState } from 'react';

// // Dynamically import SwaggerUI with ssr: false to avoid SSR issues
// const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });
// import 'swagger-ui-react/swagger-ui.css';  // Import the Swagger UI CSS

// type Props = {
//   spec: Record<string, any>;  // Define the prop type for `spec`
// };

// const SwaggerPage: React.FC<Props> = ({ spec }) => {
//   const [swaggerSpec, setSwaggerSpec] = useState(spec);

//   useEffect(() => {
//     if (spec) {
//       setSwaggerSpec(spec); // Set spec dynamically if needed
//     }
//   }, [spec]);

//   return (
//     <>
//       {/* Render Swagger UI client-side only */}
//       <SwaggerUI spec={swaggerSpec} />
//     </>
//   );
// };

// export default SwaggerPage;

import React from 'react'

const react = () => {
  return (
    <div>react-swagger</div>
  )
}

export default react

