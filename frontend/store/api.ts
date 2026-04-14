import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const Api_Urls = {
  //Auth
  register: `${BASE_URL}/auth/register`,
  verifyEmail: (token: string) => `${BASE_URL}/auth/verify-email/${token}`,
  login: `${BASE_URL}/auth/login`,
  forgotPassword: `${BASE_URL}/auth/forgot-password`,
  resetPassword: (token: string) => `${BASE_URL}/auth/reset-password/${token}`,
  checkUser: `${BASE_URL}/auth/check-user`,
  logout: `${BASE_URL}/auth/logout`,

  //Product
  getAllProducts:`${BASE_URL}/product`,
  getProductById: (productId: string) => `${BASE_URL}/product/productId/${productId}`,
  getProductBySellerId: `${BASE_URL}/product/product-seller-id`,
  createProduct: `${BASE_URL}/product/create-product`,
  deleteProduct: (productId: string) => `${BASE_URL}/product/${productId}`,

  //Order
  getOrderByUserId: `${BASE_URL}/order/get-order-by-userid`,
  getOrderByOrderId: (orderId: string) =>
    `${BASE_URL}/order/get-order-by-orderid/${orderId}`,
  createOrUpdateOrder: `${BASE_URL}/order/create-update-order`,
  createPayment: `${BASE_URL}/order/create-payment`,
  handleRazorpayWebhook: `${BASE_URL}/order/handle-razorpay-webhook`,

  //Cart
  getCart: `${BASE_URL}/cart/`,
  addToCart: `${BASE_URL}/cart/add-to-cart`,
  removeFromCart: (productId: string) =>
    `${BASE_URL}/cart/remove-cart/${productId}`,

  //WishList
  getWishList: `${BASE_URL}/wishlist/`,
  addToWishList: (productId: string) =>
    `${BASE_URL}/wishlist/add-to-wishlist/${productId}`,
  removeFromWishList: (productId: string) =>
    `${BASE_URL}/wishlist/remove-wishlist/${productId}`,

  //Address
  getAddressByUserId: `{BASE_URL}/address/`,
  createOrUpdateAddress: `{BASE_URL}/address/create-update-address`,
  deleteAddress: `{BASE_URL}/address/delete-address`,

  //User
  updateUser: `${BASE_URL}/user/update-user`,
};

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Product", "Cart", "WishList", "Address", "Auth", "Order"],
  endpoints: (builder) => ({
    //Auth

    checkUser: builder.query({
      query: () => ({
        url: Api_Urls.checkUser,
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: Api_Urls.register,
        method: "POST",
        body: userData,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: Api_Urls.verifyEmail(token),
        method: "POST",
      }),
    }),
    login: builder.mutation({
      query: (userData) => ({
        url: Api_Urls.login,
        method: "POST",
        body: userData,
      }),
      invalidatesTags:["Auth"]
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: Api_Urls.forgotPassword,
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: Api_Urls.resetPassword(token),
        method: "POST",
        body: { newPassword },
      }),
    }),
    logout:builder.mutation({
      query:()=>({
        url:Api_Urls.logout,
        method:"POST"
      }),
      invalidatesTags:["Auth"]
    }),

    //Product
    getAllProduct:builder.query({
      query:()=>({
        url:Api_Urls.getAllProducts,
        method:"GET"
      }),
      providesTags:[{type:"Product",id:"getAllProduct"}]
    }),
    getProductById: builder.query({
      query: (productId) => ({
        url: Api_Urls.getProductById(productId),
        method: "GET",
      }),
      providesTags: [{ type: "Product", id: "getById" }],
    }),
    getProductBySellerId: builder.query({
      query: () => ({
        url: Api_Urls.getProductBySellerId,
        method: "GET",
      }),
      providesTags: [{ type: "Product", id: "getBySellerId" }],
    }),
    createProduct: builder.mutation({
      query: (productData) => {
        console.log(productData)
        return ({
        url: Api_Urls.createProduct,
        method: "POST",
        body:productData
      })},
      invalidatesTags: [{ type: "Product", id: "getAllProduct" }],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: Api_Urls.deleteProduct(productId),
        method: "POST",
      }),
      invalidatesTags: [
        { type: "Product", id: "getAllProduct" }
      ],
    }),

    //Order
    getOrderByUserId: builder.query({
      query: () => ({
        url: Api_Urls.getOrderByUserId,
        method: "GET",
      }),
      providesTags: [{ type: "Order", id: "getByUserId" }],
    }),
    getOrderByOrderId: builder.query({
      query: (orderId) => ({
        url: Api_Urls.getOrderByOrderId(orderId),
        method: "GET",
      }),
      providesTags: [{ type: "Order", id: "getByOrderId" }],
    }),
    createOrUpdateOrder: builder.mutation({
      query: (productData) => ({
        url: Api_Urls.createOrUpdateOrder,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: [
        { type: "Order", id: "getByOrderId" },
        { type: "Order", id: "getByUserId" },
      ],
    }),
    createPayment: builder.mutation({
      query: () => ({
        url: Api_Urls.createPayment,
        method: "POST",
      }),
    }),

    //Cart
    getCart: builder.query({
      query: () => ({
        url: Api_Urls.getCart,
        method: "GET",
      }),
      providesTags: [{ type: "Cart", id: "getCart" }],
    }),
    addToCart: builder.mutation({
      query: (cartData) => ({
        url: Api_Urls.addToCart,
        method: "POST",
        body: cartData,
      }),
      invalidatesTags: [{ type: "Cart", id: "getCart" }],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: Api_Urls.removeFromCart(productId),
        method: "POST",
      }),
      invalidatesTags: [{ type: "Cart", id: "getCart" }],
    }),

    //WishList
    getWishlist: builder.query({
      query: () => ({
        url: Api_Urls.getWishList,
        method: "GET",
      }),
      providesTags: [{ type: "WishList", id: "getWish" }],
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: Api_Urls.addToWishList(productId),
        method: "POST",
      }),
      invalidatesTags: [{ type: "WishList", id: "getWish" }],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: Api_Urls.removeFromWishList(productId),
        method: "POST",
      }),
      invalidatesTags: [{ type: "WishList", id: "getWish" }],
    }),

    //Address
    getAddressByUserId: builder.query({
      query: () => ({
        url: Api_Urls.getAddressByUserId,
        method: "GET",
      }),
      providesTags: [{ type: "Address", id: "getAddress" }],
    }),
    createOrUpdateAddress: builder.mutation({
      query: (address) => ({
        url: Api_Urls.createOrUpdateAddress,
        method: "POST",
        body: address,
      }),
      invalidatesTags: [{ type: "Address", id: "getAddress" }],
    }),
    deleteAddress: builder.mutation({
      query: () => ({
        url: Api_Urls.deleteAddress,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Address", id: "getAddress" }],
    }),

    //User
    updateUser: builder.mutation({
      query: (userData) => ({
        url: Api_Urls.updateUser,
        method: "PUT",
        body:userData,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLazyCheckUserQuery,
  useLogoutMutation,
  useLazyGetAllProductQuery ,
  useLazyGetProductByIdQuery,
  useLazyGetProductBySellerIdQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useLazyGetOrderByUserIdQuery,
  useLazyGetOrderByOrderIdQuery,
  useCreateOrUpdateOrderMutation,
  useCreatePaymentMutation,
  useLazyGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useLazyGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useLazyGetAddressByUserIdQuery,
  useCreateOrUpdateAddressMutation,
  useDeleteAddressMutation,
  useUpdateUserMutation,
} = api;
