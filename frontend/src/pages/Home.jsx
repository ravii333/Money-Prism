import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import PartCard from "../components/PartCard";

const dummyParts = [
  { name: "iPhone 12 Screen", price: 4999, source: "Flipkart" },
  { name: "Car Battery EXIDE", price: 6999, source: "Amazon" },
  { name: "Samsung Galaxy S21 Screen", price: 5500, source: "eBay" },
  { name: "Honda Car Battery", price: 7200, source: "Amazon" },
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredParts = dummyParts.filter((part) =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 flex flex-col items-center">
      {/* Full screen welcome section with background image */}
      <div
        className="w-full h-screen py-5 flex flex-col justify-center items-center text-white"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1592679720665-9ec79e676e6b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1 className="text-6xl text-fuchsia-600 font-bold mb-5 bg-white/10 px-10 py-2 rounded">
          Welcome to Money Prism
        </h1>
        <div className="w-full max-w-md bg-white/10 p-5 rounded">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </div>

      {/* Parts grid section below */}
      <div className="w-full m-2 p-2 border border-gray-300 rounded-md">
        <div className="w-full px-2 py-3 text-3xl text-center text-white bg-indigo-800 rounded">
          Products to explore
        </div>
        <div className="w-full max-w-7xl px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParts.length > 0 ? (
            filteredParts.map((part, idx) => <PartCard key={idx} part={part} />)
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No parts found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
