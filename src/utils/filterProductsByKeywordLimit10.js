//SearchAutocomplete產品過濾
const filterProductsByKeywordLimit10 = (products, searchResult) => {
  return products
    .filter((item) =>
      item.title.toLowerCase().includes(searchResult.trim().toLowerCase())
    )
    .slice(0, 10);
};

export default filterProductsByKeywordLimit10;
