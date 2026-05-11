"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IProduct } from "@/lib/types/product";
import {
  useDeleteProductMutation,
  useLazyGetProductBySellerIdQuery,
} from "@/store/api";
import { Loader, Trash2, View } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function page() {
  const [sellingbook, setSellingBook] = useState<IProduct[]>([]);
  const [getMyPostedBooks] = useLazyGetProductBySellerIdQuery();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    getAllPostedBooksByMe();
  }, []);

  const getAllPostedBooksByMe = async () => {
    try {
      const response = await getMyPostedBooks({}).unwrap();

      if (response.isSuccess) {
        setSellingBook(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      setIsLoading(productId);
      const response = await deleteProduct(productId).unwrap();
      if (response.isSuccess) {
         getAllPostedBooksByMe();
        toast.success("Product has been deleted Successfully");
      }
    } catch (error: any) {
      console.log(error);
      if (error.status === 500) {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(null);
    }
  };

  if (sellingbook.length === 0) {
    return (
      <div className="flex items-center justify-center flex-col h-full">
        <div className=" max-w-120 flex items-center flex-col justify-center text-center gap-2">
          <div>
            <img
              src={`/Image/selling-book.png`}
              alt="Hero Image"
              className="w=full"
            />
          </div>
          <h1 className="text-2xl font-medium">
            You haven't sold any books yet.
          </h1>
          <p className="text-(--color-header-text) font-ligth">
            Start selling your books to reach potential buyers. List your first
            book now and make it available to others.
          </p>
          <Link href="/book-sell">
            <Button className="bg-linear-to-r from-(--color-accent-yellow) to-(--color-button-yellow-hover) hover:from-(--color-accent-yellow) hover:to-(--color-button-yellow-hover) cursor-pointer">
              Sell Your First Book
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-semibold text-(--color-header-text)">
        Your Listed Books
      </h1>
      <h3 className="text-(--color-header-text) text-lg">
        Manage and track your book listings
      </h3>
      <div className="w-full grid mt-4 sm:grid-cols-2 gap-4">
        {sellingbook.map((book, index) => (
          <Card
            className="relative overflow-hidden p-0 pb-4 w-full sm:max-w-80 gap-0"
            key={index}
          >
            <div className="h-1 bg-(--color-button-yellow) w-full absolute top-0"></div>
            <CardHeader className="flex flex-col text-lg text-(--color-button-yellow-hover) font-medium bg-(--color-surface-soft) p-3 gap-1 w-full">
              <div className="flex items-center gap-3 my-2 min-w-0">
                <span className="truncate w-full block">{book.title}</span>
              </div>
              <p className="text-(--color-text-muted) text-sm truncate">{book.subject}</p>
            </CardHeader>
            <div className="h-60 w-40  py-2 mx-auto">
              {book.images && (
                <img
                  src={book.images[0]}
                  alt="order image "
                  className="object-cover h-full w-full"
                />
              )}
            </div>
            <CardContent>
              <h3 className="truncate text-sm mb-1"> {book.category}</h3>
              <p className="text-sm mb-1.5">Class: {book.classType}</p>
              <div className="flex justify-between items-center ">
                <span className="text-(--color-header-text) bg-(--color-surface-soft) p-1 rounded-lg text-sm">
                  ₹{book.finalPrice}
                </span>
                <span className="line-through text-sm">₹{book.price}</span>
              </div>
            </CardContent>
            <CardFooter className=" mt-3 gap-2 w-full block">
              <Link href={`/books/${book._id}`}>
                <Button className=" bg-(--color-button-yellow) hover:bg-(--color-button-yellow-hover) w-full font-medium cursor-pointer ">
                  <View />
                  View
                </Button>
              </Link>
              <Button
                className="absolute top-2 right-2 bg-(--color-danger) hover:bg-(--color-button-yellow-hover) cursor-pointer"
                onClick={() => {
                  handleDeleteProduct(book._id);
                }}
                size="icon"
              >
                {isLoading===book._id ? (
                  <Loader className="animate-spin cursor-pointer" />
                ) : (
                  <>
                    <Trash2 size={20} strokeWidth={3} />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
