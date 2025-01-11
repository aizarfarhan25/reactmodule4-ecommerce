import React from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

const CartPage = () => {
  const {
    cart,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    // clearCart,
    buyCart,
  } = useCart();
  const { isAuthenticated, isLoading } = useAuth(); // cek status login
  const navigate = useNavigate();

  // untuk hitung total halga
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // kembali ke login kalau tidak terverifikasi
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login"); 
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Menampilkan loading saat status autentikasi sedang diperiksa
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header />

      <main className="flex flex-1 flex-col items-center p-4">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

        {/* Menampilkan jika keranjang kosong */}
        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500">Your cart is empty.</p>
            <Link
              to="/"
              className="mt-4 inline-block bg-gray-950 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          // menampilkan item di cart
          <div className="w-full max-w-2xl">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between mb-4 border p-4 rounded"
              >
                {/* Gambar produk */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-cover mr-4"
                />

                {/* detail produk */}
                <div className="flex-1">
                  <h2 className="font-bold">{item.title}</h2>
                  <p>${item.price.toFixed(2)}</p>

                  {/* tombol increment decrement produk */}
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400 transition"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item, 1)}
                      className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* tombol hapus item */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Total dan Tombol Clear Cart */}
            <p className="font-bold text-lg mt-4">Total: ${total.toFixed(2)}</p>
            {/* <button
              onClick={clearCart}
              className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
            >
              Clear Cart
            </button> */}
            <button
              onClick={() => {
                buyCart(); // Panggil fungsi buyCart
                alert("Your purchase is successful"); // Tampilkan alert
                navigate("/"); // Arahkan ke halaman utama
              }}
              className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition ml-4"
            >
              Purchase Now
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
