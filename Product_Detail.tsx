// ProductPageDetail.tsx
import { useState, useMemo, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { products as allProducts } from "./ProductPage" // adjust path if needed
import ImgFashion from "../assets/ImgFashion.png"
import ImgPrdtDetail1 from "../assets/ImgPrdtDetail1.png"
import ImgPrdtDetail2 from "../assets/ImgPrdtDetail2.png"
import { Star, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDispatch } from "react-redux";
import { addItem } from "../store/cartSlice";
import type { AppDispatch } from "../store/Store";


type Product = {
    id: number
    name: string
    price: number
    rating: number
    image: string
    discount?: number | null
}

const placeholderDescription =
    "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style."

export default function ProductPageDetail() {
    const { id } = useParams<{ id: string }>()
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>();

    // try to get product from navigation state first (faster)
    const stateProduct = (location && (location as any).state && (location as any).state.product) as Product | undefined

    const product = useMemo(() => {
        if (stateProduct) return stateProduct
        const pid = Number(id)
        const found = allProducts.find((p) => p.id === pid)
        // fallback placeholder
        return found ?? {
            id: -1,
            name: "Unknown Product",
            price: 0,
            rating: 0,
            image: ImgFashion,
            discount: null,
        }
    }, [id, stateProduct])

    // gallery thumbnails: for now use three variants (same image placeholder)
    const gallery = [product.image, ImgPrdtDetail1, ImgPrdtDetail2]

    const [mainImage, setMainImage] = useState<string>(gallery[0])
    const [selectedColor, setSelectedColor] = useState<number>(0)
    const [selectedSize, setSelectedSize] = useState<string | null>("Medium")
    const [qty, setQty] = useState<number>(1)
    const [activeTab, setActiveTab] = useState<"details" | "reviews" | "faqs">("details")

    // reset states when product changes (so clicking suggestion updates UI)
    useEffect(() => {
        setMainImage(gallery[0])
        setSelectedColor(0)
        setSelectedSize("Medium")
        setQty(1)
    }, [product.id]) // eslint-disable-line react-hooks/exhaustive-deps

    function changeQty(delta: number) {
        setQty((q) => Math.max(1, q + delta))
    }

    // Format price with discount
    const discountedPrice = product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price

    // ---------- Product Details Data ----------
    const description =
        "Lorem ipsum dolor sit amet consectetur. Eget dolor in senectus convallis aliquet. Placerat elementum massa eu molestie mauris semper fusce. Aliquam adipiscing sit sit vestibulum venenatis auctor sem eget ac. Enim justo arcu leo fusce sollicitudin eget duis."

    const features = [
        { text: "Lorem ipsum dolor sit amet consectetur. Sapien odio id leo varius sem." },
        { text: "Lorem ipsum dolor sit amet consectetur. Eu egestas aliquam sem eu sapien ac gravida elementum." },
        { text: "Lorem ipsum dolor sit amet consectetur. Donec ornare urna pellentesque massa nulla quam viverra non leo." },
        { text: "Lorem ipsum dolor sit amet consectetur. Orci cras etiam nibh molestie sed l" },
        { text: "Lorem ipsum dolor sit amet consectetur. Ultricies justo at nunc elit morbi id." },
        { text: "Lorem ipsum dolor sit amet consectetur. Ornare nisi penatibus sed consequat." },
    ]

    const specs = [
        { key: "Lorem ipsum", value: "Lorem ipsum dolor sit amet consectetur." },
        { key: "Lorem ipsum", value: "Lorem ipsum" },
        { key: "Lorem ipsum", value: "orem ipsum dolor sit amet consectetur. Sapien odio id leo varius se" },
        { key: "Lorem ipsum", value: "Lorem ipsum" },
        { key: "orem ipsum dolor sit amet consectetur. Sapien odio id leo varius se", value: "Lorem ipsum" },
        { key: "Lorem ipsum", value: "Lorem ipsum" },
        { key: "Lorem ipsum", value: "Lorem ipsum" },
    ]
    // ------------------------------------------

    // ------------------ Similar products logic ------------------
    // Compute similarity score for each other product and pick top N
    const similarProducts = useMemo(() => {
        if (!product || product.id === -1) return []

        // tokenize helper
        const tokenize = (s: string) =>
            s
                .toLowerCase()
                .replace(/[^\w\s]/g, "")
                .split(/\s+/)
                .filter(Boolean)

        const targetTokens = new Set(tokenize(product.name))

        function nameOverlapScore(p: Product) {
            const tokens = tokenize(p.name)
            if (tokens.length === 0) return 0
            const shared = tokens.filter((t) => targetTokens.has(t)).length
            return shared / Math.max(1, tokens.length)
        }

        function ratingScore(p: Product) {
            // closer rating gets higher score
            const diff = Math.abs(p.rating - product.rating)
            return Math.max(0, 1 - diff / 5) // normalized 0..1
        }

        function priceScore(p: Product) {
            // smaller price distance -> higher score (use 200 as expected price span)
            const diff = Math.abs(p.price - product.price)
            const span = 200 // tuning constant
            return Math.max(0, 1 - Math.min(diff / span, 1))
        }

        const scored = allProducts
            .filter((p) => p.id !== product.id)
            .map((p) => {
                const score =
                    0.5 * nameOverlapScore(p) + // name has higher weight
                    0.25 * ratingScore(p) +
                    0.25 * priceScore(p)
                return { p, score }
            })
            .sort((a, b) => b.score - a.score)

        // return up to 6 best matches
        return scored.slice(0, 4).map((s) => s.p)
    }, [product])

    // ------------------------------------------------------------

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-center">
                <div className="md:grid grid-cols-12 gap-5">
                    {/* Thumbnails column */}
                    <div className="col-span-2 hidden md:block">
                        <div className="space-y-4 flex flex-col items-center justify-center">
                            {gallery.map((img, idx) => (
                                <button key={idx} onClick={() => setMainImage(img)}
                                    className={`max-w-30 max-h-30 overflow-hidden rounded-md ${mainImage === img ? "ring-2 ring-offset-2 ring-black" : "bg-white"}`}
                                >
                                    <img src={img} alt={`thumb-${idx}`} className="w-auto h-auto object-contain rounded-md"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main image */}
                    <div className="col-span-12 md:col-span-5 space-y-4">
                        <div className="bg-[#F7F7F7] rounded-xl p-6 flex items-center justify-center">
                            <img src={mainImage} alt={product.name} className="max-h-[420px] object-contain" />
                        </div>
                        <div className=" block md:hidden mb-8">
                            <div className="space-x-4 flex flex-row items-center justify-center">
                                {gallery.map((img, idx) => (
                                    <button key={idx} onClick={() => setMainImage(img)}
                                        className={`max-w-30 object-contain overflow-hidden max-h-30 rounded-md ${mainImage === img ? "ring-2 ring-offset-2 ring-black" : "bg-white"}`}>
                                        <img src={img} alt={`thumb-${idx}`} className="w-auto h-auto object-contain rounded-md" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Product info */}
                    <div className="col-span-12 md:col-span-5">
                        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-3">
                            {/* Stars */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const fillPercent = Math.max(0, Math.min(100, (product.rating - i) * 100))
                                    return (
                                        <span key={i} className="relative w-5 h-5 inline-block">
                                            <Star size={20} color="#E6E6E6" />
                                            <span style={{ width: `${fillPercent}%`, overflow: "hidden", position: "absolute", left: 0, top: 0, height: "100%", }}>
                                                <Star size={20} color="#FFC633" fill="#FFC633" />
                                            </span>
                                        </span>
                                    )
                                })}
                                <span className="text-sm text-gray-500 ml-2">{product.rating}/5</span>
                            </div>
                        </div>

                        {/* Price & discount */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="text-2xl font-bold">₹{discountedPrice}</div>
                            {product.discount && <div className="text-gray-400 line-through">₹{product.price}</div>}
                            {product.discount && (
                                <div className="px-2 py-1 text-sm rounded-full bg-pink-100 text-pink-600">
                                    -{product.discount}%
                                </div>
                            )}
                        </div>

                        <p className="text-sm text-gray-600 mb-6">{placeholderDescription}</p>

                        <hr className="my-4" />

                        {/* Select Colors */}
                        <div className="mb-4">
                            <div className="text-sm font-medium mb-2">Select Colors</div>
                            <div className="flex items-center gap-3">
                                {["#6B8E23", "#234E3A", "#1F2937"].map((c, idx) => (
                                    <button key={c} onClick={() => setSelectedColor(idx)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedColor === idx ? "ring-2 ring-black" : ""}`}
                                        style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </div>

                        <hr className="my-4" />

                        {/* Choose Size */}
                        <div className="mb-4">
                            <div className="text-sm font-medium mb-3">Choose Size</div>
                            <div className="flex items-center gap-3 flex-wrap">
                                {["Small", "Medium", "Large", "X-Large"].map((s) => (
                                    <button key={s} onClick={() => setSelectedSize(s)}
                                        className={`px-4 py-2 rounded-full text-sm ${selectedSize === s ? "bg-black text-white" : "bg-white border"}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <hr className="my-4" />

                        {/* Quantity + Add to Cart */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3 bg-white border rounded-full px-3 ">
                                <button onClick={() => changeQty(-1)} aria-label="Decrease" className="p-1"><Minus /></button>
                                <div className="px-2">{qty}</div>
                                <button onClick={() => changeQty(1)} aria-label="Increase" className="p-1"><Plus /></button>
                            </div>
                            <Button className="flex-1 rounded-full" onClick={() => {
                                // build cart payload from current selection
                                dispatch(
                                    addItem({
                                        id: product.id,
                                        name: product.name,
                                        price: product.price,
                                        discount: product.discount ?? null,
                                        image: product.image,
                                        qty,
                                        selectedSize,
                                        selectedColorIndex: selectedColor,
                                    })
                                );
                                // navigate to cart page
                                navigate("/fashioncart");
                            }}>
                                Add to Cart
                            </Button>
                        </div>
                    </div>

                    {/* Tabs area full width below */}
                    <div className="col-span-12 mt-8">
                        <div className="border-b">
                            <nav className="flex items-center justify-evenly gap-8">
                                <div>
                                    <button onClick={() => setActiveTab("details")} className={`pb-3 text-lg ${activeTab === "details" ? "font-semibold border-b-2 border-black" : "text-gray-600"}`}>
                                        Product Details
                                    </button>
                                </div>
                                <div>
                                    <button onClick={() => setActiveTab("reviews")}
                                        className={`pb-3 text-lg ${activeTab === "reviews" ? "font-semibold border-b-2 border-black" : "text-gray-600"}`}>
                                        Rating & Reviews
                                    </button>
                                </div>
                                <div>
                                    <button onClick={() => setActiveTab("faqs")}
                                        className={` pb-3 text-lg ${activeTab === "faqs" ? "font-semibold border-b-2 border-black" : "text-gray-600"}`}>
                                        FAQs
                                    </button>
                                </div>
                            </nav>
                        </div>

                        <div className="mt-6">
                            {activeTab === "details" && (
                                <div className="bg-gray-50  rounded-lg p-1 text-base">
                                    <p className="text-neutral-800 mb-6">{description}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Left side: bullet list */}
                                        <ul className="space-y-5">
                                            {features.map((item, idx) => (
                                                <li key={idx} className="flex items-start space-x-2">
                                                    <span className="text-black font-bold">•</span>
                                                    <span >{item.text}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Right side: key-value table */}
                                        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-3">
                                            <div>
                                                {specs.map((spec, idx) => (
                                                    <div key={idx} className={`grid grid-cols-2 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`} >
                                                        <div className="px-4 py-3 ">{spec.key}</div>
                                                        <div className="px-4 py-3 ">{spec.value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "reviews" && (
                                <div className="text-sm text-gray-700">
                                    <p className="mb-3">Average rating: {product.rating}/5</p>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <div className="font-semibold">Alex</div>
                                                <div className="text-sm text-gray-500">2 days ago</div>
                                            </div>
                                            <p className="text-gray-600 mt-2">Nice shirt, comfortable and good fit.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "faqs" && (
                                <div className="text-sm text-gray-700">
                                    <div className="space-y-3">
                                        <div>
                                            <div className="font-medium">What is the return policy?</div>
                                            <div className="text-gray-600">You can return within 7 days...</div>
                                        </div>
                                        <div>
                                            <div className="font-medium">Does it shrink after wash?</div>
                                            <div className="text-gray-600">
                                                Minimal shrinkage if washed in hot water.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* You Might Also Like this */}
                    <div className="col-span-12 mt-10">
                        <div className="flex items-center justify-center  mb-5">
                            <h3 className="text-4xl font-semibold">You might also like</h3>
                        </div>

                        {similarProducts.length === 0 ? (
                            <div className="text-sm text-gray-500">No similar products found.</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {similarProducts.map((sp) => (
                                    <div role="button" key={sp.id}
                                        onClick={() => {
                                            // navigate to product detail and pass product in state for quick load
                                            navigate(`/product/${sp.id}`, { state: { product: sp } })
                                            // scroll to top smoothly
                                            window.scrollTo({ top: 0, behavior: "smooth" })
                                        }}
                                        className="p-3  rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                                        aria-label={`View ${sp.name}`}
                                    >
                                        <img src={sp.image} alt={sp.name} className="rounded-md mb-3" />
                                        <div className="text-xl font-bold">{sp.name}</div>
                                        <div className="text-xl text-gray-500 mt-2 flex items-center">
                                            {Array.from({ length: 5 }).map((_, i) => {
                                                const fillPercent = Math.max(0, Math.min(100, (sp.rating - i) * 100))
                                                return (
                                                    <span key={i} className="relative  inline-block">
                                                        <Star size={20} color="#E6E6E6" />
                                                        <span style={{ width: `${fillPercent}%`, overflow: "hidden", position: "absolute", left: 0, top: 0, height: "100%" }}>
                                                            <Star size={20} color="#FFC633" fill="#FFC633" />
                                                        </span>
                                                    </span>
                                                )
                                            })}
                                            <span className="ml-2 text-sm">{sp.rating}/5</span>
                                        </div>

                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="font-semibold text-xl">₹{sp.price}</span>
                                            {sp.discount && (
                                                <span className="text-red-500 text-xs">-{sp.discount}%</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
