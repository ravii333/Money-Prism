import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const id = product._id || product.id;
  const name = product.name;
  const image = product.imageURL || product.image;
  const price =
    product.currentLowestPrice !== undefined
      ? product.currentLowestPrice
      : product.price;

  const displayPrice = price
    ? `₹${Number(price).toLocaleString()}`
    : "Price not available";

  if (!id || !name || !image) {
    return null;
  }

  return (
    <Link
      to={`/product/${id}`}
      className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out group"
    >
      <div className="flex flex-col p-4 h-full">
        <div className="relative w-full h-48 mb-4">
          <img
            className="absolute inset-0 w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
            src={image}
            alt={name}
            loading="lazy"
          />
        </div>
        <div className="text-center mt-auto">
          <h3 className="text-md font-semibold text-gray-800 h-12 line-clamp-2">
            {name}
          </h3>
          <p className="mt-2 text-xl font-bold text-gray-900">{displayPrice}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
