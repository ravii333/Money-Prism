import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="flex flex-col items-center p-6">
        <img className="h-32 w-32 object-contain mb-4" src={product.image} alt={product.name} />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <p className="mt-2 text-xl font-bold text-gray-900">₹ {product.price}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;