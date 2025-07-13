//SearchAutocomplete產品過濾
const filterProductsByKeyword = (products, searchResult) => {
  if (!searchResult || !searchResult.trim()) {
    return products;
  }

  return products.filter((item) =>
    item.title.toLowerCase().includes(searchResult.trim().toLowerCase())
  );
};

export default filterProductsByKeyword;
