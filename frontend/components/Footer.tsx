import { Clock4, Facebook, Headphones, Shield } from "lucide-react";
import Link from "next/link";
import FooterCard from "./FooterCard";

export default function Footer() {
  const footList = [
    {
      heading: "ABOUT US",
      items: [
        { name: "About Us", path: "about-us" },
        { name: "Contact Us", path: "contactus" },
      ],
    },
    {
      heading: "USEFULL LINKS",
      items: [
        { name: "How it works?", path: "howitwork" },
        { name: "Blogs", path: "blog" },
      ],
    },
    {
      heading: "POLICIES",
      items: [
        { name: "Terms Of Use", path: "term-of-use" },
        { name: "Privacy Policy", path: "privacy-policy" },
      ],
    },
    {
      heading: "STAY CONNECTED",
      items: [
        { name: "Terms Of Use", path: "term-use" },
        { name: "Privacy Policy", path: "privacy-policy" },
      ],
    },
  ];

  const footFeatures=[
    {
      icon:<Shield  className="size-16"/>,
      heading: "Secure Payment",
      description: "100% Secure Online Transaction"
    },
    {
      icon:<Clock4 className="size-16"/>,
      heading: "BookKart Trust",  
      description: "Money transferred safely after confirmation"
    },
    {
      icon:<Headphones className="size-16"/>,
      heading: "Customer Support",
      description: "Friendly customer support"
    },
  ]

  return (
    <footer className="bg-(--color-footer-bg) pt-12 text-white md:px-8 sm:px-4 px-2 pb-16">
      <div className="flex justify-between flex-wrap  flex-col md:flex-row md:gap-3 gap-8">
        {footList.map(({ heading, items }, index) => (
          <div key={index}>
            <h2 className="text-xl font-semibold mb-3">{heading}</h2>
            <div className="flex flex-col gap-2 text-(--color-footer-text) focus:text-(--color-accent-yellow)">
              {items.map(({ path, name }, index) => (
                <Link href={path} key={index}>
                  {name}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="md:max-w-60 max-w-100">
          <h2 className="text-xl font-semibold mb-3">STAY CONNECTED</h2>
          <div className="flex flex-col gap-2 text-(--color-footer-text) focus:text-(--color-footer-text)">
            <div>
              BookKart is a free platform where you can buy second hand books at
              very cheap prices. Buy used books online like college books,
              school books, much more near you.
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center flex-wrap md:gap-16 gap-4 flex-col md:flex-row md:mr-32 mt-8 w-full">
          {
            footFeatures.map(({heading,icon,description},index)=>(
              <FooterCard heading={heading} icon={icon} description={description} key={index}/>
            ))
          }
      </div>
    </footer>
  );
}
