import axios from "../utils/axioxInstance";

// untuk get all category
export const getCategories = async () => {
  const response = await axios.get("/categories");
  return response.data;
};

// untuk get product by category
export const getProductsByCategory = async (categoryId: number) => {
  const response = await axios.get(`/products/?categoryId=${categoryId}`);
  return response.data;
};
