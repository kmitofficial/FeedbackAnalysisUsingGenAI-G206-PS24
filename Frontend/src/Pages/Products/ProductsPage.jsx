import React, { useEffect, useState } from "react";
import "./ProductsPage.css";
import axios from 'axios'
import {toast} from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'

const ProductsPage = () => {
  const navigate=useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // State to handle loading
  const storedToken = JSON.parse(localStorage.getItem('token')); // Use token from Redux or localStorage

  console.log("Products",products)

  const filteredProducts = products.filter((product) =>
    (product.summary && product.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.categories && product.categories.some(category =>
      category.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );
  

  const fecthProducts = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:7000/api/products/products', {
        headers: {
          Authorization: `Bearer ${storedToken}`, // Pass token in Authorization header
        },
      })
      if(response.data.success)
      {
        setProducts(response.data.data);
        setLoading(false)
      }
      else{
        toast.error("could not fetch products!")
      }
     
    } catch (error) {
         console.log("Could not fetch products:",error.message)
    }
  }

  useEffect(() => {
    if(!storedToken)
      {
         return navigate('/')
      }
    
      fecthProducts();
  },[storedToken,navigate])

  if(loading)
  {
    return <p>Laoding...</p>
  }

  return (
    <div className="products">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="product-container">
        {filteredProducts.map((product, index) => (
          <div key={index} className="product-card">
            <p><strong>URL:</strong> <a href={product.url}>{product.url.substring(0,150)}...</a></p>
            <p><strong>Summary:</strong> {product.summary}</p>
            <p><strong>Average Rating:</strong> {product.avgRating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
