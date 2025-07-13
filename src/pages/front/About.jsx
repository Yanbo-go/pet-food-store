import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Loading from "../../components/Loading";
import { motion } from "framer-motion";

function About() {
  const { isLoading: parentIsLoading, delayed: parentDelayed } =
    useOutletContext();

  const conceptData = [
    {
      title: "Story",
      status: true,
      subtitle: "讓每個毛孩都能擁有最好的",
      context:
        "我們相信，每個毛孩都是家庭的一份子，值得最好的照顧與愛。我們精選高品質的食品，讓毛孩的每一天都充滿幸福與健康。不只是購物，更是一種愛的傳遞。",
      imgUrl:
        "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Team",
      status: false,
      subtitle: "用心，為毛孩打造美好生活",
      context:
        "我們是一群熱愛寵物的夥伴，致力於為毛孩與飼主提供最優質的產品與服務。我們相信，透過專業的選品、貼心的顧客服務與不斷創新，能夠讓每個毛孩都擁有更健康、快樂的生活。我們不只是賣商品，更是在建立一個充滿愛與信任的寵物社群。",
      imgUrl:
        "https://plus.unsplash.com/premium_photo-1707353402256-3afa1e567b54?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Quality",
      status: false,
      subtitle: "嚴選品質，給毛孩最好的保障",
      context:
        "我們對每一項產品都秉持最高標準，精選安全、健康、可靠的寵物用品，確保符合國際品質與安全規範。我們與信譽良好的品牌與供應商合作，並持續檢驗與優化產品，讓每位飼主都能安心選購，給毛孩最好的呵護。",
      imgUrl:
        "https://images.unsplash.com/photo-1628524783675-275f685b3ad6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const [selectConcept, setSelectConcept] = useState(conceptData);

  const handleConceptChange = (id) => {
    setSelectConcept((prev) =>
      prev.map((item) =>
        item.title === id
          ? { ...item, status: true }
          : { ...item, status: false }
      )
    );
  };

  return (
    <>
      <div className="container p-5">
        <Loading isLoading={parentIsLoading} />

        <Head />

        <PromotionalCard
          delayed={parentDelayed}
          handleConceptChange={handleConceptChange}
        />

        {selectConcept.map((item) =>
          item.status === true ? (
            <Concept
              title={item.title}
              subtitle={item.subtitle}
              context={item.context}
              imgUrl={item.imgUrl}
              key={item.title}
            />
          ) : (
            ""
          )
        )}
      </div>
    </>
  );
}

const Head = () => {
  return (
    <>
      <div className="d-flex justify-content-center">
        <img
          src="https://images.unsplash.com/photo-1623099354893-9a1fbd0dbb3f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="img-fluid w-75 object-cover"
          alt="aboutImg"
          style={{ height: "30vh" }}
        />
      </div>
    </>
  );
};

const PromotionalCard = ({ delayed, handleConceptChange }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div className="row mt-2 g-3 justify-content-center">
        {[
          {
            id: "Story",
            title: "品牌理念",
            border: "primary",
          },
          {
            id: "Team",
            title: "團隊理念",
            border: "secondary",
          },
          {
            id: "Quality",
            title: "品質保證",
            border: "danger",
          },
        ].map((item, index) => (
          <motion.div
            key={item.id}
            className="col-md-3 col-12"
            variants={cardVariants}
            initial="hidden"
            animate={delayed ? "visible" : "hidden"}
            transition={{ duration: 1, delay: index * 0.2 }}
            data-testid={`${item.id}-card`}
          >
            <div
              id={item.id}
              role="button"
              className={`card border-${item.border} shadow h-100 card-hover rounded-3`}
              onClick={() => handleConceptChange(item.id)}
            >
              <div className="card-body text-center">
                <h5
                  className={`card-title fw-bold text-uppercase text-${item.border}`}
                >
                  {item.title}
                </h5>
                <p className="card-text">{item.id}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

const Concept = ({ title, subtitle, context, imgUrl, id }) => {
  return (
    <>
      <div
        className="row d-flex flex-lg-row-reverse justify-content-center p-5 mt-5"
        key={id}
      >
        <div className="col-12 col-md-5">
          <img
            src={imgUrl}
            className="img-fluid object-cover w-100"
            alt="..."
          />
        </div>
        <div className="col-12 col-md-5 d-flex flex-column justify-content-center mt-1 mt-lg-0">
          <h3 className="fw-bold text-primary">{title}</h3>
          <h5 className="fw-bold">{subtitle}</h5>
          <p className="font-weight-normal text-muted mt-2">{context}</p>
        </div>
      </div>
    </>
  );
};

export default About;
