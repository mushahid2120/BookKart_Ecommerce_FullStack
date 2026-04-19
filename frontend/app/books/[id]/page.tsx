"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { monthDiff } from "@/lib/bookUploadTime";
import { IProduct } from "@/lib/types/product";
import {
  useAddToCartMutation,
  useAddToWishlistMutation,
  useLazyGetCartQuery,
  useLazyGetProductByIdQuery,
  useLazyGetWishlistQuery,
  useRemoveFromCartMutation,
  useRemoveFromWishlistMutation,
} from "@/store/api";
import { setCart } from "@/store/slice/cartSlice";
import { setWishlist } from "@/store/slice/wishlistSlice";
import { RootState } from "@/store/store";
import {
  CircleCheck,
  Heart,
  Loader,
  MapPin,
  MessageCircle,
  Share,
  ShoppingCart,
  User,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const book = {
  _id: "1",
  images: [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=400&q=80",
  ],
  title: "The Alchemist",
  category: "Reading Books (Novels)",
  condition: "Excellent",
  classType: "B.Com",
  subject: "Fiction",
  price: 300,
  author: "Paulo Coelho",
  edition: "25th Anniversary Edition",
  description: "A philosophical novel about destiny and dreams.",
  finalPrice: 250,
  shippingCharge: 40,
  paymentMode: "UPI",
  paymentDetails: { upiId: "book1@upi" },
  createdAt: new Date("2024-01-01"),
  seller: { name: "Seller 1", contact: "9000000001" },
};

const howWork = [
  {
    step: "Step 1",
    title: "Seller posts an Ad",
    description: "Seller posts an ad on book kart to sell their used books.",
    image: "/Image/step1.png",
  },
  {
    step: "Step 2",
    title: "Buyer Pays Online",
    description:
      "Buyer makes an online payment to book kart to buy those books.",
    image: "/Image/step2.png",
  },
  {
    step: "Step 3",
    title: "Seller ships the books",
    description: "Seller then ships the books to the buyer",
    image: "/Image/step3.png",
  },
];

export default function page() {
  const [currentImage, setCurrentImage] = useState<number>(0);
  const { id } = useParams();
  const [book, setBook] = useState<IProduct | null>(null);
  const [getBookData] = useLazyGetProductByIdQuery();
  const dispatch = useDispatch();
  const [addProductToWishList] = useAddToWishlistMutation();
  const [getWishlist] = useLazyGetWishlistQuery();
  const [removeProductFromWishlist] = useRemoveFromWishlistMutation();
  const wishlist = useSelector((state: RootState) => state.wishlist.product);
  const [isWishlist, setIsWishlist] = useState<boolean>(false);
  const [addToCart] = useAddToCartMutation();
  const cart = useSelector((state: RootState) => state.cart);
  const [getCart] = useLazyGetCartQuery();
  const [isPresentInCart, setIsPresentInCart] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [removeFromCart] = useRemoveFromCartMutation();

  useEffect(() => {
    getSigleBook();
    fetchingWishlist();
  }, []);

  useEffect(() => {
    if (book && wishlist && wishlist.length !== 0 ) {
      setIsWishlist(!!wishlist.find((item) => item._id === book._id));
    }
  }, [book, wishlist]);

  useEffect(() => {
    if (book && cart && cart.product.length !== 0 ) {
        setIsPresentInCart(
          !!cart.product.find((item) => item._id === book._id),
        );
    }
  }, [book, cart]);

  const getSigleBook = async () => {
    try {
      const response = await getBookData(id).unwrap();
      if (response.isSuccess) {
        setBook(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      const response = await addProductToWishList(productId).unwrap();
      if (response.isSuccess) {
        await fetchingWishlist();
      }
    } catch (error: any) {
      console.log(error);
      if (error.status === 400) {
        toast.error("Seller will not added their own product to wishlist");
      }
    }
  };

  const removeFromWishlistByProductId = async (productid: string) => {
    try {
      const response = await removeProductFromWishlist(productid).unwrap();
      if (response.isSuccess) {
        await fetchingWishlist();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchingWishlist = async () => {
    try {
      const response = await getWishlist({}).unwrap();
      if (response.isSuccess) {
        dispatch(setWishlist(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async ({
    productid,
    quantity,
  }: {
    productid: string;
    quantity: number;
  }) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const response = await addToCart({ productid, quantity }).unwrap();
      if (response.isSuccess) {
        await fetchingCart();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = async (productid: string) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const response = await removeFromCart(productid).unwrap();
      if (response.isSuccess) {
        fetchingCart();
        toast.success("product has been remove from cart");
      }
    } catch (error: any) {
      console.log(error);
      if (error.status === 500) {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchingCart = async () => {
    try {
      const response = await getCart({}).unwrap();
      console.log(response);
      if (response.isSuccess) {
        dispatch(setCart(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (book) {
    return (
      <main className="md:px-20 sm:px-10  px-6 py-8 bg-[#ddeafe]">
        <section className="flex lg:flex-row flex-col items-start gap-12">
          <div className="w-full ">
            <Card className="lg:max-w-125 lg:min-h-100 flex justify-center rounded-md">
              {book.images && (
                <Image
                  src={book.images[currentImage]}
                  width={200}
                  height={200}
                  alt="Book Image"
                  loading="eager"
                  className="relative aspect-video w-full object-cover"
                />
              )}
            </Card>
            <div className="flex gap-2 mt-2 overflow-y-auto custom-scrollbar">
              {book.images &&
                book.images.map((image, index) => (
                  <Image
                    src={image}
                    width="60"
                    height="60"
                    alt="book image list"
                    key={index}
                    className="rounded-md aspect-square object-cover hover:scale-102 transition-transform ease-in-out duration-200"
                    onClick={() => {
                      setCurrentImage(index);
                    }}
                  />
                ))}
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between items-center w-full ">
              <h2 className="text-2xl font-semibold">{book.title}</h2>
              <div className="font-normal text-sm space-x-4">
                <Button variant={"outline"} className=" rounded-md">
                  <Share /> Share
                </Button>
                <Button
                  variant={"outline"}
                  className=" rounded-md cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault(); // stops Link navigation
                    e.stopPropagation();

                    if (isWishlist) {
                      removeFromWishlistByProductId(book._id);
                    } else {
                      handleAddToWishlist(book._id);
                    }
                  }}
                >
                  <Heart
                    width={22}
                    fill={book && wishlist && isWishlist ? "red" : "none"}
                  />{" "}
                  {isWishlist ? "Remove" : "Add"}
                </Button>
              </div>
            </div>
            <p className="text-sm mt-2 mb-4">
              Posted {monthDiff(book.createdAt)} months ago
            </p>
            <div className="flex items-end gap-6">
              <h1 className="text-3xl font-medium">₹{book.finalPrice}</h1>
              <p className="text-[#16A34A] text-sm font-medium ">
                Shipping available
              </p>
            </div>
            <Button
              size="lg"
              className={`${isPresentInCart ? "bg-red-500" : "bg-[#1d4ed8]"} text-lg w-full max-w-55 min-h-11 my-4 cursor-pointer`}
              onClick={() => {
                if (isPresentInCart) {
                  handleRemoveFromCart(book._id);
                } else {
                  handleAddToCart({ productid: book._id, quantity: 1 });
                }
              }}
            >
              {isLoading ? (
                <Loader className="animate-spin cursor-not-allowed" />
              ) : (
                <>
                  <ShoppingCart />{" "}
                  {isPresentInCart ? "Remove from Cart" : "Add to Cart"}
                </>
              )}
            </Button>
            <Card className="gap-2">
              <CardHeader className="font-semibold text-lg">
                Book Details
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="grid grid-cols-2 text-[14px] pr-8">
                    <h1 className="font-medium">Subject/Title</h1>
                    <p className="justify-self-start">{book.subject}</p>
                  </li>
                  <li className="grid grid-cols-2 text-[14px] pr-8">
                    <h1 className="font-medium">Course</h1>
                    <p>{book.classType}</p>
                  </li>
                  <li className="grid grid-cols-2 text-[14px] pr-8">
                    <h1 className="font-medium">Category</h1>
                    <p>{book.category}</p>
                  </li>
                  <li className="grid grid-cols-2 text-[14px] pr-8">
                    <h1 className="font-medium">Author</h1>
                    <p>{book.author}</p>
                  </li>
                  <li className="grid grid-cols-2 text-[14px] pr-8">
                    <h1 className="font-medium">Edition</h1>
                    <p>{book.edition}</p>
                  </li>
                  <li className="grid grid-cols-2 text-[14px] pr-8">
                    <h1 className="font-medium">Condition</h1>
                    <p>{book.condition}</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="flex md:flex-row flex-col gap-12 items-center justify-between my-8">
          <Card className="gap-2 w-full md:w-1/2 min-h-100 md:min-h-100 lg:min-h-80 ">
            <CardHeader className="">
              <h3 className="font-semibold text-lg">Book Description</h3>
              <p>{book.description}</p>
            </CardHeader>
            <hr className="mx-4 my-2" />
            <CardContent>
              <h3 className="font-medium mb-2">Our Community</h3>
              <p>
                We're not just another shopping website where you buy from
                professional sellers - we are a vibrant community of students,
                book lovers across India who deliver happiness to each other!
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center w-full font-normal text-[14px]">
              <p>Ad Id: {book._id}</p>
              <p>Posted: {monthDiff(book.createdAt)} months ago</p>
            </CardFooter>
          </Card>

          <Card className="gap-2 w-full md:w-1/2 min-h-100 md:min-h-100 lg:min-h-80 ">
            <CardHeader className="font-semibold text-lg">Sold By</CardHeader>
            <CardContent className="flex gap-4 items-center w-full">
              <div className="bg-[#dbeafe] rounded-full p-4 text-blue-500">
                <User />
              </div>
              <div>
                <div className="flex gap-4 w-full">
                  <h2 className="text-base font-medium">{book.seller.name}</h2>{" "}
                  <span className="flex gap-1 font-medium items-center p-1 text-green-600 text-[10px] bg-[#f5f5f5] ">
                    <CircleCheck className="size-4" /> Verified
                  </span>
                </div>
                <p className="text-[14px] font-normal flex">
                  {" "}
                  <MapPin />{" "}
                  {book?.seller?.address
                    ? `${book.seller.address.addressLine1} ${book.seller.address.addressLine1} ${book.seller.address.city} ${book.seller.address.state} ${book.seller.address.pin}`
                    : "Address Not Specified"}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
        <section>
          <h1 className="text-2xl font-semibold mt-6 mb-3">
            How does it work?
          </h1>
          <div className="flex md:flex-row flex-col items-center justify-center gap-4">
            {howWork.map(({ step, title, description, image }, index) => (
              <Card
                key={index}
                className="w-full gap-0 max-w-100 max-h-125 min-h-115 bg-linear-to-tl from-[#fef3c8] to-[#fffbe9]"
              >
                <CardHeader className="mb-1">
                  <span className="text-sm mb-2 bg-black rounded-md text-white max-w-17.5 text-center">
                    {step}
                  </span>
                  <span className="text-lg font-medium">{title}</span>
                </CardHeader>
                <CardContent className="text-[14px] text-[#737373]">
                  {description}
                </CardContent>
                <div className="flex item-center justify-center my-4">
                  <Image
                    src={image}
                    width={100}
                    height={100}
                    alt={step}
                    className="object-cover w-auto max-w-40 aspect-square"
                  />
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    );
  }
}
