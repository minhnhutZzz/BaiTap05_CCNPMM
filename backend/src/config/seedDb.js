const { Category, Product, ProductImage } = require('../models');

const seedDatabase = async () => {
  try {
    const categoryCount = await Category.count();
    if (categoryCount > 0) {
      console.log('✓ Dữ liệu mẫu (Trà sữa) đã tồn tại, bỏ qua seed.');
      return;
    }

    console.log('Đang tạo dữ liệu mẫu (Trà sữa)...');

    // Tạo danh mục
    const categories = await Category.bulkCreate([
      { name: 'Trà Sữa Truyền Thống', description: 'Các loại trà sữa cơ bản' },
      { name: 'Trà Trái Cây', description: 'Trà kết hợp trái cây tươi mát' },
      { name: 'Macchiato & Kem Cheese', description: 'Đồ uống có lớp kem béo' },
      { name: 'Topping', description: 'Trân châu, thạch, pudding...' }
    ]);

    // Tạo sản phẩm
    const productsData = [
      {
        name: 'Trà Sữa Trân Châu Đường Đen',
        description: 'Vị trà sữa đậm đà kết hợp với trân châu dai giòn và đường đen thơm lừng.',
        price: 35000,
        discount_price: 30000,
        stock: 100,
        sold: 50,
        thumbnail: 'https://images.unsplash.com/photo-1558857563-b37102e96ab5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        is_new: false,
        is_promotion: true,
        category_id: categories[0].id
      },
      {
        name: 'Trà Sữa Oolong Nướng',
        description: 'Trà Oolong nướng thơm lừng, đậm vị trà.',
        price: 40000,
        stock: 50,
        sold: 20,
        thumbnail: 'https://images.unsplash.com/photo-1582236894086-63e80dcb45ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        is_new: true,
        is_promotion: false,
        category_id: categories[0].id
      },
      {
        name: 'Trà Đào Cam Sả',
        description: 'Thức uống giải nhiệt mùa hè tuyệt vời.',
        price: 45000,
        discount_price: 39000,
        stock: 120,
        sold: 150,
        thumbnail: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        is_new: false,
        is_promotion: true,
        category_id: categories[1].id
      },
      {
        name: 'Trà Xoài Kem Cheese',
        description: 'Lớp kem cheese mặn béo ngậy trên nền trà xoài xay nhuyễn.',
        price: 55000,
        stock: 40,
        sold: 10,
        thumbnail: 'https://plus.unsplash.com/premium_photo-1669680785708-2c756ee97de8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        is_new: true,
        is_promotion: false,
        category_id: categories[2].id
      }
    ];

    const products = await Product.bulkCreate(productsData);

    // Tạo nhiều ảnh cho một số sản phẩm (mô phỏng swiper)
    const productImagesData = [
      { product_id: products[0].id, image_url: 'https://images.unsplash.com/photo-1558857563-b37102e96ab5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
      { product_id: products[0].id, image_url: 'https://images.unsplash.com/photo-1588698188173-04d805090ef6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
      { product_id: products[2].id, image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
      { product_id: products[2].id, image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' }
    ];

    await ProductImage.bulkCreate(productImagesData);

    console.log('✓ Tạo dữ liệu mẫu (Trà sữa) thành công!');
  } catch (error) {
    console.error('✗ Lỗi tạo dữ liệu mẫu:', error);
  }
};

module.exports = seedDatabase;
