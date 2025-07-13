import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

const cartData = {
  carts: [
    {
      id: "1",
      product: {
        id: "p1",
        imageUrl: "test.jpg",
        title: "貓罐頭",
      },
      qty: 2,
      final_total: 300,
    },
  ],
  final_total: 300,
};

const allProducts = [
  { id: "p1", title: "貓罐頭" },
  { id: "p2", title: "狗飼料" },
];

const renderNavBar = (pathname = "/") => {
  render(
    <MemoryRouter initialEntries={[pathname]}>
      <Navbar cartData={cartData} allProducts={allProducts} />
    </MemoryRouter>
  );
};

describe("NavBar首頁", () => {
  beforeEach(() => {
    renderNavBar();
  });

  test("首頁正常渲染 logo 和 標題", () => {
    expect(screen.getByAltText(/logo/i)).toHaveAttribute(
      "src",
      "/images/logo_houseOpen.png"
    );
    expect(screen.getByText("貓狗の家")).toBeInTheDocument();
  });

  test("導覽列正常顯示", () => {
    expect(screen.getByText("關於我們")).toBeInTheDocument();
    expect(screen.getByText("產品列表")).toBeInTheDocument();
    expect(screen.getByText("全部產品")).toBeInTheDocument();
    expect(screen.getByText("飼料")).toBeInTheDocument();
  });

  test("購物車與訂單 icon 正常顯示", () => {
    expect(screen.getByTestId("cart-icon")).toHaveClass("bi-cart");
    expect(screen.getByTestId("order-icon")).toHaveClass("bi-bag");
  });

  test("顯示購物車數量", () => {
    expect(
      screen.getByText(cartData.carts.length.toString())
    ).toBeInTheDocument();
  });

  test("購屋車hover 時顯示 CartItem", () => {
    const cartIcon = screen.getByTestId("cart-icon-hover");
    fireEvent.pointerEnter(cartIcon);

    expect(screen.getByText("GO")).toBeInTheDocument();
    fireEvent.pointerLeave(cartIcon);
  });

  test("首頁時不應該顯示產品搜尋框", () => {
    expect(
      screen.queryByRole("textbox", { name: /搜尋產品/i })
    ).not.toBeInTheDocument();
  });
});

describe("NavBar購屋車頁面", () => {
  beforeEach(() => {
    renderNavBar("/cart");
  });

  test("購屋車中hover 時，不顯示 CartItem", () => {
    const cartIcon = screen.getByTestId("cart-icon-hover");
    fireEvent.pointerEnter(cartIcon);

    expect(screen.queryByText("GO")).not.toBeInTheDocument();
    fireEvent.pointerLeave(cartIcon);
  });

  test(" logo 的hover效果", () => {
    expect(screen.getByAltText(/logo/i)).toHaveAttribute(
      "src",
      "/images/logo_house.png"
    );
    const logoLink = screen.getByTestId("logo-link");
    fireEvent.pointerEnter(logoLink);

    expect(screen.getByAltText(/logo/i)).toHaveAttribute(
      "src",
      "/images/logo_houseOpen.png"
    );
  });

  test("非首頁、產品頁時應顯示產品搜尋框", () => {
    expect(
      screen.getByRole("textbox", { name: /搜尋產品/i })
    ).toBeInTheDocument();
  });
});

describe("NavBar產品頁面", () => {
  beforeEach(() => {
    renderNavBar("/products");
  });

  test("產品頁面時不顯示產品搜尋框", () => {
    expect(
      screen.queryByRole("textbox", { name: /搜尋產品/i })
    ).not.toBeInTheDocument();
  });
});

describe("NavBar產品搜尋頁面", () => {
  beforeEach(() => {
    renderNavBar("/products/search");
  });

  test("產品搜尋頁面時不顯示產品搜尋框", () => {
    expect(
      screen.queryByRole("textbox", { name: /搜尋產品/i })
    ).not.toBeInTheDocument();
  });
});

describe("NavBar結帳頁面", () => {
  beforeEach(() => {
    renderNavBar("/checkout");
  });

  test("購屋車中hover 時，不顯示 CartItem", () => {
    const cartIcon = screen.getByTestId("cart-icon-hover");
    fireEvent.pointerEnter(cartIcon);

    expect(screen.queryByText("GO")).not.toBeInTheDocument();
    fireEvent.pointerLeave(cartIcon);
  });
});
