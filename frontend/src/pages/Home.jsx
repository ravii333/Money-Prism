import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";

import { categories, testimonials } from "../Data/mockData.js";

import heroBg from "../assets/herobg.png";
import { FaSearch, FaBell, FaTags, FaStar } from "react-icons/fa";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get("/api/products/featured?limit=4");

        if (response.data && response.data.success) {
          setFeaturedProducts(response.data.data);
        } else {
          setError("Could not fetch featured products.");
        }
      } catch (err) {
        setError("An error occurred while fetching data from the server.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []); 

  const renderFeaturedProducts = () => {
    if (isLoading) {
      return (
        <div className="text-center p-8 text-gray-500">
          Loading awesome deals...
        </div>
      );
    }
    if (error) {
      return <div className="text-center p-8 text-red-500">{error}</div>;
    }
    if (featuredProducts.length === 0) {
      return (
        <div className="text-center p-8 text-gray-500">
          No featured products available right now.
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {featuredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <section
        className="relative bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative container mx-auto px-6 py-24 flex flex-col items-center text-center">
          <h1 className="text-5xl font-extrabold mb-4">
            Welcome to Money Prism
          </h1>
          <p className="text-xl text-gray-200 mt-2 max-w-3xl">
            Stop overpaying. Buy at the best prices on your favorite products.
          </p>
          <div className="w-full max-w-xl mt-8">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16 border-b border-gray-200">
        <SectionHeading>Featured Parts</SectionHeading>
        {renderFeaturedProducts()}
      </section>

      <section className="container mx-auto px-6 py-16 border-b border-gray-200">
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
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold text-center px-2">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-16 border-b border-gray-200">
        <SectionHeading>How It Works</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-20 h-20 mb-6 bg-blue-100 rounded-full">
              <FaSearch className="text-blue-800" size={36} />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Search for a Part</h3>
            <p className="text-gray-600">
              Use our powerful search to find any car or mobile part you need.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-20 h-20 mb-6 bg-blue-100 rounded-full">
              <FaTags className="text-blue-800" size={36} />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Compare Prices</h3>
            <p className="text-gray-600">
              We aggregate prices from multiple marketplaces so you can easily
              compare.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-20 h-20 mb-6 bg-blue-100 rounded-full">
              <FaBell className="text-blue-800" size={36} />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Set Price Alerts</h3>
            <p className="text-gray-600">
              We'll notify you when the price drops to your desired amount.
            </p>
          </div>
        </div>
      </section>

      {/* --- Testimonials Section (Static) --- */}
      <section className="bg-white">
        <div className="container mx-auto px-6 py-16">
          <SectionHeading>What Our Users Say</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <figure
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
                <blockquote className="text-gray-600 italic mb-4">
                  <p>"{testimonial.quote}"</p>
                </blockquote>
                <figcaption className="font-bold text-gray-800">
                  {testimonial.name}
                  <cite className="block text-sm text-gray-500 not-italic">
                    {testimonial.location}
                  </cite>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* --- Newsletter Signup Section (Static) --- */}
      <section className="bg-[#e3e5eb] text-gray-900">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-2">Don't Miss a Deal!</h2>
          <p className="mb-6 max-w-xl mx-auto opacity-90">
            Subscribe to our newsletter and be the first to know about the best
            deals and price drops for parts you need.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-grow p-3 rounded-md text-gray-900 border"
              required
            />
            <button
              type="submit"
              className="bg-gray-600 text-white font-bold p-3 rounded-md hover:bg-gray-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
