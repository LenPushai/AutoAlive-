export const MOCK_VEHICLES = [
  {
    id: "v001",
    make: "Toyota",
    model: "Hilux 2.8 GD-6 Legend",
    year: 2023,
    price: 749900,
    mileage: 12500,
    fuel: "Diesel",
    transmission: "Automatic",
    color: "White",
    image: "/images/vehicles/placeholder-1.jpg",
    featured: true,
    status: "available",
    badge: "Just In",
  },
  {
    id: "v002",
    make: "Volkswagen",
    model: "Polo 1.0 TSI Comfortline",
    year: 2024,
    price: 389900,
    mileage: 5200,
    fuel: "Petrol",
    transmission: "Manual",
    color: "Silver",
    image: "/images/vehicles/placeholder-2.jpg",
    featured: true,
    status: "available",
    badge: "Low KM",
  },
  {
    id: "v003",
    make: "Ford",
    model: "Ranger 2.0 Bi-Turbo Wildtrak",
    year: 2022,
    price: 699900,
    mileage: 38000,
    fuel: "Diesel",
    transmission: "Automatic",
    color: "Blue",
    image: "/images/vehicles/placeholder-3.jpg",
    featured: true,
    status: "available",
    badge: "Price Drop",
  },
  {
    id: "v004",
    make: "Hyundai",
    model: "Creta 1.5 Executive",
    year: 2023,
    price: 449900,
    mileage: 18000,
    fuel: "Petrol",
    transmission: "Automatic",
    color: "Gray",
    image: "/images/vehicles/placeholder-4.jpg",
    featured: true,
    status: "available",
    badge: null,
  },
  {
    id: "v005",
    make: "BMW",
    model: "320i M Sport",
    year: 2021,
    price: 599900,
    mileage: 45000,
    fuel: "Petrol",
    transmission: "Automatic",
    color: "Black",
    image: "/images/vehicles/placeholder-5.jpg",
    featured: false,
    status: "available",
    badge: null,
  },
  {
    id: "v006",
    make: "Mercedes-Benz",
    model: "C200 AMG Line",
    year: 2022,
    price: 749900,
    mileage: 25000,
    fuel: "Petrol",
    transmission: "Automatic",
    color: "White",
    image: "/images/vehicles/placeholder-6.jpg",
    featured: false,
    status: "available",
    badge: "Premium",
  },
];

export function formatZAR(amount) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatKM(km) {
  return new Intl.NumberFormat("en-ZA").format(km) + " km";
}

export function calculateMonthly(price, rate = 11.75, months = 72, deposit = 0.1) {
  const principal = price * (1 - deposit);
  const monthlyRate = rate / 100 / 12;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(payment);
}
