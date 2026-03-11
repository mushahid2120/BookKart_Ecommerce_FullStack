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
import { books } from "@/lib/BookData";
import { useEffect, useMemo, useState } from "react";

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
  const [sortBook, setSortBook] = useState<number>(0);
  const [isSortDropDownMenu, setIsSortDropDownMenu] = useState<boolean>(false);
  const [bookSortFunc, setBookSortFunc] = useState<any>(() => (a: any, b: any) =>(a.price - b.price));
  const [conditionCheck, setConditionCheck] = useState<ContiditionCheckType>({
    Excellent: false,
    Good: false,
    Fair: false,
  });


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
  }, [conditionCheck, categoriesCheck, classType]);

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
      sorting: ()=>(a: any, b: any) =>(monthDiff(a.createdAt) - monthDiff(b.createdAt))},
    ,
    {
      title: "Oldest First",
      sorting: ()=>(a: any, b: any) =>(
        monthDiff(b.createdAt) - monthDiff(a.createdAt)),
    },
    {
      title: "Price: Low to High",
      sorting: ()=>(a: any, b: any) => (a.finalPrice - b.finalPrice),
    },
    {
      title: "Price: High to Low",
      sorting: ()=>(a: any, b: any) => (b.finalPrice - a.finalPrice),
    },
  ];

  const monthDiff = (givenDate: Date) => {
    const currentDate = new Date();

    const monthDiff =
      (currentDate.getFullYear() - givenDate.getFullYear()) * 12 +
      (currentDate.getMonth() - givenDate.getMonth());

    return monthDiff;
  };

  return (
    <main className="md:px-10 sm:px-10  px-4 pb-16 pt-8   bg-[#ddeafe] ">
      <div className="text-2xl font-semibold">
        Find from over 1000s of used books online
      </div>
      <div className="flex items-start justify-center flex-col md:flex-row  w-full mt-2">
        <Card className=" w-full  md:max-w-1/3 lg:max-w-1/4 self-start mb-4 ">
          <CardContent>
            <Accordion type="single" collapsible defaultValue="plans">
              <AccordionItem value="condition">
                <AccordionTrigger className="text-lg text-[#3b85f7]">
                  Condition
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  {BooksFilters.condition.map((con, index) => (
                    <div className="flex gap-2" key={index}>
                      <Checkbox
                        id={con}
                        checked={
                          conditionCheck[con as keyof ContiditionCheckType]
                        }
                        onCheckedChange={(checked) =>
                          setConditionCheck((prev) => ({
                            ...prev,
                            [con]: Boolean(checked),
                          }))
                        }
                      />
                      <Label htmlFor={con}>{con}</Label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="category">
                <AccordionTrigger className="text-lg text-[#3b85f7]">
                  Category
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  {BooksFilters.category.map((con, index) => (
                    <div className="flex gap-2 " key={index}>
                      <Checkbox
                        id={con}
                        checked={
                          categoriesCheck[con as keyof CategoriesCheckType]
                        }
                        onCheckedChange={(checked) =>
                          setCategoriesCheck((prev) => ({
                            ...prev,
                            [con]: Boolean(checked),
                          }))
                        }
                      />
                      <Label htmlFor={con}>{con}</Label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="classtype">
                <AccordionTrigger className="text-lg text-[#3b85f7]">
                  Class Type
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  {BooksFilters.classType.map((con, index) => (
                    <div className="flex gap-2 " key={index}>
                      <Checkbox
                        id={con}
                        checked={classType[con as keyof ClassTypeType]}
                        onCheckedChange={(checked) =>
                          setClassType((prev) => ({
                            ...prev,
                            [con]: Boolean(checked),
                          }))
                        }
                      />
                      <Label htmlFor={con}>{con}</Label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        <div className="w-full md:max-w-2/3 lg:max-w-3/4 relative z-50">
          <div className="flex justify-end">
            <DropdownMenu
              open={isSortDropDownMenu}
              onOpenChange={setIsSortDropDownMenu}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hover:bg-slate-300  flex outline-4 border border-solid border-black/40"
                >
                  {BooksSort[sortBook as number]?.title}
                  <ChevronsUpDown  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup className="relative flex flex-col space-y-2">
                  {BooksSort.map((sort, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full hover:bg-slate-100 flex justify-between items-center px-2  py-5 text-[#374151] font-normal"
                      onClick={() => {
                        setSortBook(index);
                        setIsSortDropDownMenu(false);
                        setBookSortFunc(sort?.sorting)
                      }}
                    >
                      <span>{sort?.title} </span>
                      {sortBook === index && <Check size={16} />}
                    </Button>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <BookList
            books={filteredBooks.sort(bookSortFunc)}
            monthDiff={monthDiff}
          />
        </div>
      </div>
    </main>
  );
}
