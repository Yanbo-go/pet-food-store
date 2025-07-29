import { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { Link, useLocation, useSearchParams, NavLink } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import {
  ProductSearchBar,
  ProductKeywordSearch,
} from "../../components/form/SearchBar";
import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../../redux/slice/messageSlice";

function Products() {
  const apiPath = process.env.REACT_APP_APT_PATH;
  const { allProducts, isLoading, setIsLoading } = useOutletContext();
  const dispatch = useDispatch();
  //產品保存
  const [originalProducts, setOriginalProducts] = useState([]);
  const [products, setProducts] = useState([]);
  //保存頁面
  const [pagination, setPagination] = useState();
  //保存頁面狀態
  const [pageCategory, setPageCategory] = useState();
  //保存排序值
  const [sortOrder, setSortOrder] = useState("default");
  //排序值
  const options = [
    { value: "default", label: "預設排序" },
    { value: "price-asc", label: "價格：低 → 高" },
    { value: "price-desc", label: "價格：高 → 低" },
  ];
  //取得搜尋值
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchValue = queryParams.get("result");
  const pageValue = queryParams.get("p");
  const catergoryValue = queryParams.get("category");
  //處理搜尋分頁顯示
  const [productsByKeyWord, setProductsByKeyWord] = useState([]);
  const [searchedCurrentPage, setSearchedCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);
  //處理下拉式載入
  const lastProductRef = (node) => {
    if (!node) return;

    if (productsByKeyWord.length === products.length) {
      setHasMore(false);
      if (observer.current) {
        observer.current.disconnect();
      }
      return;
    }

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProducts();
        }
      },
      { rootMargin: "0px 0px 10px 0px", threshold: 1.0 }
    );

    observer.current.observe(node);
  };

  const loadMoreProducts = () => {
    queryParams.set("p", searchedCurrentPage + 1);
    setSearchParams(queryParams);
  };

  const getProducts = async (page = 1) => {
    setIsLoading(true);
    try {
      const productRes = await axios.get(
        `/v2/api/${apiPath}/products?page=${page}`
      );
      setProducts(productRes.data.products);
      setOriginalProducts(productRes.data.products);
      setPageCategory(productRes.data.pagination.category);
      setPagination(productRes.data.pagination);
      queryParams.set("p", page);
      setSearchParams(queryParams);
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      setIsLoading(false);
    }
  };

  const getProductsByCategory = async (catergoryValue, page = 1) => {
    setIsLoading(true);
    try {
      const productRes = await axios.get(
        `/v2/api/${apiPath}/products?page=${page}&category=${catergoryValue}`
      );
      console.log("產品分類列表", productRes);
      setProducts(productRes.data.products);
      setOriginalProducts(productRes.data.products);
      setPageCategory(productRes.data.pagination.category);
      setPagination(productRes.data.pagination);
      queryParams.set("p", page);
      setSearchParams(queryParams);
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      setIsLoading(false);
    }
  };

  const getProductsFromKeyWord = async (searchValue, page = 1) => {
    if (productsByKeyWord.length !== 0) {
      setSearchedCurrentPage(Number(page)); //重設起始頁面
    }

    setIsLoading(true);
    try {
      const productRes = await axios.get(`/v2/api/${apiPath}/products/all`);
      const filterProduct = productRes.data.products.filter((item) => {
        return (
          item.title.toLowerCase().includes(searchValue) ||
          item.description.toLowerCase().includes(searchValue)
        );
      });
      setProductsByKeyWord(filterProduct); //保存過濾完產品
      setSearchedCurrentPage(Number(page)); //重設起始頁面
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      setIsLoading(false);
    }
  };
  //處理呼叫哪個API
  useEffect(() => {
    if (searchValue) {
      getProductsFromKeyWord(searchValue, pageValue);
      return;
    }
    if (catergoryValue) {
      getProductsByCategory(catergoryValue, pageValue === null ? 1 : pageValue);
      return;
    }
    if (!searchValue && !catergoryValue) {
      getProducts(pageValue === null ? 1 : pageValue);
    }
  }, [searchValue, catergoryValue, pageValue]);
  //處理關鍵字分頁
  useEffect(() => {
    const perPage = 8;
    const endIndex = searchedCurrentPage * perPage;
    setProducts(productsByKeyWord.slice(0, endIndex));
    setOriginalProducts(productsByKeyWord.slice(0, endIndex));

    return () => {
      setHasMore(true);
    };
  }, [productsByKeyWord, searchedCurrentPage]);
  //處理排序方式
  useEffect(() => {
    setProducts(() => {
      if (sortOrder === "default") return originalProducts;

      return [...products].sort((a, b) => {
        if (sortOrder === "price-asc") return a.price - b.price;
        if (sortOrder === "price-desc") return b.price - a.price;
        return 0;
      });
    });
  }, [sortOrder]);

  return (
    <>
      <div className="container mt-md-5 mt-3 mb-7">
        <div className="d-flex flex-wrap justify-content-between mb-5">
          <Breadcrumb
            searchValue={searchValue}
            catergoryValue={catergoryValue}
          />

          <div className="d-flex flex-wrap gap-3 mt-3">
            {/* 搜尋框 */}
            {searchValue ? (
              <ProductSearchBar allProducts={allProducts} isPage={true} />
            ) : (
              <ProductKeywordSearch
                width="15rem"
                products={originalProducts}
                pageCategory={pageCategory}
                pageValue={pageValue}
                setProducts={setProducts}
                setOriginalProducts={setOriginalProducts}
              />
            )}

            {/* 排序方式 */}
            <SortOrder
              searchValue={searchValue}
              products={products}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              productsByKeyWord={productsByKeyWord}
              options={options}
            />
          </div>
        </div>

        <Loading isLoading={isLoading} />

        <DisplayProducts
          products={products}
          productsByKeyWord={productsByKeyWord}
          lastProductRef={lastProductRef}
        />

        {!hasMore && searchValue && (
          <p className="text-center mt-4">底下沒有更多產品了...</p>
        )}

        {pagination && (
          <Pagination
            pagination={pagination}
            changePage={getProducts}
            changePageByCategory={getProductsByCategory}
          />
        )}
      </div>
    </>
  );
}

const Breadcrumb = ({ searchValue, catergoryValue }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb m-0 p-0">
        <li className="breadcrumb-item">
          <NavLink to="/" className="text-decoration-none text-muted">
            首頁
          </NavLink>
        </li>
        {searchValue ? (
          <>
            <li className="breadcrumb-item">
              <NavLink
                to="/products"
                className="text-decoration-none text-muted"
              >
                全部產品
              </NavLink>
            </li>
            <li className="breadcrumb-item active fw-bold" aria-current="page">
              {`搜尋"${searchValue}"的結果`}
            </li>
          </>
        ) : (
          <li className="breadcrumb-item active fw-bold" aria-current="page">
            {catergoryValue || "全部產品"}
          </li>
        )}
      </ol>
    </nav>
  );
};

const SortOrder = ({
  searchValue,
  products,
  sortOrder,
  setSortOrder,
  productsByKeyWord,
  options,
}) => {
  return (
    <div className="d-flex d-flex align-items-center flex-nowarp gap-3">
      <div className="dropdown">
        <button
          className="btn btn-outline-secondary dropdown-toggle rounded-3 mx-2"
          type="button"
          id="sortOrderDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {sortOrder === "default"
            ? "預設排序"
            : sortOrder === "price-asc"
              ? "價格：低 → 高"
              : "價格：高 → 低"}
        </button>
        <ul className="dropdown-menu" aria-labelledby="sortOrderDropdown">
          <li>
            <a
              className="dropdown-item"
              onClick={() => {
                setSortOrder("default");
              }}
              role="button"
              aria-label="標準排序"
            >
              預設排序
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => {
                setSortOrder("price-asc");
              }}
              role="button"
              aria-label="升序"
            >
              價格：低 → 高
            </a>
          </li>
          <li>
            <a
              className="dropdown-item"
              onClick={() => {
                setSortOrder("price-desc");
              }}
              role="button"
              aria-label="降序"
            >
              價格：高 → 低
            </a>
          </li>
        </ul>
      </div>
      <div>
        <span>{`顯示第 ${products.length === 0 ? 0 : 1} 至 ${
          products.length
        } 項結果，共 ${
          searchValue ? productsByKeyWord.length : products.length
        } 項`}</span>
      </div>
    </div>
  );
};

const DisplayProducts = ({ products, productsByKeyWord, lastProductRef }) => {
  return (
    <div className="row g-5 mb-5">
      {products.length === 0 ? (
        <h2 className="p-5 text-center">無法搜尋到相關產品</h2>
      ) : (
        products.map((item, i) => {
          return (
            <div className="col-6 col-md-4 col-lg-3 shadow-sm" key={item.id}>
              <div className="card border-0 mb-4 position-relative">
                <img
                  src={item.imageUrl}
                  className="card-img-top rounded-0 object-cover"
                  style={{ height: "200px" }}
                  alt="..."
                />
                <div className="card-body p-0 mt-2">
                  <div>
                    <p
                      className="mb-0"
                      data-testid="product-title"
                      style={{ height: "44.4px" }}
                    >
                      <Link to={`/products/${item.id}`}>{item.title}</Link>
                    </p>
                  </div>

                  <div className="card-text" style={{ height: "100px" }}>
                    <p className="mt-0">NT$ {item.price}</p>
                    <p className="text-muted m-0">{item.content}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
      <div
        ref={productsByKeyWord.length ? lastProductRef : null}
        data-testid="fixedLastProduct"
      ></div>
    </div>
  );
};

export default Products;
