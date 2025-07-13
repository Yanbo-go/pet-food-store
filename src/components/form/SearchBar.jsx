import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import filterProductsByKeywordLimit10 from "../../utils/filterProductsByKeywordLimit10";
import filterProductsByKeyword from "../../utils/filterProductsByKeyword";

//產品全域搜尋欄
export const ProductSearchBar = ({
  width = "auto",
  allProducts,
  isPage = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStatus, setSearchStatus] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [isOpen, setIsOpen] = useState(window.innerWidth > 850);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);
  const [resultIsOpen, setResultIsOpen] = useState(false);
  const navigate = useNavigate();
  const products = useMemo(() => {
    return allProducts || [];
  }, [allProducts]);

  //搜尋debounce
  const debouncedFetchResults = useDebounce(
    filterProductsByKeywordLimit10,
    1000
  );

  const handleSearchChange = async (e) => {
    if (searchTerm.trim() !== "") {
      setSearchStatus(false);
    }

    const value = e.target.value;
    setSearchTerm(value);
    const filteredData = await debouncedFetchResults(products, value);
    setFilteredData(filteredData);
  };

  const handleSuggestionClick = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filteredData = filterProductsByKeywordLimit10(products, value);
    setFilteredData(filteredData);
    setResultIsOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setSearchStatus(true);
    } else {
      navigate(`/products/search?result=${searchTerm}&p=1`);
    }
  };

  // 監聽視窗大小變化
  useEffect(() => {
    if (isPage) return;
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 850);
      setIsMobile(window.innerWidth < 850);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 點擊外部時關閉搜尋框;
  useEffect(() => {
    if (isPage) return;
    const handleClickOutside = (event) => {
      if (isMobile && isOpen && !event.target.closest(".search-container")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <div className={`${!isPage && isMobile ? "search-container" : ""}`}>
        {!isPage && isMobile && (
          <button
            type="button"
            id="mobileSearch"
            aria-label="mobileSearch"
            className="search-icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className="bi bi-search"></i>
          </button>
        )}
        {(isOpen || isPage) && (
          <div
            className={`position-relative input-group ${
              !isPage && isMobile ? "search-group" : ""
            }`}
            style={{ width: width }}
          >
            <input
              type="text"
              className={`form-control rounded-3  ${
                searchStatus && "is-invalid"
              }`}
              placeholder="搜尋產品..."
              aria-label="搜尋產品"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
              onFocus={() => setResultIsOpen(true)}
            />

            <div className="input-group-append">
              <button
                className="btn btn-dark rounded-3"
                type="button"
                id="search"
                onClick={handleSearch}
              >
                搜尋
              </button>
            </div>

            {searchStatus && (
              <div
                className={`invalid-feedback ${
                  !isPage && "position-absolute bottom-100 start-0  p-0 m-0"
                }`}
              >
                請輸入搜尋內容
              </div>
            )}

            {resultIsOpen && searchTerm && (
              <ul
                className="position-absolute top-100 start-0 w-100 border border-1 border-top-0 p-0 m-0 list-unstyled bg-white"
                style={{ zIndex: 1000 }}
              >
                {filteredData.length === 0 ? (
                  <li style={{ padding: "8px" }}>無相關產品</li>
                ) : (
                  filteredData.map((item) => (
                    <li key={item.id} className="search-feedback-item">
                      <button
                        className="d-flex flex-wrap btn btn-white p-1 border-bottom"
                        type="button"
                        value={item.title}
                        onClick={handleSuggestionClick}
                        onBlur={() => setResultIsOpen(false)}
                        id="keySearchResult"
                      >
                        {item.title}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
};

//產品搜尋欄
export const ProductKeywordSearch = ({
  width = "auto",
  products,
  pageCategory,
  pageValue,
  setProducts,
  setOriginalProducts,
}) => {
  const orginalProductsRef = useRef([]);
  const hasSetInitialProducts = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");

  //搜尋debounce
  const debouncedFetchResults = useDebounce(filterProductsByKeyword, 1000);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filteredData = await debouncedFetchResults(
      orginalProductsRef.current,
      value
    );
    setProducts(filteredData);
    setOriginalProducts(filteredData);
  };

  //首次載入和更換產品列表和更新頁面時更新產品
  useEffect(() => {
    if (!hasSetInitialProducts.current && products) {
      orginalProductsRef.current = products;
      hasSetInitialProducts.current = true;
    }

    return () => {
      hasSetInitialProducts.current = false;
      orginalProductsRef.current = null;
      setSearchTerm("");
    };
  }, [pageCategory, pageValue]);

  return (
    <>
      <div className="position-relative input-group" style={{ width: width }}>
        <input
          type="text"
          className={`form-control rounded-3`}
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </>
  );
};
