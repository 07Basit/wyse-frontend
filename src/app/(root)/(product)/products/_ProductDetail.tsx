"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  cn,
  createSearchParamsUrl,
  getActualPrice,
  getDiscountOnPrice,
} from "@/utils/helper";
import { getProductDetails } from "@/services/product/product-detail";
import { IBatchProductDetail, IVariation } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { Check, NotebookText, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import {
  useGetProductBatch,
  useGetProductDetails,
} from "@/hooks/query/product";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Interweave } from "interweave";

const imageLink = [
  "https://nobero.com/cdn/shop/files/WebImagesHeavyCargo-0011.webp?v=1734158131",
  "https://nobero.com/cdn/shop/files/WebImagesHeavyCargo-0006.webp?v=1734158131",
  "https://nobero.com/cdn/shop/files/WebImagesHeavyCargo-0007.webp?v=1734158131&width=360",
  "https://nobero.com/cdn/shop/files/WebImagesHeavyCargo-0010.webp?v=1734158131&width=360",
];

const ProductDetail = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const id = searchParams.get("id");
  const batchId = searchParams.get("batch");
  const size = searchParams.get("size");

  if (id === null) return <></>;
  if (batchId === null) return <></>;

  const { data: productDetail, isLoading, isError } = useGetProductDetails(id);

  const {
    data: productBatchData,
    isLoading: isProductBatchLoading,
    isError: isProductBatchError,
  } = useGetProductBatch(batchId);

  function handleChange(field: string, value: string) {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(field, value);
    const searchUrl = createSearchParamsUrl(pathName, newParams);
    window.history.replaceState({}, "", searchUrl);
  }

  if (isLoading) return <h1> LoADING </h1>;
  if (isError) return <div>Sorry There was an Error</div>;

  const productInfo = productDetail?.data;
  const productBatch = productBatchData?.data;
  const imgLinks = productInfo?.imgLink;
  const variations: IVariation[] = productInfo?.variations;
  let variation = variations?.[0];

  const price = variation?.price;
  const discount = variation?.discount;

  return (
    <>
      <div className="relative">
        <Carousel className="relative mt-4">
          <CarouselContent>
            {imgLinks?.map((e: string, i: number) => (
              <CarouselItem key={i} className="relative basis-11/12 px-1">
                <Image
                  alt="asdf"
                  src={e}
                  width={500}
                  height={500}
                  style={{ height: "auto", width: "100%" }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <section className="px-2 py-3 flex flex-col gap-1">
          <p>{productInfo?.name}</p>
          <div className="flex gap-2 text-lg">
            <p className="font-semibold">₹{price}</p>
            <p className="font-semibold text-success">
              ₹{getDiscountOnPrice(price, discount)} OFF
            </p>
          </div>
          <div>
            <p className="flex gap-2 items-center">
              <span>MRP:</span>{" "}
              <span className="line-through">
                ₹{getActualPrice(price, discount)}
              </span>{" "}
              <span className="text-xs">Inclusive of all Taxes</span>{" "}
            </p>
          </div>
        </section>

        <section className="mt-4 px-2">
          <p className="">Select Color</p>
          <Carousel className="relative mt-2 he">
            <CarouselContent>
              {productBatch?.batchProductDetails?.map(
                (e: IBatchProductDetail, i: number) => (
                  <CarouselItem key={i} className="relative basis-1/4 px-1">
                    <Link href={`/products?id=${e.productDetailId}`}>
                      <Image
                        className={cn(
                          e.productDetailId === id && "border border-black"
                        )}
                        alt="asdf"
                        src={e.imgLink}
                        width={76}
                        height={115}
                        style={{ height: "auto", width: "100%" }}
                      />
                      {e.productDetailId === id && (
                        <div className="bg-background absolute-center rounded-full p-1">
                          <Check size={16} />
                        </div>
                      )}
                    </Link>
                  </CarouselItem>
                )
              )}
            </CarouselContent>
          </Carousel>
        </section>

        <section className="mt-4 px-2">
          <p>Select Size</p>
          <div className="flex flex-wrap  gap-5 mt-3">
            {variations.map((ele, index) => {
              if (ele.size === "base_size") return "";
              return (
                <div
                  role="button"
                  onClick={() => handleChange("size", ele.size)}
                  className={cn(
                    "px-4 py-1 border border-black",
                    size === ele.size && "bg-primary text-primary-foreground"
                  )}
                >
                  {ele.size}
                </div>
              );
            })}
          </div>
        </section>
        
        {/* According with product description */}
        <section className="px-2 mt-5">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <p className="flex items-center gap-2">
                  {" "}
                  <NotebookText /> <span>Product Description</span>
                </p>
              </AccordionTrigger>
              <AccordionContent>
                <Interweave
                  content={productInfo?.description?.productDetails}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <p className="flex items-center gap-2">
                  <Truck /> <span>Free Shipping</span>
                </p>
              </AccordionTrigger>
              <AccordionContent className="flex gap-2 flex-col">
                <p>
                  <span className="text-lg">Free Shipping</span>
                  <br />
                  <span className="">We offer free shipping across India.</span>
                </p>
                <p>
                  <span className="text-lg">1-2 Days Dispatch</span>
                  <br />
                  <span className="">We dispatch orders within 1-2 days.</span>
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Add cart button */}
        <section className="sticky top-[95%] mt-4 px-1">
          <Button size={"lg"} className="w-full">
            Add to Cart
          </Button>
        </section>
        <div className="h-16"></div>
      </div>
    </>
  );
};

export default ProductDetail;
