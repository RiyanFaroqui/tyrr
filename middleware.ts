export { default } from "next-auth/middleware"

export const config = { 
  matcher: [
    "/trips",
    "/reservations",
    "/cars",
    "/favorites"
  ]
};