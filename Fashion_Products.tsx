import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import ImgFashion from "../assets/ImgFashion.png"
import { Star, ListFilter, MoveRight, MoveLeft } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import { useNavigate } from "react-router-dom"


type FilterOption = {
  id: string
  label: string
}

const categories: FilterOption[] = [
  { id: "tshirts", label: "T-shirts" },
  { id: "shorts", label: "Shorts" },
  { id: "shirts", label: "Shirts" },
  { id: "hoodie", label: "Hoodie" },
  { id: "jeans", label: "Jeans" },
]

const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFA500", "#800080", "#000000", "#FFFFFF"]

const sizes: FilterOption[] = [
  { id: "xxs", label: "XX-Small" },
  { id: "xs", label: "X-Small" },
  { id: "s", label: "Small" },
  { id: "m", label: "Medium" },
  { id: "l", label: "Large" },
  { id: "xl", label: "X-Large" },
  { id: "xxl", label: "XX-Large" },
]

const dressStyles: FilterOption[] = [
  { id: "casual", label: "Casual" },
  { id: "formal", label: "Formal" },
  { id: "party", label: "Party" },
  { id: "gym", label: "Gym" },
]

// -------------- products: now 50 items for pagination --------------
// ✅ exported so ProductPageDetail can import
export const products = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  name: i % 2 === 0 ? "Gradient Graphic T-shirt" : "Polo with Tipping Details",
  price: 145 + (i % 5) * 5,
  rating: (i % 5) + 0.5 * ((i % 2) === 0 ? 1 : 0), // variety: 0.5,1.5,2.5,3.5,4.5 ...
  image: ImgFashion,
  discount: i % 3 === 0 ? 30 : null,
}))

// ------------------- FilterSidebar --------------------
function FilterSidebar({ onApply }: { onApply: () => void }) {
  const [price, setPrice] = useState([50, 200])
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  return (
    <div className="ml-4 mr-4">
      <div className="space-y-2 border rounded-lg p-3">
        <div className="flex flex-row justify-between items-center border-b-[1.5px]  border-black/10 ">
          <h3 className="font-bold text-2xl pb-3">Filters</h3>
          <ListFilter width={20} strokeWidth={4} />
        </div>

        <Accordion type="multiple" className="w-full space-y-1">
          {/* Category */}
          <AccordionItem value="category">
            <AccordionTrigger className="font-medium ">Category</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {categories.map((c) => (
                  <div key={c.id} className="flex items-center space-x-2">
                    <Checkbox id={c.id} />
                    <label htmlFor={c.id} className="text-sm">{c.label}</label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Price */}
          <AccordionItem value="price">
            <AccordionTrigger className="font-medium">Price</AccordionTrigger>
            <AccordionContent>
              <Slider className="p-2" defaultValue={[50, 200]} min={0} max={500} step={10} value={price} onValueChange={(val) => setPrice(val)} />
              <div className="text-sm mt-2">₹{price[0]} - ₹{price[1]}</div>
            </AccordionContent>
          </AccordionItem>

          {/* Colors */}
          <AccordionItem value="colors">
            <AccordionTrigger className="font-medium">Colors</AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-2 flex-wrap">
                {colors.map((c) => (
                  <button
                    key={c}
                    className={cn(
                      "w-6 h-6 rounded-full border-2",
                      selectedColors.includes(c) ? "border-black" : "border-gray-200"
                    )}
                    style={{ backgroundColor: c }}
                    onClick={() =>
                      setSelectedColors((prev) =>
                        prev.includes(c) ? prev.filter((col) => col !== c) : [...prev, c]
                      )
                    }
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Sizes */}
          <AccordionItem value="sizes">
            <AccordionTrigger className="font-medium">Size</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <Button key={s.id} variant="outline" size="sm">
                    {s.label}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Dress Style */}
          <AccordionItem value="dress-style">
            <AccordionTrigger className="font-medium">Dress Style</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {dressStyles.map((d) => (
                  <div key={d.id} className="flex items-center space-x-2">
                    <Checkbox id={d.id} />
                    <label htmlFor={d.id} className="text-sm">{d.label}</label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Apply */}
        <Button className="w-full " onClick={onApply}>
          Apply Filter
        </Button>
      </div>
    </div>
  )
}

// ------------------- StarRow (dynamic stars with half support) --------------------
function StarRow({ rating }: { rating: number }) {
  // rating e.g., 3.5
  const normalized = Math.max(0, Math.min(5, rating))
  const stars = Array.from({ length: 5 }, (_, i) => {
    // For the i-th star (0-based), compute fill percentage:
    const starIndex = i // 0..4
    const raw = (normalized - starIndex) * 100 // if >100 then full, if 50 then half, if <=0 then empty
    const fillPercent = Math.max(0, Math.min(100, raw))
    return fillPercent
  })

  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of 5`}>
      {stars.map((fill, idx) => (
        <span key={idx} className="relative w-5 h-5 inline-block">
          {/* base: outline star in gray */}
          <Star size={20} color="#E6E6E6" />
          {/* overlay: filled star clipped by width percent */}
          <span aria-hidden style={{ width: `${fill}%`, overflow: "hidden", position: "absolute", left: 0, top: 0, height: "100%" }} >
            <Star size={20} color="#FFC633" fill="#FFC633" />
          </span>
        </span>
      ))}
      <span className="text-sm text-gray-500 ml-2">{rating}/5</span>
    </div>
  )
}

// ------------------- ProductCard --------------------
function ProductCard({ product }: { product: typeof products[0] }) {
  const navigate = useNavigate()
  return (
    <div role="button" tabIndex={0} onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ")
          navigate(`/product/${product.id}`, { state: { product } })
      }}
      className="rounded-lg p-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2" >

      <img src={product.image} alt={product.name} className="rounded-md mb-3" />
      <h3 className="text-xl font-bold">{product.name}</h3>
      <div className="text-xl text-gray-500 mt-2">
        <StarRow rating={product.rating} />
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="font-semibold text-xl">₹{product.price}</span>
        {product.discount && (
          <span className="text-red-500 text-xs">-{product.discount}%</span>
        )}
      </div>
    </div>
  )
}

// ------------------- Main Page with Pagination --------------------
export default function ProductPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Pagination
  const [page, setPage] = useState(1)
  const pageSize = 12 // <-- change to 15 if you prefer 15 per page
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize))

  const pagedProducts = products.slice((page - 1) * pageSize, page * pageSize)

  function goToPage(p: number) {
    const next = Math.max(1, Math.min(totalPages, p))
    setPage(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="container mx-auto py-6">


      {/* Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar - hidden on small screens */}
        <aside className="col-span-3 hidden md:block">
          <FilterSidebar onApply={() => { }} />
        </aside>

        {/* Product grid */}
        <main className="col-span-12 md:col-span-9 ">
          {/* Header row */}
          <div className="flex md:flex-row  flex-col justify-between items-start md:items-center md:mb-6 mb-0 px-3">
            <h2 className="text-4xl font-bold pb-3 md:pb-0">Casual</h2>
            <div className="flex items-start md:items-center flex-col md:flex-row">
              <div className="pr-3 text-[16px] font-normal text-black/60 pb-3 md:pb-0">Showing 1-10 of 100 Products</div>
              <div className="flex items-center gap-3 pb-3 md:pb-0">
                {/* Sort dropdown */}
                <Select defaultValue="popular">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="new">Newest</SelectItem>
                    <SelectItem value="priceLow">Price: Low to High</SelectItem>
                    <SelectItem value="priceHigh">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                {/* Filter button for small screens */}
                <div className="md:hidden">
                  <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">Filter</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm">
                      <DialogHeader>
                        <DialogTitle>Filters</DialogTitle>
                      </DialogHeader>
                      <FilterSidebar onApply={() => setIsFilterOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4   gap-6 mx-auto">
            {pagedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination UI */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button variant="outline" onClick={() => goToPage(page - 1)} disabled={page === 1}>
              <MoveLeft /> <span className="hidden sm:block">Previous</span>
            </Button>

            {/* Page numbers: simple list */}
            <div className="inline-flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const active = p === page
                return (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={cn("px-3 py-1 rounded-md text-sm", active ? "bg-black text-white" : "bg-white border")}
                    aria-current={active ? "page" : undefined} > {p}
                  </button>
                )
              })}
            </div>

            <Button variant="outline" onClick={() => goToPage(page + 1)} disabled={page === totalPages}>
              <span className="hidden sm:block">Next</span> <MoveRight />
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
