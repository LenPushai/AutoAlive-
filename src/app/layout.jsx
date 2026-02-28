import "./globals.css";

export const metadata = {
  title: "Auto Alive | Vanderbijlpark's Premier Dealership",
  description:
    "Premium pre-owned vehicles backed by 15 years of trusted service. Quality cars, bakkies, and motorcycles in the Vaal Triangle.",
  keywords: "cars, vehicles, dealership, Vanderbijlpark, Vaal Triangle, pre-owned, finance, bakkies, motorcycles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
