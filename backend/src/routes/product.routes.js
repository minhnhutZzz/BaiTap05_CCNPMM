const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Route lấy danh sách danh mục (categories)
router.get('/categories', productController.getCategories);

// Route lấy top 10 sản phẩm bán chạy nhất (có phân trang ngang)
router.get('/top-best-sellers', productController.getTopBestSellers);

// Route lấy top 10 sản phẩm xem nhiều nhất (có phân trang ngang)
router.get('/top-most-viewed', productController.getTopMostViewed);

// Route lấy danh sách sản phẩm (hỗ trợ query tìm kiếm, lọc, phân trang / lazy loading)
router.get('/', productController.getProducts);

// Route lấy chi tiết 1 sản phẩm kèm ảnh phụ và sản phẩm tương tự (tự tăng views)
router.get('/:id', productController.getProductById);

module.exports = router;
