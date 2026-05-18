const { Product, Category, ProductImage } = require('../models');
const { Op } = require('sequelize');

const productController = {
  // Lấy danh sách sản phẩm (có hỗ trợ tìm kiếm và lọc)
  getProducts: async (req, res) => {
    try {
      const { search, category_id, is_promotion, is_new, sort } = req.query;
      let whereClause = {};

      // Điều kiện tìm kiếm theo tên
      if (search) {
        whereClause.name = { [Op.like]: `%${search}%` };
      }

      // Lọc theo danh mục
      if (category_id) {
        whereClause.category_id = category_id;
      }

      // Lọc sản phẩm đang khuyến mãi
      if (is_promotion === 'true') {
        whereClause.is_promotion = true;
      }

      // Lọc sản phẩm mới
      if (is_new === 'true') {
        whereClause.is_new = true;
      }

      // Sắp xếp
      let orderClause = [['createdAt', 'DESC']]; // Mặc định mới nhất
      if (sort === 'price_asc') orderClause = [['price', 'ASC']];
      if (sort === 'price_desc') orderClause = [['price', 'DESC']];
      if (sort === 'best_seller') orderClause = [['sold', 'DESC']];

      const products = await Product.findAll({
        where: whereClause,
        order: orderClause,
        include: [{ model: Category, attributes: ['name'] }]
      });

      res.status(200).json({ success: true, data: products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Lỗi server khi lấy sản phẩm' });
    }
  },

  // Lấy chi tiết 1 sản phẩm
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const product = await Product.findByPk(id, {
        include: [
          { model: Category, attributes: ['id', 'name'] },
          { model: ProductImage, as: 'images', attributes: ['id', 'image_url'] } // Lấy ảnh phụ cho Swiper
        ]
      });

      if (!product) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
      }

      // Lấy các sản phẩm tương tự (cùng category)
      const similarProducts = await Product.findAll({
        where: { 
          category_id: product.category_id,
          id: { [Op.ne]: id } // Khác ID hiện tại
        },
        limit: 4
      });

      res.status(200).json({ 
        success: true, 
        data: {
          product,
          similarProducts
        } 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Lỗi server khi lấy chi tiết sản phẩm' });
    }
  },

  // Lấy danh sách danh mục
  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll();
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Lỗi server khi lấy danh mục' });
    }
  }
};

module.exports = productController;
