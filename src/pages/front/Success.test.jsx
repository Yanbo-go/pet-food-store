import { render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { MemoryRouter, Routes, Route, Outlet } from "react-router-dom";
import Success from "./Success";

describe("Success 整合測試", () => {
  const mockGetOrder = jest.fn();

  const MockOutletContextProvider = () => {
    const [orderData, setOrderData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const mockOrderData = {
      data: {
        success: true,
        order: {
          create_at: 1728973613,
          id: "-O9DqubzZTdJkiRiIGuy",
          is_paid: true,
          message: "1qq123",
          paid_date: 1728973617,
          products: {
            "-O9DqudLJUH3hnByf0Bg": {
              coupon: {
                code: "testCode",
                due_date: 1791936000,
                id: "-O988V-FceY28NH1AldL",
                is_enabled: 1,
                num: 1,
                percent: 80,
                title: "123123123",
              },
              final_total: 800,
              id: "-O9DqudLJUH3hnByf0Bg",
              product: {
                category: "蛋糕",
                content:
                  "蜜蜂蜜蛋糕，夾層夾上酸酸甜甜的檸檬餡，清爽可口的滋味讓人口水直流！",
                description: "尺寸：6寸",
                id: "-MoGs5oIfrsXHD8bE9po",
                imageUrl:
                  "https://storage.googleapis.com/vue-course-api.appspot.com/hexschoolvue/1728751588618.jpg?GoogleAccessId=firebase-adminsdk-zzty7%40vue-course-api.iam.gserviceaccount.com&Expires=1742169600&Signature=SVvWwGbQdU9VoHldyhQhXTk5bMSx74QjS%2B9jTmKj5Iwe2dwwOcmeqkdFBx4yWCD3cyq4h%2B9v5gClAEjMmRBkI%2B3%2BhrETfokOqdWqCA09nQO5sslUG8%2FNPaLKmoOVWlbyLRPLlsjSTDNQlSq456wvKCjMuZ2VrQ0KesYMexUdGRIivv%2B7ZsddkQxt2SagyxR3INqR4SiEWZzeqa8VTcPqBi2SXz%2BN9ydKyuMhyj1Zgi%2BdAN5hwKqQ4tjb0RF%2BxNZRyMN637DSIh19wbYTRauS4jSePB4ZasWFy6h7ghO3LyCR1JFkUPg32cgnhVV5KUBDpzEY51jOCqzqxIq2mynjhQ%3D%3D",
                is_enabled: 1,
                num: 2,
                origin_price: 1500,
                price: 1000,
                title: "蜂蜜檸檬蛋糕",
                unit: "個",
              },
              product_id: "-MoGs5oIfrsXHD8bE9po",
              qty: 1,
              total: 1000,
            },
          },
          total: 4384,
          user: {
            address: "123123",
            email: "123@gmail.com",
            name: "123123",
            tel: "123123123",
          },
        },
      },
    };

    mockGetOrder.mockImplementation(() => {
      setOrderData(mockOrderData.data);
    });

    return (
      <Outlet
        context={{
          getOrder: mockGetOrder,
          orderData: orderData,
          isLoading: isLoading,
        }}
      />
    );
  };

  const renderSuccessWithContext = () => {
    return render(
      <MemoryRouter initialEntries={["/success"]}>
        <Routes>
          <Route path="/" element={<MockOutletContextProvider />}>
            <Route path="success" element={<Success />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  test("取得訂單資訊並正確顯示在畫面", () => {
    renderSuccessWithContext();

    expect(screen.getByText("蜂蜜檸檬蛋糕")).toBeInTheDocument();
    expect(screen.getByText("NT$1000")).toBeInTheDocument();
  });
});
