const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Route lấy danh sách danh mục (categories)
router.get('/categories', productController.getCategories);

// Route lấy danh sách sản phẩm (hỗ trợ query tìm kiếm, lọc)
router.get('/', productController.getProducts);

// Route lấy chi tiết 1 sản phẩm kèm ảnh phụ và sản phẩm tương tự
router.get('/:id', productController.getProductById);

module.exports = router;
