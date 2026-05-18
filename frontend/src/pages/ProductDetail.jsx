import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import productService from '../services/product.service';

const ProductDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const res = await productService.getProductById(id);
        if (res.success) {
          setData(res.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải chi tiết sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  if (!data || !data.product) {
    return <div className="min-h-screen flex items-center justify-center"><h2 className="text-2xl text-gray-500">Không tìm thấy sản phẩm</h2></div>;
  }

  const { product, similarProducts } = data;
  
  // Gộp ảnh thumbnail và ảnh phụ cho swiper
  const allImages = [product.thumbnail, ...(product.images?.map(img => img.image_url) || [])].filter(Boolean);

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        
        {/* Phần Hình Ảnh (Swiper) */}
        <div className="md:w-1/2 p-6 bg-gray-50">
          {allImages.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="w-full h-[400px] rounded-xl overflow-hidden shadow-sm"
            >
              {allImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <img src={img} alt={`${product.name} ${index}`} className="w-full h-full object-cover" />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center rounded-xl">
              <span className="text-gray-400">Không có hình ảnh</span>
            </div>
          )}
        </div>

        {/* Phần Thông Tin */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full">
                Danh mục: {product.Category?.name}
              </span>
              {product.is_promotion && (
                <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                  Đang Khuyến Mãi
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-end gap-4 mb-6 border-b border-gray-100 pb-6">
              {product.discount_price ? (
                <>
                  <span className="text-4xl font-extrabold text-red-600">{product.discount_price.toLocaleString('vi-VN')} đ</span>
                  <span className="text-xl text-gray-400 line-through mb-1">{product.price.toLocaleString('vi-VN')} đ</span>
                </>
              ) : (
                <span className="text-4xl font-extrabold text-indigo-600">{product.price.toLocaleString('vi-VN')} đ</span>
              )}
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description || "Chưa có mô tả cho sản phẩm này."}
            </p>

            <div className="flex gap-8 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Hàng tồn kho</p>
                <p className="text-xl font-bold text-gray-800">{product.stock} ly</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Đã bán</p>
                <p className="text-xl font-bold text-emerald-600">{product.sold} ly</p>
              </div>
            </div>

            {/* Chọn số lượng */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-gray-700 font-medium">Số lượng:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={handleDecrease} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors font-bold">-</button>
                <span className="px-6 py-2 border-x border-gray-300 font-semibold">{quantity}</span>
                <button onClick={handleIncrease} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors font-bold">+</button>
              </div>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:-translate-y-1">
            Thêm Vào Giỏ Hàng
          </button>
        </div>
      </div>

      {/* Sản phẩm tương tự */}
      {similarProducts && similarProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-indigo-600 pl-4">Sản Phẩm Tương Tự</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map(sim => (
              <Link to={`/user/products/${sim.id}`} key={sim.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all group">
                <div className="h-40 overflow-hidden rounded-lg mb-4">
                  <img src={sim.thumbnail || 'https://via.placeholder.com/150'} alt={sim.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-semibold text-gray-800 truncate mb-2">{sim.name}</h3>
                <span className="text-indigo-600 font-bold">{sim.discount_price ? sim.discount_price.toLocaleString('vi-VN') : sim.price.toLocaleString('vi-VN')} đ</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
