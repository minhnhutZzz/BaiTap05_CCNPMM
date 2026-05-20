import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/product.service';

// ---- Component: Product Card ----
const ProductCard = ({ product }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <div className="relative h-48 overflow-hidden group">
      <img
        src={product.thumbnail || 'https://placehold.co/300x200?text=No+Image'}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      {product.is_promotion && (
        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Khuyến mãi
        </span>
      )}
      {product.is_new && (
        <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Mới
        </span>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-gray-800 text-base truncate">{product.name}</h3>
      <p className="text-gray-400 text-xs mb-2">{product.Category?.name}</p>
      <div className="flex justify-between items-center mb-3">
        <div>
          {product.discount_price ? (
            <>
              <span className="text-red-600 font-bold text-base">{Number(product.discount_price).toLocaleString('vi-VN')} đ</span>
              <span className="text-gray-400 line-through text-xs ml-2">{Number(product.price).toLocaleString('vi-VN')} đ</span>
            </>
          ) : (
            <span className="text-indigo-600 font-bold text-base">{Number(product.price).toLocaleString('vi-VN')} đ</span>
          )}
        </div>
        <div className="text-xs text-gray-400 text-right">
          <div>Bán: {product.sold}</div>
          <div>Xem: {product.views ?? 0}</div>
        </div>
      </div>
      <Link
        to={`/user/products/${product.id}`}
        className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors text-sm"
      >
        Xem Chi Tiết
      </Link>
    </div>
  </div>
);

// ---- Component: Horizontal Pagination ----
const HorizontalPagination = ({ currentPage, totalPages, onPageChange, label }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-sm"
      >
        ← Trước
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
            p === currentPage
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white border border-gray-300 text-gray-600 hover:bg-indigo-50'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-sm"
      >
        Tiếp →
      </button>
      <span className="text-xs text-gray-400 ml-2">
        Trang {currentPage}/{totalPages} — {label}
      </span>
    </div>
  );
};

// ---- Component: Top Products Section (Best Sellers / Most Viewed) ----
const TopProductsSection = ({ title, icon, fetchFn }) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (page) => {
    setLoading(true);
    try {
      const res = await fetchFn({ page, limit: 10 });
      if (res.success) {
        setProducts(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const handlePageChange = (page) => {
    fetchData(page);
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        {icon} {title}
        <span className="ml-auto text-sm font-normal text-gray-400">
          {pagination.total} sản phẩm
        </span>
      </h2>
      <p className="text-sm text-gray-500 mb-6">Top {Math.min(pagination.total, 10)} sản phẩm — phân trang ngang</p>

      {loading ? (
        <div className="py-10 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <HorizontalPagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            label={`${pagination.total} sản phẩm`}
          />
        </>
      )}
    </section>
  );
};

// ---- Component: All Products with Category Filter + Lazy Loading ----
const AllProductsSection = ({ categories }) => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    sort: '',
    is_promotion: false,
    is_new: false,
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const loaderRef = useRef(null);
  const filtersRef = useRef(filters);
  const loadingRef = useRef(false);

  // Fetch products (reset or append)
  const fetchProducts = useCallback(async (currentPage, currentFilters, reset = false) => {
    if (loadingRef.current && !reset) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 8, ...currentFilters };
      if (!params.is_promotion) delete params.is_promotion;
      if (!params.is_new) delete params.is_new;
      if (!params.category_id) delete params.category_id;
      if (!params.search) delete params.search;
      if (!params.sort) delete params.sort;

      const res = await productService.getProducts(params);
      if (res.success) {
        if (reset) {
          setProducts(res.data);
        } else {
          setProducts((prev) => [...prev, ...res.data]);
        }
        setHasMore(res.pagination.hasMore);
      }
    } catch (err) {
      console.error(err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  // Load trang đầu khi mount
  useEffect(() => {
    fetchProducts(1, filters, true);
  }, []);

  // Khi filter thay đổi → reset về trang 1
  const applyFilters = useCallback((newFilters) => {
    filtersRef.current = newFilters;
    setPage(1);
    setHasMore(true);
    setProducts([]);
    fetchProducts(1, newFilters, true);
  }, [fetchProducts]);

  // Lazy Loading: IntersectionObserver theo dõi phần tử loaderRef
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchProducts(nextPage, filtersRef.current, false);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );
    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [hasMore, loading, fetchProducts]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = {
      ...filtersRef.current,
      [name]: type === 'checkbox' ? checked : value
    };
    filtersRef.current = newFilters;
    if (name !== 'search') {
      applyFilters(newFilters);
    } else {
      // Chỉ cập nhật state nhưng không gọi API (chờ Enter hoặc bấm nút)
      setFilters(newFilters);
    }
  };

  const handleSearchSubmit = () => {
    applyFilters(filtersRef.current);
  };

  return (
    <section className="mb-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📦 Tất Cả Sản Phẩm Theo Danh Mục</h2>

      {/* Bộ lọc */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end flex-wrap">
          {/* Tìm kiếm */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tìm theo tên</label>
            <div className="flex">
              <input
                type="text"
                name="search"
                defaultValue=""
                onChange={handleFilterChange}
                placeholder="Nhập tên trà sữa..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              />
              <button
                onClick={handleSearchSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg transition-colors font-medium text-sm"
              >
                Tìm
              </button>
            </div>
          </div>

          {/* Danh mục */}
          <div className="w-full md:w-44">
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select
              name="category_id"
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Sắp xếp */}
          <div className="w-full md:w-44">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp</label>
            <select
              name="sort"
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            >
              <option value="">Mới nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="best_seller">Bán chạy nhất</option>
              <option value="most_viewed">Xem nhiều nhất</option>
            </select>
          </div>

          {/* Checkbox Khuyến mãi */}
          <div className="flex items-center h-10 px-1">
            <label className="flex items-center cursor-pointer gap-2">
              <input
                type="checkbox"
                name="is_promotion"
                onChange={handleFilterChange}
                className="w-4 h-4 text-indigo-600 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700 whitespace-nowrap">Khuyến mãi</span>
            </label>
          </div>

          {/* Checkbox Hàng mới */}
          <div className="flex items-center h-10 px-1">
            <label className="flex items-center cursor-pointer gap-2">
              <input
                type="checkbox"
                name="is_new"
                onChange={handleFilterChange}
                className="w-4 h-4 text-emerald-600 rounded border-gray-300"
              />
              <span className="text-sm text-gray-700 whitespace-nowrap">Hàng mới</span>
            </label>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      {initialLoading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center border border-dashed border-gray-300">
          <h3 className="text-xl font-medium text-gray-600 mb-2">Không tìm thấy sản phẩm nào!</h3>
          <p className="text-gray-500">Vui lòng thử lại với các điều kiện lọc khác.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => <ProductCard key={`${p.id}-${products.indexOf(p)}`} product={p} />)}
          </div>

          {/* Loader dùng cho IntersectionObserver */}
          <div ref={loaderRef} className="py-8 flex justify-center">
            {loading && (
              <div className="flex items-center gap-2 text-indigo-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
                <span className="text-sm">Đang tải thêm...</span>
              </div>
            )}
            {!hasMore && !loading && (
              <p className="text-gray-400 text-sm">✅ Đã hiển thị tất cả {products.length} sản phẩm</p>
            )}
          </div>
        </>
      )}
    </section>
  );
};

// ---- Trang chủ chính ----
const Home = () => {
  const [categories, setCategories] = useState([]);
  const [promoProducts, setPromoProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [promoRes, newRes, catRes] = await Promise.all([
          productService.getProducts({ is_promotion: true, limit: 4 }),
          productService.getProducts({ is_new: true, limit: 4 }),
          productService.getCategories(),
        ]);
        if (promoRes.success) setPromoProducts(promoRes.data);
        if (newRes.success) setNewProducts(newRes.data);
        if (catRes.success) setCategories(catRes.data);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu trang chủ:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-rose-500 rounded-2xl p-10 mb-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3">Bobatea - Trà Sữa Ngon Nhất! 🧋</h1>
          <p className="text-lg opacity-90">Khám phá ngay các hương vị độc quyền chỉ có tại cửa hàng chúng tôi.</p>
        </div>
        <div className="absolute -right-10 -bottom-10 text-[180px] opacity-10 select-none">🧋</div>
      </div>

      {/* Khuyến mãi */}
      {promoProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🔥 Đang Khuyến Mãi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {promoProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Mới nhất */}
      {newProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">✨ Trà Sữa Mới Ra Mắt</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ---- CHỨC NĂNG 2: Top 10 Bán Chạy Nhất (phân trang ngang) ---- */}
      <TopProductsSection
        title="Top 10 Sản Phẩm Bán Chạy Nhất"
        icon="🏆"
        fetchFn={productService.getTopBestSellers}
      />

      {/* ---- CHỨC NĂNG 2: Top 10 Xem Nhiều Nhất (phân trang ngang) ---- */}
      <TopProductsSection
        title="Top 10 Sản Phẩm Xem Nhiều Nhất"
        icon="👁️"
        fetchFn={productService.getTopMostViewed}
      />

      {/* ---- CHỨC NĂNG 1: Tất Cả Sản Phẩm Theo Danh Mục + Lazy Loading ---- */}
      <AllProductsSection categories={categories} />

    </div>
  );
};

export default Home;
