import { useEffect, useState, useRef } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Loading from "../../components/Loading";
import { ProductSearchBar } from "../../components/form/SearchBar";
import { motion } from "framer-motion";

function Home() {
  const { allProducts, isLoading, delayed } = useOutletContext();

  return (
    <>
      <div className="container">
        <Loading isLoading={isLoading} />

        <Head allProducts={allProducts} />

        <PromotionalCard delayed={delayed} />

        <FeaturedProducts allproducts={allProducts} />

        <ReviewCard />
      </div>
    </>
  );
}

const Head = ({ allProducts }) => {
  return (
    <>
      <div className="row flex-md-row-reverse flex-column">
        <div className="col-md-6">
          <img
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2643&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="img-fluid object-cover"
            alt="homeImg"
          />
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center md-0 mt-3">
          <h2 className="fw-bold">歡迎來到貓狗之家</h2>
          <h5 className="font-weight-normal text-muted mt-2">
            我們擁有各式各樣的貓狗食品，請盡情選購喜歡的商品
          </h5>
          <ProductSearchBar allProducts={allProducts} isPage={true} />
        </div>
      </div>
    </>
  );
};

const PromotionalCard = ({ delayed }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div className="row mt-2 g-4 justify-content-evenly">
        {[
          {
            id: "highQulity",
            title: "飼料品質保證",
            text: "飼料各項檢驗合格，讓毛孩子吃的安心",
            border: "primary",
          },
          {
            id: "fastShip",
            title: "物流運送，快速送達",
            text: "訂單成立後，1-2天內進行出貨",
            border: "secondary",
          },
          {
            id: "cashBack",
            title: "購物金回饋",
            text: "購物滿1000元，贈送1%回饋金",
            border: "danger",
          },
        ].map((item, index) => (
          <motion.div
            key={item.id}
            className="col-md-3 col-12"
            variants={cardVariants}
            initial="hidden"
            animate={delayed ? "visible" : "hidden"}
            transition={{ duration: 1, delay: index * 0.2 }} // 每張卡片延遲進場
            data-testid={`${item.id}-card`}
          >
            <div
              className={`card border-${item.border} shadow h-100 card-hover rounded-3`}
            >
              <div className="card-body text-center">
                <h5
                  className={`card-title fw-bold text-uppercase text-${item.border}`}
                >
                  {item.title}
                </h5>
                <p className="card-text">{item.text}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

const FeaturedProducts = ({ allproducts }) => {
  return (
    <>
      <div className="mt-5">
        <h1 className="mb-3 d-flex justify-content-center align-items-center ">
          精選商品
        </h1>
        <div className="row mt-md-3 mt-lg-2 g-5">
          {allproducts.map((product) => {
            return (
              <div
                className="col-6 col-sm-4 col-md-3 col-lg-2 mt-md-3 mt-lg-2 shadow-sm"
                key={product.id}
              >
                <div className="card text-center border-0 mb-4 product-card">
                  <Link
                    className="text-decoration-none"
                    to={`/products/${product.id}`}
                  >
                    <div className="d-flex justify-content-center align-items-center product-card__image-wrapper">
                      <img
                        src={`${
                          product.imageUrl === ""
                            ? "https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1916&q=80"
                            : product.imageUrl
                        }`}
                        className="object-cover product-card__image"
                        alt="..."
                      />
                    </div>
                    <div className="mt-3 product-card__link-wrapper">
                      <p>{product.title}</p>
                    </div>
                  </Link>
                  <div className="card-body p-0 product-card__body">
                    <div className="d-flex flex-column">
                      <p className="text-nowrap">{`${product.price}元`}</p>
                      <p className="card-text text-muted">{product.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const ReviewCard = () => {
  const containerRef = useRef(null);
  const [maxDrag, setMaxDrag] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = containerRef.current.scrollWidth - containerWidth; // 計算內容長度
      setMaxDrag(-contentWidth); // 設定可拖曳範圍
    }
  });

  return (
    <>
      <div className="row mt-3 mb-5 g-3 justify-content-around">
        <div className="mb-3 d-flex flex-column justify-content-center align-items-center">
          <h1>評論區</h1>
        </div>
        <motion.div
          ref={containerRef} //紀錄評論區內容總長度
          whileTap={{ cursor: "grabbing" }} // 滑動時變抓取手勢
          className="overflow-hidden" //超過時不顯示滑條
          style={{ padding: "15px" }}
        >
          <motion.div
            drag="x"
            dragConstraints={{ left: maxDrag, right: 0 }} // 根據內容長度自動調整滑動範圍
            dragElastic={0} //拖移時不回彈
            className="d-flex gap-3"
          >
            {[
              {
                product: "貓貓鮪魚飼料",
                commenter: "花兒",
                content: "品質很好，毛小孩不挑食",
              },
              {
                product: "狗狗潔牙神器",
                commenter: "明月",
                content: "出貨非常快速，還會再回購",
              },
              {
                product: "狗狗大型犬保健飼料(3kg)",
                commenter: "麗",
                content: "吃完之後，活動力很好!!!",
              },
              {
                product: "兔兔飼料",
                commenter: "小芳",
                content: "成分天然，毛孩超喜歡",
              },
              {
                product: "貓貓黑飼料",
                commenter: "大強",
                content: "價格實惠，CP值超高",
              },
              {
                product: "狗狗健康飼料",
                commenter: "美美",
                content: "客服服務超棒，值得推薦!",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="card-hover bg-white border border-secondary rounded-3 p-4 shadow-lg "
                style={{
                  minWidth: "250px",
                  height: "15rem",
                  flex: "0 0 auto", // 防止卡片壓縮
                }}
              >
                <h5 className="">{item.product}</h5>
                <div className="bg-light h-75  text-muted">
                  <div>
                    <p style={{ fontSize: "1rem" }}>{item.commenter} :</p>
                  </div>
                  <div className="text-center">
                    <span>{item.content}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Home;
