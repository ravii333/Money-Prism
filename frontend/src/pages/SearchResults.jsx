import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
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
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      setMessage('');
      try {
        const response = await axios.get(`/api/products/search?q=${encodeURIComponent(query)}`);
        
        if (response.data && response.data.success) {
          if (Array.isArray(response.data.data)) {
            setProducts(response.data.data);
          } else {
            setProducts([]);
          }
          setMessage(response.data.message);
        } else {
          setError(response.data.message || 'An unknown error occurred.');
          setProducts([]);
        }

      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch product data. Please try again later.';
        setError(errorMessage);
        setProducts([]); 
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  if (loading) {
    return <div className="text-center py-10">Searching...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        !error && <p className="text-center">{message || 'No products found for your search.'}</p>
      )}
    </div>
  );
};

export default SearchResults;