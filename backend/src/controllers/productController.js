const { Product, Category, ProductImage } = require('../models');
const { Op } = require('sequelize');

const productController = {
  // Lấy danh sách sản phẩm (có hỗ trợ tìm kiếm, lọc và phân trang)
  getProducts: async (req, res) => {
    try {
      const { search, category_id, is_promotion, is_new, sort, page, limit } = req.query;
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
      let orderClause = [['createdAt', 'DESC'], ['id', 'DESC']]; // Mặc định mới nhất
      if (sort === 'price_asc') orderClause = [['price', 'ASC'], ['id', 'DESC']];
      if (sort === 'price_desc') orderClause = [['price', 'DESC'], ['id', 'DESC']];
      if (sort === 'best_seller') orderClause = [['sold', 'DESC'], ['id', 'DESC']];
      if (sort === 'most_viewed') orderClause = [['views', 'DESC'], ['id', 'DESC']];

      // Phân trang (hỗ trợ Lazy Loading)
      const pageNum = parseInt(page) || 1;
      const pageSize = parseInt(limit) || 8; // Mặc định 8 sp mỗi trang
      const offset = (pageNum - 1) * pageSize;

      const { count, rows: products } = await Product.findAndCountAll({
        where: whereClause,
        order: orderClause,
        limit: pageSize,
        offset: offset,
        include: [{ model: Category, attributes: ['name'] }]
      });

      const totalPages = Math.ceil(count / pageSize);

      res.status(200).json({
        success: true,
        data: products,
        pagination: {
          total: count,
          page: pageNum,
          limit: pageSize,
          totalPages,
          hasMore: pageNum < totalPages // Dùng cho Lazy Loading
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Lỗi server khi lấy sản phẩm' });
    }
  },

  // Lấy chi tiết 1 sản phẩm (tự động tăng views)
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id, {
        include: [
          { model: Category, attributes: ['id', 'name'] },
          { model: ProductImage, as: 'images', attributes: ['id', 'image_url'] }
        ]
      });

      if (!product) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
      }

      // Tăng lượt xem mỗi khi xem chi tiết sản phẩm
      await product.increment('views', { by: 1 });

      // Lấy các sản phẩm tương tự (cùng category)
      const similarProducts = await Product.findAll({
        where: {
          category_id: product.category_id,
          id: { [Op.ne]: id }
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
  },

  // Top 10 sản phẩm bán chạy nhất (có phân trang ngang)
  getTopBestSellers: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const pageNum = parseInt(page) || 1;
      const pageSize = parseInt(limit) || 10; // Mặc định lấy top 10
      const offset = (pageNum - 1) * pageSize;

      const { count, rows: products } = await Product.findAndCountAll({
        order: [['sold', 'DESC']],
        limit: pageSize,
        offset: offset,
        include: [{ model: Category, attributes: ['name'] }]
      });

      const totalPages = Math.ceil(count / pageSize);

      res.status(200).json({
        success: true,
        data: products,
        pagination: {
          total: count,
          page: pageNum,
          limit: pageSize,
          totalPages
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Lỗi server khi lấy top bán chạy' });
    }
  },

  // Top 10 sản phẩm xem nhiều nhất (có phân trang ngang)
  getTopMostViewed: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const pageNum = parseInt(page) || 1;
      const pageSize = parseInt(limit) || 10;
      const offset = (pageNum - 1) * pageSize;

      const { count, rows: products } = await Product.findAndCountAll({
        order: [['views', 'DESC']],
        limit: pageSize,
        offset: offset,
        include: [{ model: Category, attributes: ['name'] }]
      });

      const totalPages = Math.ceil(count / pageSize);

      res.status(200).json({
        success: true,
        data: products,
        pagination: {
          total: count,
          page: pageNum,
          limit: pageSize,
          totalPages
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Lỗi server khi lấy top xem nhiều' });
    }
  }
};

module.exports = productController;
