"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown } from "lucide-react";
import BookList from "@/components/BookList";
import { useEffect, useMemo, useState } from "react";
import {
  useAddToWishlistMutation,
  useLazyGetAllProductQuery,
} from "@/store/api";
import { monthDiff } from "@/lib/bookUploadTime";
import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { setQuery } from "@/store/slice/productQuery";

export interface IBook {
  _id: string;
  title: string;
  author: string;
  price: number;
  finalPrice: number;
  createdAt: Date;
  condition: string;
  category: string;
  classType: string;
}

interface ContiditionCheckType {
  Excellent: boolean;
  Good: boolean;
  Fair: boolean;
}

interface CategoriesCheckType {
  "College Books (Higher Education Textbooks)": boolean;
  "Exam/Test Preparation Books": boolean;
  "Reading Books (Novels, Children, Business, Literature, History, etc.)": boolean;
  "School Books (up to 12th)": boolean;
}

interface ClassTypeType {
  "B.Tech": boolean;
  "B.Sc": boolean;
  "B.Com": boolean;
  BCA: boolean;
  MBA: boolean;
  "M.Tech": boolean;
  "M.Sc": boolean;
  "Ph.D": boolean;
  "12th": boolean;
  "11th": boolean;
  "10th": boolean;
  "9th": boolean;
  "8th": boolean;
  "7th": boolean;
  "6th": boolean;
  "5th": boolean;
}

export default function Books() {
  const dispatch = useDispatch();
  const [sortBook, setSortBook] = useState<number>(0);
  const [isSortDropDownMenu, setIsSortDropDownMenu] = useState<boolean>(false);
  const [bookSortFunc, setBookSortFunc] = useState<any>(
    () => (a: any, b: any) => a.price - b.price,
  );
  const [conditionCheck, setConditionCheck] = useState<ContiditionCheckType>({
    Excellent: false,
    Good: false,
    Fair: false,
  });
  const [getBooks] = useLazyGetAllProductQuery();
  const [books, setBooks] = useState<IBook[]>([]);
  const [addToWishList] = useAddToWishlistMutation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const productQuery = useSelector(
    (state: RootState) => state.productQuery.query,
  );

  const [categoriesCheck, setCategoriesCheck] = useState<CategoriesCheckType>({
    "College Books (Higher Education Textbooks)": false,
    "Exam/Test Preparation Books": false,
    "Reading Books (Novels, Children, Business, Literature, History, etc.)": false,
    "School Books (up to 12th)": false,
  });

  const [classType, setClassType] = useState<ClassTypeType>({
    "B.Tech": false,
    "B.Sc": false,
    "B.Com": false,
    BCA: false,
    MBA: false,
    "M.Tech": false,
    "M.Sc": false,
    "Ph.D": false,
    "12th": false,
    "11th": false,
    "10th": false,
    "9th": false,
    "8th": false,
    "7th": false,
    "6th": false,
    "5th": false,
  });

  const filteredBooks = useMemo(() => {
    const activeConditions = Object.entries(conditionCheck)
      .filter(([_, value]) => value)
      .map(([key]) => key as keyof ContiditionCheckType);

    const activeCategories = Object.entries(categoriesCheck)
      .filter(([_, value]) => value)
      .map(([key]) => key as keyof CategoriesCheckType);

    const activeClasses = Object.entries(classType)
      .filter(([_, value]) => value)
      .map(([key]) => key as keyof ClassTypeType);

    return books.filter((book) => {
      const conditionMatch =
        activeConditions.length === 0 ||
        activeConditions.includes(book.condition as keyof ContiditionCheckType);

      const categoryMatch =
        activeCategories.length === 0 ||
        activeCategories.includes(book.category as keyof CategoriesCheckType);

      const classMatch =
        activeClasses.length === 0 ||
        activeClasses.includes(book.classType as keyof ClassTypeType);

      return conditionMatch && categoryMatch && classMatch;
    });
  }, [conditionCheck, categoriesCheck, classType, books]);

  const BooksFilters = {
    condition: ["Excellent", "Good", "Fair"],
    category: [
      "College Books (Higher Education Textbooks)",
      "Exam/Test Preparation Books",
      "Reading Books (Novels, Children, Business, Literature, History, etc.)",
      "School Books (up to 12th)",
    ],
    classType: [
      "B.Tech",
      "B.Sc",
      "B.Com",
      "BCA",
      "MBA",
      "M.Tech",
      "M.Sc",
      "Ph.D",
      "12th",
      "11th",
      "10th",
      "9th",
      "8th",
      "7th",
      "6th",
      "5th",
    ],
  };

  const BooksSort = [
    {
      title: "Newest First",
      sorting: () => (a: any, b: any) =>
        monthDiff(a.createdAt) - monthDiff(b.createdAt),
    },
    {
      title: "Oldest First",
      sorting: () => (a: any, b: any) =>
        monthDiff(b.createdAt) - monthDiff(a.createdAt),
    },
    {
      title: "Price: Low to High",
      sorting: () => (a: any, b: any) => a.finalPrice - b.finalPrice,
    },
    {
      title: "Price: High to Low",
      sorting: () => (a: any, b: any) => b.finalPrice - a.finalPrice,
    },
  ];

  useEffect(() => {
    getAllBooks();
  }, []);

  const getAllBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getBooks({}).unwrap();
      if (response.isSuccess) {
        setBooks(response.data);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to load books. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 bg-background text-on-surface">
      {/* Header Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight mb-1">
            Browse Textbooks
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base">
            {productQuery
              ? `Showing results for "${productQuery}"`
              : `Showing ${filteredBooks.length} results in Textbooks & Learning Materials`}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {productQuery && (
            <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full text-xs border border-outline-variant">
              <span className="text-on-surface-variant font-medium">Search:</span>
              <span className="text-primary font-semibold">"{productQuery}"</span>
              <button
                onClick={() => dispatch(setQuery(""))}
                className="text-on-surface-variant hover:text-error text-xs font-semibold ml-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-semibold text-on-surface-variant tracking-wider hidden sm:inline">
              Sort by:
            </span>
            <DropdownMenu
              open={isSortDropDownMenu}
              onOpenChange={setIsSortDropDownMenu}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-surface-container-low border-outline-variant text-on-surface hover:bg-surface-container-high hover:text-on-surface text-sm rounded-lg px-4 py-2 font-medium flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>{BooksSort[sortBook as number]?.title}</span>
                  <ChevronsUpDown className="w-4 h-4 text-on-surface-variant" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-surface-container-lowest border-outline-variant shadow-md rounded-xl p-1 min-w-45">
                <DropdownMenuGroup className="flex flex-col gap-0.5">
                  {BooksSort.map((sort, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`w-full justify-between items-center px-3 py-2 text-sm rounded-lg font-normal transition-colors cursor-pointer ${
                        sortBook === index
                          ? "bg-primary-container/20 text-on-primary-container font-semibold"
                          : "text-on-surface hover:bg-surface-container-low"
                      }`}
                      onClick={() => {
                        setSortBook(index);
                        setIsSortDropDownMenu(false);
                        setBookSortFunc(sort?.sorting);
                      }}
                    >
                      <span>{sort?.title}</span>
                      {sortBook === index && <Check className="w-4 h-4 text-primary" />}
                    </Button>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64  space-y-4 lg:sticky lg:top-24 self-start">
          <Card className="bg-surface-container-lowest border-outline-variant shadow-sm rounded-xl overflow-hidden">
            <CardContent className="p-4">
              <Accordion type="multiple" defaultValue={["condition", "category", "classtype"]} className="w-full">
                <AccordionItem value="condition" className="border-b-outline-variant/60">
                  <AccordionTrigger className="text-base font-semibold text-on-surface hover:no-underline py-3">
                    Condition
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2.5 pb-3">
                    {BooksFilters.condition.map((con, index) => (
                      <div className="flex items-center gap-2.5" key={index}>
                        <Checkbox
                          id={`cond-${index}`}
                          checked={conditionCheck[con as keyof ContiditionCheckType]}
                          onCheckedChange={(checked) =>
                            setConditionCheck((prev) => ({
                              ...prev,
                              [con]: Boolean(checked),
                            }))
                          }
                          className="w-4 h-4 border-outline text-primary rounded focus:ring-primary cursor-pointer"
                        />
                        <Label
                          htmlFor={`cond-${index}`}
                          className="text-sm font-normal text-on-surface cursor-pointer flex-1 select-none"
                        >
                          {con}
                        </Label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="category" className="border-b-outline-variant/60">
                  <AccordionTrigger className="text-base font-semibold text-on-surface hover:no-underline py-3">
                    Category
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2.5 pb-3">
                    {BooksFilters.category.map((con, index) => (
                      <div className="flex items-start gap-2.5" key={index}>
                        <Checkbox
                          id={`cat-${index}`}
                          checked={categoriesCheck[con as keyof CategoriesCheckType]}
                          onCheckedChange={(checked) =>
                            setCategoriesCheck((prev) => ({
                              ...prev,
                              [con]: Boolean(checked),
                            }))
                          }
                          className="w-4 h-4 border-outline text-primary rounded mt-0.5 focus:ring-primary cursor-pointer"
                        />
                        <Label
                          htmlFor={`cat-${index}`}
                          className="text-sm font-normal text-on-surface cursor-pointer flex-1 leading-snug select-none"
                        >
                          {con}
                        </Label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="classtype" className="border-none">
                  <AccordionTrigger className="text-base font-semibold text-on-surface hover:no-underline py-3">
                    Class / Course
                  </AccordionTrigger>
                  <AccordionContent className="space-y-2.5 max-h-60 overflow-y-auto custom-scrollbar pr-1 pb-3">
                    {BooksFilters.classType.map((con, index) => (
                      <div className="flex items-center gap-2.5" key={index}>
                        <Checkbox
                          id={`clas-${index}`}
                          checked={classType[con as keyof ClassTypeType]}
                          onCheckedChange={(checked) =>
                            setClassType((prev) => ({
                              ...prev,
                              [con]: Boolean(checked),
                            }))
                          }
                          className="w-4 h-4 border-outline text-primary rounded focus:ring-primary cursor-pointer"
                        />
                        <Label
                          htmlFor={`clas-${index}`}
                          className="text-sm font-normal text-on-surface cursor-pointer flex-1 select-none"
                        >
                          {con}
                        </Label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            onClick={() => {
              setConditionCheck({ Excellent: false, Good: false, Fair: false });
              setCategoriesCheck({
                "College Books (Higher Education Textbooks)": false,
                "Exam/Test Preparation Books": false,
                "Reading Books (Novels, Children, Business, Literature, History, etc.)": false,
                "School Books (up to 12th)": false,
              });
              setClassType({
                "B.Tech": false, "B.Sc": false, "B.Com": false, BCA: false, MBA: false,
                "M.Tech": false, "M.Sc": false, "Ph.D": false, "12th": false, "11th": false,
                "10th": false, "9th": false, "8th": false, "7th": false, "6th": false, "5th": false,
              });
            }}
            className="w-full py-2.5 bg-secondary text-on-secondary rounded-lg font-semibold text-xs tracking-wider uppercase hover:opacity-90 transition-all active:scale-[0.98] border-none shadow-xs cursor-pointer"
          >
            Clear All Filters
          </Button>
        </aside>

        {/* Book Grid Area */}
        <div className="flex-1 min-w-0">
          <BookList
            books={filteredBooks
              .sort(bookSortFunc)
              .filter((book) =>
                productQuery
                  ? book.title.toLowerCase().includes(productQuery.toLowerCase()) ||
                    book.author.toLowerCase().includes(productQuery.toLowerCase())
                  : true,
              )}
            isLoading={isLoading}
            error={error}
            onRetry={getAllBooks}
          />
        </div>
      </div>
    </main>
  );
}

