import axios from 'axios';

const API_URL = 'http://localhost:3000/api/products';

const productService = {
  // Lấy danh sách sản phẩm với bộ lọc và phân trang (hỗ trợ Lazy Loading)
  // params: { search, category_id, is_promotion, is_new, sort, page, limit }
  getProducts: async (params = {}) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
  },

  // Lấy danh sách danh mục
  getCategories: async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  },

  // Lấy chi tiết sản phẩm theo ID (tự động tăng lượt xem)
  getProductById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Top 10 sản phẩm bán chạy nhất (có phân trang ngang)
  getTopBestSellers: async (params = {}) => {
    const response = await axios.get(`${API_URL}/top-best-sellers`, { params });
    return response.data;
  },

  // Top 10 sản phẩm xem nhiều nhất (có phân trang ngang)
  getTopMostViewed: async (params = {}) => {
    const response = await axios.get(`${API_URL}/top-most-viewed`, { params });
    return response.data;
  }
};

export default productService;
