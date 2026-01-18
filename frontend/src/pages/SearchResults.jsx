import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/SkeletonLoader'; 
import axios from 'axios';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let isMounted = true; 

    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      setMessage('');
      setProducts([]); 

      try {
        const response = await axios.get(`/api/products/search?q=${encodeURIComponent(query)}`);
        
        if (isMounted) {
          const { success, data, message: apiMessage } = response.data;
          
          if (success && Array.isArray(data)) {
            setProducts(data);
            setMessage(apiMessage || (data.length === 0 ? "No results found." : ""));
          } else {
            setError(apiMessage || 'An error occurred while fetching results.');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'A network error occurred. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [query]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-center" role="alert">
          <p className="font-bold">An Error Occurred</p>
          <p>{error}</p>
        </div>
      );
    }
    if (products.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      );
    }
    return (
        <div className="text-center border-2 border-dashed border-gray-300 rounded-lg p-12 mt-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-2 text-xl font-medium text-gray-900">No Products Found</h3>
            <p className="mt-1 text-sm text-gray-500">{message || "We couldn't find any products matching your search."}</p>
            <div className="mt-6">
                <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Search Results for "<span className="text-indigo-600">{query}</span>"
      </h1>
      {renderContent()}
    </div>
  );
};

export default SearchResults;