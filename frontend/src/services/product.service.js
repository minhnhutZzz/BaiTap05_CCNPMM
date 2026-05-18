import axios from 'axios';

const API_URL = 'http://localhost:3000/api/products';

const productService = {
  // Lấy danh sách sản phẩm với các tham số bộ lọc
  getProducts: async (params = {}) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  // Lấy danh sách danh mục
  getCategories: async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  },

  // Lấy chi tiết sản phẩm theo ID
  getProductById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }
};

export default productService;
