import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Filter } from "lucide-react";
import { Link,useNavigate } from "react-router-dom";

// shadcn components (assumes you have shadcn/ui setup)
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import productimg from "../assets/product-img.png";

type Product = { id: number; title: string; subtitle: string; price: number; oldPrice?: number; rating?: number; image?: string; };

// increased product count so pagination shows multiple pages
const sampleProducts: Product[] = new Array(30).fill(0).map((_, i) => ({
    id: i + 1,
    title: "HP Laptop with Intel Core i7",
    subtitle: 'Intel Core i7 | 16GB RAM | 1TB SSD | 14" WQXGA Display | 1.4kg | Fast Charge',
    price: 122999,
    oldPrice: 132999,
    rating: 4.53,
    image: productimg,
}));

function Price({ price, oldPrice }: { price: number; oldPrice?: number }) {
    const toINR = (n: number) =>
        n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
    return (
        <div className=" flex items-baseline gap-3">
            {oldPrice && <span className="text-sm line-through text-gray-400">{toINR(oldPrice)}</span>}
            <span className="text-lg font-semibold text-rose-600">{toINR(price)}</span>
        </div>
    );
}

function Rating({ value }: { value?: number }) {
    return (
        <div className="text-sm text-gray-500 flex items-center gap-1">
            <Star fill="black" color="black" className="w-4 h-4" />
            <span>{value?.toFixed(2)}</span>
            <span className="mx-1">(436)</span>
        </div>
    );
}

function ProductCard({ p }: { p: Product }) {
    const navigate = useNavigate(); 
    return (
        <Card className="shadow-[2px_3px_9px_0px_#00000014] p-0 border-0 " onClick={() => navigate("/product-detail")}>
            <div className="relative">
                <div className="absolute left-3 top-3 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-md">15%</div>
                <img src={p.image} alt={p.title} className="w-full h-auto object-contain p-4 rounded-t-lg bg-white" />
            </div>
            <CardContent className="p-4">
                <h3 className="text-sm font-medium text-gray-800 group-hover:text-gray-900">{p.title}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-snug">{p.subtitle}</p>
                <div className="mt-3 flex items-center justify-between">
                    <Price price={p.price} oldPrice={p.oldPrice} />
                    <Rating value={p.rating} />
                </div>
            </CardContent>
        </Card>
    );
}

function SidebarFilters() {
    const [minPrice, setMinPrice] = useState(70000);
    const [maxPrice, setMaxPrice] = useState(150000);

    return (
        <div className="flex flex-col sm:flex-row lg:flex-col justify-between  bg-white p-4 rounded-lg border shadow-sm w-full">
            <div>
                <h4 className="font-semibold text-gray-800 mb-4">Color</h4>
                <div className="flex gap-3 mb-6">
                    <button className="w-6 h-6 rounded-full bg-black border-2 border-white shadow-sm ring-1"></button>
                    <button className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white shadow-sm"></button>
                    <button className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white shadow-sm"></button>
                    <button className="w-6 h-6 rounded-full bg-indigo-900 border-2 border-white shadow-sm"></button>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-gray-800 mb-2">Price</h4>
                <div className="text-xs text-gray-500 mb-3">{`₹${minPrice.toLocaleString()} To ₹${maxPrice.toLocaleString()}`}</div>
                <div className="flex gap-2 items-center">
                    <Input value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="w-28 text-sm" />
                    <Input value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-28 text-sm" />
                </div>
                <div className="mt-3">
                    <input type="range" min={0} max={300000} value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="w-full" />
                    <input type="range" min={0} max={300000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full mt-2 mb-6" />
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-gray-800">Ram</h4>
                <div className="flex flex-col gap-2 mt-2">
                    <label className="flex items-center gap-2 text-sm"> <Checkbox id="ram16" />
                        <span>16GB <span className="text-xs text-gray-400">(5)</span></span>
                    </label>
                    <label className="flex items-center gap-2 text-sm mb-6"> <Checkbox id="ram8" />
                        <span>8GB <span className="text-xs text-gray-400">(21)</span></span>
                    </label>
                </div>
            </div>

            <div >
                <h4 className="font-semibold text-gray-800">Brand</h4>
                <div className="flex flex-col gap-2 mt-2 text-sm">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" /> <span>Lenovo <span className="text-xs text-gray-400">(56)</span></span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" /> <span>Asus <span className="text-xs text-gray-400">(32)</span></span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" /> <span>HP <span className="text-xs text-gray-400">(185)</span></span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" /> <span>Macbook <span className="text-xs text-gray-400">(75)</span></span>
                    </label>
                </div>
            </div>
        </div>
    );
}

export default function Product() {
    const [query, setQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;
    const totalPages = Math.ceil(sampleProducts.length / productsPerPage);

    const startIdx = (currentPage - 1) * productsPerPage;
    const currentProducts = sampleProducts.slice(startIdx, startIdx + productsPerPage);

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mx-auto">
                <nav className="text-xs text-gray-400 mb-6"><Link to="/" >Home</Link> &gt; <Link to="">Laptops</Link> &gt;</nav>
                <div className=" mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Explore All laptops</h1>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Sidebar */}
                    <div className={` col-span-12 xl:col-span-3 lg:col-span-4 ${showFilters ? "block" : "hidden lg:block"}`}><SidebarFilters />
                    </div>

                    {/* Product grid */}
                    <div className="col-span-12 xl:col-span-9 lg:col-span-8 ">
                        <div className="flex flex-col sm:flex-row justify-between gap-2 mb-6">
                            <div className="text-[26px] text-[#272727] font-medium ">Laptops <span className="text-[#939393] text-[18px] font-normal ">2,000+ products at 15 stores</span></div>
                            <div className="flex  items-center gap-2">
                                <label className=" text-gray-600">Sort by :</label>
                                <select className="text-[#939393] font-medium   bg-white p-1 rounded-md border shadow-sm">
                                    <option>Relevance</option>
                                </select>
                                {/* Mobile Filter Toggle */}
                                <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>
                                    <Filter className="w-4 h-4 mr-2" /> Filters
                                </Button>
                            </div>

                        </div>
                        <div className="grid  grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {currentProducts.map((p) => (
                                <ProductCard key={p.id} p={p} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-8 flex items-center justify-center">
                            <div>
                                <Button variant="outline" size="sm" className="mr-2" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} >
                                    <ChevronLeft className="w-4 h-4" /> Previous
                                </Button>

                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <Button key={i + 1} variant={currentPage === i + 1 ? "default" : "ghost"} size="sm" onClick={() => setCurrentPage(i + 1)} >
                                        {i + 1}
                                    </Button>
                                ))}

                                <Button variant="outline" size="sm" className="ml-2" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}> Next <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
