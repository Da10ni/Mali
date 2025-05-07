import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: any;  // Add user data after decoding the token
}

export const authenticate = async (req: CustomRequest): Promise<Response | void> => {
  const token = req.headers.get('Authorization')?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    // If no token, return a Response with an error
    return new Response(
      JSON.stringify({ error: "No Token Provided" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded; // Attach decoded user info to the request object
  } catch (err) {
    // If token is invalid, return a Response with an error
    return new Response(
      JSON.stringify({ error: "Invalid or expired token" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
};
