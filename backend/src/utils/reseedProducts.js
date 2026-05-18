require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const initDb = require('../config/initDb');
const { Category, Product, ProductImage } = require('../models');

const reseedProducts = async () => {
  // Khởi tạo DB trước
  await initDb();

  try {
    console.log('\n🔄 Đang xóa dữ liệu sản phẩm cũ...');
    await ProductImage.destroy({ where: {}, truncate: false });
    await Product.destroy({ where: {}, truncate: false });
    await Category.destroy({ where: {}, truncate: false });

    console.log('🌱 Đang tạo lại danh mục...');
    const categories = await Category.bulkCreate([
      { name: 'Trà Sữa Truyền Thống', description: 'Các loại trà sữa cơ bản' },
      { name: 'Trà Trái Cây', description: 'Trà kết hợp trái cây tươi mát' },
      { name: 'Macchiato & Kem Cheese', description: 'Đồ uống có lớp kem béo' }
    ]);

    console.log('🌱 Đang tạo lại sản phẩm...');
    const products = await Product.bulkCreate([
      {
        name: 'Trà Sữa Trân Châu Đường Đen',
        description: 'Vị trà sữa đậm đà kết hợp với trân châu dai giòn và đường đen thơm lừng.',
        price: 35000,
        discount_price: 30000,
        stock: 100,
        sold: 50,
        thumbnail: 'https://res.cloudinary.com/dpofwhvku/image/upload/ofhsy89nfxtxgsjbepfp.jpg',
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
        thumbnail: 'https://res.cloudinary.com/dpofwhvku/image/upload/gongpd3dfd4m9dn8msii.png',
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
        thumbnail: 'https://res.cloudinary.com/dpofwhvku/image/upload/lauocanylgrytvuqdagx.jpg',
        is_new: true,
        is_promotion: false,
        category_id: categories[2].id
      },
      {
        name: 'Hồng Trà Sữa',
        description: 'Hồng trà thơm nhẹ hòa quyện cùng sữa tươi béo ngậy.',
        price: 38000,
        discount_price: 33000,
        stock: 80,
        sold: 35,
        thumbnail: 'https://res.cloudinary.com/dpofwhvku/image/upload/tr10shdi8ktmewytriyk.jpg',
        is_new: false,
        is_promotion: true,
        category_id: categories[0].id
      },
      {
        name: 'Trà Dâu Kem Cheese',
        description: 'Trà dâu chua ngọt kết hợp lớp kem cheese mặn béo độc đáo.',
        price: 52000,
        stock: 60,
        sold: 25,
        thumbnail: 'https://res.cloudinary.com/dpofwhvku/image/upload/yiseifcmp9cexoh6eyid.jpg',
        is_new: true,
        is_promotion: false,
        category_id: categories[2].id
      },
      {
        name: 'Trà Chanh Leo',
        description: 'Chanh leo chua ngọt, mát lạnh, giải khát hoàn hảo.',
        price: 42000,
        stock: 90,
        sold: 80,
        thumbnail: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        is_new: false,
        is_promotion: false,
        category_id: categories[1].id
      }
    ]);

    console.log('🌱 Đang tạo ảnh bổ sung cho sản phẩm...');
    await ProductImage.bulkCreate([
      // Trà Sữa Trân Châu Đường Đen [0]
      { product_id: products[0].id, image_url: 'https://res.cloudinary.com/dpofwhvku/image/upload/umctriflkcqcb5mlrgkm.jpg' },
      { product_id: products[0].id, image_url: 'https://res.cloudinary.com/dpofwhvku/image/upload/mutbr8m14ouyvckubis6.jpg' },
      // Trà Sữa Oolong Nướng [1]
      { product_id: products[1].id, image_url: 'https://res.cloudinary.com/dpofwhvku/image/upload/obibrgzlkjlgrg5o082j.jpg' },
      { product_id: products[1].id, image_url: 'https://res.cloudinary.com/dpofwhvku/image/upload/xzet0vg5xft9rdnvqxhy.jpg' },
      // Trà Đào Cam Sả [2] - giữ ảnh cũ
      { product_id: products[2].id, image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
      { product_id: products[2].id, image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
      // Trà Xoài Kem Cheese [3]
      { product_id: products[3].id, image_url: 'https://res.cloudinary.com/dpofwhvku/image/upload/x9kzrfaaa3bair9paslf.jpg' },
      { product_id: products[3].id, image_url: 'https://res.cloudinary.com/dpofwhvku/image/upload/i9swqy69vs1pkxrdlbc1.jpg' },
      // Hồng Trà Sữa [4]
      { product_id: products[4].id, image_url: 'https://res.cloudinary.com/dpofwhvku/image/upload/xhdcatx70h5x60xevbd3.jpg' },
      { product_id: products[4].id, image_url: 'https://res.cloudinary.com/dpofwhvku/image/upload/x2yjs0uabk2cmjx8dfig.jpg' },
      // Trà Dâu Kem Cheese [5]
      { product_id: products[5].id, image_url: 'https://res.cloudinary.com/dpofwhvku/image/upload/ulft3ffi3armelfe29fi.jpg' },
      { product_id: products[5].id, image_url: 'https://res.cloudinary.com/dpofwhvku/image/upload/lf2xrcyscqk6gk3elywu.jpg' },
      // Trà Chanh Leo [6]
      { product_id: products[6].id, image_url: 'https://res.cloudinary.com/dpofwhvku/image/upload/ecrnhbimthzgnvbzyp1p.jpg' },
      { product_id: products[6].id, image_url: 'https://res.cloudinary.com/dpofwhvku/image/upload/bhqhk8uelx0tetgnoxsh.jpg' }
    ]);

    console.log(`\n✅ Hoàn thành! Đã tạo:`);
    console.log(`   - ${categories.length} danh mục`);
    console.log(`   - ${products.length} sản phẩm`);
    console.log('   - Ảnh bổ sung cho sản phẩm');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed lại dữ liệu:', error.message);
    process.exit(1);
  }
};

reseedProducts();
