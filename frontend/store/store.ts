import { configureStore } from "@reduxjs/toolkit/react";
import userSlice from "./slice/userSlice";
import wishlistSlice from "./slice/wishlistSlice"
import cartSlice from "./slice/cartSlice"
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PURGE, PERSIST, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { api } from "./api";
import { setupListeners } from "@reduxjs/toolkit/query";


const userPersistConfig = {
    key: 'user', storage, whitelist: ['user', 'isEmailVerified', 'isLoggedIn']
}  // what you are type to save in localstorage and which one
const wishlistPersistConfig = {
    key: 'wishlist', storage, whitelist: ['product']
}  // what you are type to save in localstorage and which one
const cartPersistConfig = {
    key: 'cart', storage, whitelist: ['product','checkoutStatus']
}  // what you are type to save in localstorage and which one

const persistedUserReducer = persistReducer(userPersistConfig, userSlice) // what to store and from where
const persistedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistSlice) // what to store and from where
const persistedCartReducer = persistReducer(cartPersistConfig, cartSlice) // what to store and from where

const store = configureStore({
    //where the state has been changing
    reducer: {
        user: persistedUserReducer,
        wishlist:persistedWishlistReducer,
        cart:persistedCartReducer,
        [api.reducerPath]: api.reducer
    },                          
    // before changing the state passing through this        
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions:[FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        }).concat(api.middleware)
})

//like submitting the form and this is handling the submit
setupListeners(store.dispatch)

// Start saving Redux state and restore it automatically on page reload
export const persistor=persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;
