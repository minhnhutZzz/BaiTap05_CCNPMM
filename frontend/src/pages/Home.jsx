import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/product.service';

const Home = () => {
  const [promoProducts, setPromoProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  
  // Search & Filter state
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    sort: '',
    is_promotion: false,
    is_new: false
  });
  
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Gọi API đồng thời để lấy dữ liệu trang chủ và danh mục
        const [promoRes, newRes, bestRes, catRes, allRes] = await Promise.all([
          productService.getProducts({ is_promotion: true }),
          productService.getProducts({ is_new: true }),
          productService.getProducts({ sort: 'best_seller' }),
          productService.getCategories(),
          productService.getProducts()
        ]);

        if (promoRes.success) setPromoProducts(promoRes.data);
        if (newRes.success) setNewProducts(newRes.data);
        if (bestRes.success) setBestSellers(bestRes.data.slice(0, 4));
        if (catRes.success) setCategories(catRes.data);
        if (allRes.success) setAllProducts(allRes.data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu trang chủ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Xử lý khi bộ lọc thay đổi
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Áp dụng bộ lọc (gọi API)
  const applyFilters = async () => {
    try {
      setFilterLoading(true);
      const queryParams = { ...filters };
      if (!queryParams.is_promotion) delete queryParams.is_promotion;
      if (!queryParams.is_new) delete queryParams.is_new;
      if (!queryParams.category_id) delete queryParams.category_id;
      if (!queryParams.search) delete queryParams.search;
      if (!queryParams.sort) delete queryParams.sort;

      const res = await productService.getProducts(queryParams);
      if (res.success) {
        setAllProducts(res.data);
      }
    } catch (error) {
      console.error('Lỗi khi lọc sản phẩm:', error);
    } finally {
      setFilterLoading(false);
    }
  };

  // Gọi applyFilters mỗi khi filters thay đổi (có thể dùng debounce nếu cần, ở đây gọi thủ công qua nút Tìm kiếm hoặc đổi dropdown)
  useEffect(() => {
    // Để mượt hơn, tự động gọi API khi đổi Category, Sort, Promo, New. Search text thì chờ bấm nút.
    applyFilters();
  }, [filters.category_id, filters.sort, filters.is_promotion, filters.is_new]);


  const renderProductCard = (product) => (
    <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 overflow-hidden group">
        <img 
          src={product.thumbnail || 'https://via.placeholder.com/150'} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.is_promotion && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Khuyến mãi
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{product.Category?.name}</p>
        <div className="flex justify-between items-center mb-4">
          <div>
            {product.discount_price ? (
              <>
                <span className="text-red-600 font-bold text-lg">{product.discount_price.toLocaleString('vi-VN')} đ</span>
                <span className="text-gray-400 line-through text-sm ml-2">{product.price.toLocaleString('vi-VN')} đ</span>
              </>
            ) : (
              <span className="text-indigo-600 font-bold text-lg">{product.price.toLocaleString('vi-VN')} đ</span>
            )}
          </div>
          <span className="text-xs text-gray-500">Đã bán: {product.sold}</span>
        </div>
        <Link to={`/user/products/${product.id}`} className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors">
          Xem Chi Tiết
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-rose-400 rounded-2xl p-8 mb-12 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Bobatea - Trà Sữa Ngon Nhất!</h1>
        <p className="text-lg opacity-90">Khám phá ngay các hương vị độc quyền chỉ có tại cửa hàng chúng tôi.</p>
      </div>

      {/* Khuyến mãi */}
      {promoProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">🔥 Đang Khuyến Mãi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {promoProducts.map(renderProductCard)}
          </div>
        </section>
      )}

      {/* Mới nhất */}
      {newProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">✨ Trà Sữa Mới Ra Mắt</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newProducts.map(renderProductCard)}
          </div>
        </section>
      )}

      {/* Bán chạy nhất */}
      {bestSellers.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">🏆 Bán Chạy Nhất</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellers.map(renderProductCard)}
          </div>
        </section>
      )}

      {/* Bộ Lọc & Tìm Kiếm */}
      <section className="mb-12 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🔍 Tất Cả Sản Phẩm & Tìm Kiếm</h2>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Tên sản phẩm */}
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tìm theo tên</label>
              <div className="flex">
                <input 
                  type="text" 
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Nhập tên trà sữa..." 
                  className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                />
                <button 
                  onClick={applyFilters}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg transition-colors font-medium"
                >
                  Tìm
                </button>
              </div>
            </div>

            {/* Danh mục */}
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select 
                name="category_id"
                value={filters.category_id}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Sắp xếp */}
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo</label>
              <select 
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">Mới nhất</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
                <option value="best_seller">Bán chạy nhất</option>
              </select>
            </div>

            {/* Khuyến mãi (Checkbox) */}
            <div className="w-full md:w-auto flex items-center h-10 px-2">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="is_promotion"
                  checked={filters.is_promotion}
                  onChange={handleFilterChange}
                  className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                <span className="ml-2 text-gray-700 font-medium whitespace-nowrap">Chỉ khuyến mãi</span>
              </label>
            </div>

            {/* Sản phẩm mới (Checkbox) */}
            <div className="w-full md:w-auto flex items-center h-10 px-2">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="is_new"
                  checked={filters.is_new}
                  onChange={handleFilterChange}
                  className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                />
                <span className="ml-2 text-gray-700 font-medium whitespace-nowrap">Chỉ hàng mới</span>
              </label>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm sau khi lọc */}
        {filterLoading ? (
          <div className="py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : allProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allProducts.map(renderProductCard)}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-12 text-center border border-dashed border-gray-300">
            <h3 className="text-xl font-medium text-gray-600 mb-2">Không tìm thấy sản phẩm nào!</h3>
            <p className="text-gray-500">Vui lòng thử lại với các điều kiện lọc khác.</p>
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;
