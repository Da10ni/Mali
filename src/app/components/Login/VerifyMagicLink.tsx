// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";

// const VerifyMagicLinkPage = () => {
//   const router = useRouter();
//   const { token } = router.query;

//   const [status, setStatus] = useState("");

//   useEffect(() => {
//     if (token) {
//       const verifyLink = async () => {
//         const response = await fetch(`/api/auth/verifyMagicLink?token=${token}`);
//         const result = await response.json();

//         if (response.ok) {
//           setStatus("Login successful");
//         } else {
//           setStatus("Error: " + result.error);
//         }
//       };

//       verifyLink();
//     }
//   }, [token]);

//   return <div>{status}</div>;
// };

// export default VerifyMagicLinkPage;
