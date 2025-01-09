// src/pages/ProductDetail.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { CartItem } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: { id: number; name: string; image: string };
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://api.escuelajs.co/api/v1/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const increment = () => {
    setQuantity((prev) => prev + 1); // tambah jumlah produk
  };

  const decrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // kurangi jumlah produk, tidak boleh kurang dari 1
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // redirect ke halaman login jika pengguna belum login
      navigate("/login");
      return;
    }

    if (product) {
      const cartItem: CartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
      };
      addToCart(cartItem, quantity);
    }
    toast.success("Product successfully added to cart!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  return (
    <div className="">
      <Header />
      {loading ? (
        <div className="p-6 text-center text-gray-500">Loading...</div>
      ) : (
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div className="w-full md:w-[40%]">
              <img
                src={product?.images[0]}
                alt={product?.title}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
            </div>
            <div className="w-full">
              <h1 className="text-xl md:text-2xl font-semibold mb-3">
                {product?.title}
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                {product?.description}
              </p>
              <p className="text-lg md:text-xl font-semibold mt-3 md:mt-4">
                ${product?.price}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Category: {product?.category.name}
              </p>
              <div className="flex items-center mt-3">
                <button
                  onClick={decrement}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  -
                </button>
                <span className="mx-4">{quantity}</span>
                <button
                  onClick={increment}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full md:w-auto mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
              >
                {isAuthenticated ? "Add to Cart" : "Login to Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
