import axios from "../utils/axioxInstance";

// untuk get all product
export const getProducts = async () => {
  const response = await axios.get("/products");
  return response.data;
};

// untuk get product by category
export const getProductByCategory = async (categoryId: number) => {
  const response = await axios.get(`/products/?categoryId=${categoryId}`);
  return response.data;
};
