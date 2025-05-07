// src/lib/swagger.js
import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api', // Define API folder under app folder
    definition: {
      openapi: '3.0.0',  // Ensure this is a valid OpenAPI version (e.g., '3.0.0')
      info: {
        title: 'Next Swagger API Example',  // API title
        description: 'API documentation for my Next.js 13 app using App Router',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          BearerAuth: {  // Authentication method
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [],
    },
  });

  return spec;  // Return the generated Swagger spec
};
