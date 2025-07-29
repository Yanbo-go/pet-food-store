# Pet Food Store 寵物食品購物網站

這是一個使用 React 開發的寵物食品購物網站，具備商品瀏覽、購物車操作、訂單建立與查詢等功能，並包含簡易後台管理系統。此專案為個人作品集，展示前端開發、元件設計、狀態管理與 UI 實作能力。

---

## 技術架構

- React 18（Hooks）
- React Router DOM
- React Hook Form
- Redux Toolkit（前台狀態管理）
- useContext + useReducer（後台狀態管理）
- Axios
- Bootstrap / SCSS
- Jest / React Testing Library
- [Create React App](https://github.com/facebook/create-react-app)

---

## 前台功能

- 商品搜尋 / 篩選 / 排序
- 商品詳情頁（可調整數量並加入購物車）
- 購物車功能（增減數量、刪除）
- 建立訂單表單（含表單驗證）
- 訂單查詢功能（輸入訂單編號查詢）
- 響應式設計（RWD）

---

## 後台功能

- 商品管理（新增 / 編輯 / 刪除）
- 訂單管理（查看、修改狀態）
- 折價券管理（新增 / 編輯 / 刪除）

---

## 專案結構（src/）

<pre>
src/
├── _mocks_/        # 測試使用 mock 資料
├── components/     # 可重複使用的 UI 元件
├── hooks/          # 自定義 Hook
├── pages/          # 各頁面元件（前台與後台）
├── redux/          # Redux 狀態管理（前台）
├── context/        # Context + Reducer 狀態管理（後台）
├── styles/         # SCSS 樣式檔
├── utils/          # 共用工具函式（格式化、驗證、常數等）
├── services/       # API 請求模組（未來將獨立抽出）
</pre>

---

## 線上預覽

專案部署中（預計使用 Vercel 或 GitHub Pages）

---

## 資料來源

- 商品與訂單資料透過 RESTful API 串接
- 使用 Axios 處理資料請求與錯誤處理
- API 由課程提供

---

## 測試工具

- Jest
- React Testing Library（單元測試與互動測試）

---

## 專案安裝與啟動

```bash
# 安裝套件
npm install

# 開發環境啟動（http://localhost:3000）
npm start
```
