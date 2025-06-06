import React from "react";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import { featuredParts } from "../Data/mockData";
import heroBg from "../assets/herobg.png";
import SectionHeading from "../components/SectionHeading";

import { FaSearch, FaBell, FaTags, FaStar } from "react-icons/fa";

// Mock data for new sections
const categories = [
  {
    name: "Phone Screens",
    image:
      "https://images.unsplash.com/photo-1601972602996-b3336653a948?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOTc5MDh8MHwxfGFsbHx8fHx8fHx8fDE3MTU0OTU3ODh8&ixlib=rb-4.0.3&q=80&w=400",
  },
  {
    name: "Car Batteries",
    image:
      "https://images.unsplash.com/photo-1582262043373-1b7d85341496?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOTc5MDh8MHwxfGFsbHx8fHx8fHx8fDE3MTU0OTU4NDJ8&ixlib=rb-4.0.3&q=80&w=400",
  },
  {
    name: "Engine Parts",
    image:
      "https://images.unsplash.com/photo-1599493356233-a3b05a7616f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOTc5MDh8MHwxfGFsbHx8fHx8fHx8fDE3MTU0OTU4NzR8&ixlib=rb-4.0.3&q=80&w=400",
  },
  {
    name: "Mobile Batteries",
    image:
      "https://images.unsplash.com/photo-1604263435132-7235a3597a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzOTc5MDh8MHwxfGFsbHx8fHx8fHx8fDE3MTU0OTU5MDd8&ixlib=rb-4.0.3&q=80&w=400",
  },
];

const testimonials = [
  {
    quote:
      "PartWise saved me over ₹1,500 on a new screen for my iPhone. The price alert feature is a game-changer!",
    name: "Aarav Sharma",
    location: "Mumbai",
  },
  {
    quote:
      "Finding a specific battery for my old car was a nightmare until I used this site. Found one in minutes at a great price.",
    name: "Priya Singh",
    location: "Delhi",
  },
  {
    quote:
      "As a small repair shop owner, PartWise is an essential tool for my business. It helps me source parts efficiently.",
    name: "Rohan Verma",
    location: "Bengaluru",
  },
];

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative container mx-auto px-6 py-24 flex flex-col items-center text-center">
          <h1 className="text-5xl font-extrabold mb-4">
            Welcome to Money Prism
          </h1>
          <p className="text-xl text-gray-200 mt-2 max-w-3xl">
            Stop overpaying. We help you find the best prices for car and mobile
            parts from various sellers.
          </p>
          <div className="w-full max-w-xl mt-8">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Featured Parts Section */}
      <div className="container mx-auto px-6 py-16 border-b border-gray-200">
        <SectionHeading>Featured Parts</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {featuredParts.map((part) => (
            <ProductCard key={part.id} product={part} />
          ))}
        </div>
      </div>

      {/* --- NEW: SHOP BY CATEGORY SECTION --- */}
      <div className="container mx-auto px-6 py-16 border-b border-gray-200">
        <SectionHeading>Shop by Category</SectionHeading>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="relative rounded-lg overflow-hidden group cursor-pointer"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-6 py-16 border-b border-gray-200">
        <SectionHeading>How It Works</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-20 h-20 mb-6 bg-blue-100 rounded-full">
              <FaSearch className="text-brand-blue" size={36} />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Search for a Part</h3>
            <p className="text-gray-600">
              Use our powerful search to find any car or mobile part you need.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-20 h-20 mb-6 bg-blue-100 rounded-full">
              <FaTags className="text-brand-blue" size={36} />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Compare Prices</h3>
            <p className="text-gray-600">
              We aggregate prices from multiple marketplaces so you can easily
              compare.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-20 h-20 mb-6 bg-blue-100 rounded-full">
              <FaBell className="text-brand-blue" size={36} />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Set Price Alerts</h3>
            <p className="text-gray-600">
              We'll notify you when the price drops to your desired amount.
            </p>
          </div>
        </div>
      </div>

      {/* --- NEW: TESTIMONIALS SECTION --- */}
      <div className="bg-white">
        <div className="container mx-auto px-6 py-16">
          <SectionHeading>What Our Users Say</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-gray-50 p-6 rounded-lg shadow-sm"
              >
                <div className="flex text-yellow-400 mb-4">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                <p className="text-gray-600 italic mb-4">
                  "{testimonial.quote}"
                </p>
                <p className="font-bold text-gray-800">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            ))}
          </div>
        </div>
        {/* A star in the center of the every sections endings
        <div className="flex justify-center text-yellow-400 mb-4">
          <FaStar />
        </div> */}
      </div>

      {/* --- NEW: NEWSLETTER SIGNUP SECTION --- */}
      <div className="bg-brand-blue text-gray-500">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl text-gray-900 font-bold mb-2">
            Don't Miss a Deal!
          </h2>
          <p className="text-black mb-6 max-w-xl mx-auto">
            Subscribe to our newsletter and be the first to know about the best
            deals and price drops for parts you need.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-grow p-3 rounded-md text-gray-900 border-1"
            />
            <button
              type="submit"
              className="bg-white text-gray-600 font-bold p-3 rounded-md hover:bg-gray-700  hover:text-white transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
