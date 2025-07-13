import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "./Pagination";

describe("Pagination單元測試", () => {
  const mockChangePage = jest.fn();
  const mockChangePageByCategory = jest.fn();

  const baseProps = {
    pagination: {
      current_page: 2,
      total_pages: 5,
      has_pre: true,
      has_next: true,
      category: null,
    },
    changePage: mockChangePage,
    changePageByCategory: mockChangePageByCategory,
  };

  const renderPagination = (Props = baseProps) => {
    return render(<Pagination {...Props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("顯示正確頁數", () => {
    renderPagination();
    const pageLinks = screen.getAllByRole("link");
    expect(pageLinks).toHaveLength(7);
  });

  test("按頁數正確更改頁面", async () => {
    renderPagination();
    const page3 = screen.getByText("3");
    await userEvent.click(page3);
    expect(mockChangePage).toHaveBeenCalledWith(3);
  });

  test("按上一頁正確更改頁面", async () => {
    renderPagination();
    const prev = screen.getByRole("link", { name: "Previous" });
    await userEvent.click(prev);
    expect(mockChangePage).toHaveBeenCalledWith(1);
  });

  test("按下一頁正確更改頁面", async () => {
    renderPagination();
    const next = screen.getByRole("link", { name: "Next" });
    await userEvent.click(next);
    expect(mockChangePage).toHaveBeenCalledWith(3);
  });

  test("類別產品時按頁數正確更改頁面", async () => {
    const propsWithCategory = {
      ...baseProps,
      pagination: { ...baseProps.pagination, category: "飼料" },
    };
    renderPagination(propsWithCategory);
    const page4 = screen.getByText("4");
    await userEvent.click(page4);
    expect(mockChangePageByCategory).toHaveBeenCalledWith("飼料", 4);
  });

  test("當沒有前頁和後頁時disabled按鈕", () => {
    const propsPrevAndNextIsFalse = {
      ...baseProps,
      pagination: {
        ...baseProps.pagination,
        current_page: 1,
        total_pages: 1,
        has_pre: false,
        has_next: false,
        category: null,
      },
    };
    renderPagination(propsPrevAndNextIsFalse);
    const links = screen.getAllByRole("link");

    // 確認 disabled class 是否存在
    expect(links[0]).toHaveClass("disabled");
    expect(links[links.length - 1]).toHaveClass("disabled");
  });
});
