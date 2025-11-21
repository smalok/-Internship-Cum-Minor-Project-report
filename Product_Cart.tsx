// src/pages/FashionCart.tsx
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/Store";  // types


import { increaseQty, decreaseQty, removeItem, clearCart } from "../store/cartSlice";
import { Minus, Plus, Trash2, Phone, Mail, ShoppingCart, Star, MessageCircleCode, MoveRight, BadgePercent } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DELIVERY_FEE = 100;
const GLOBAL_DISCOUNT_PERCENT = 5; // like your screenshot shows -5%

export default function FashionCart() {
    const items = useSelector((s: RootState) => s.cart.items);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const subtotal = items.reduce((acc, it) => {
        // apply product-level discount if present: discounted price * qty
        const discountedPrice = it.discount ? Math.round(it.price * (1 - it.discount / 100)) : it.price;
        return acc + discountedPrice * it.qty;
    }, 0);

    // global discount (e.g. promo) applied on subtotal (rounded to nearest integer like screenshot)
    const discountAmount = Math.round((subtotal * GLOBAL_DISCOUNT_PERCENT) / 100);

    const total = subtotal - discountAmount + (items.length > 0 ? DELIVERY_FEE : 0);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="md:grid md:grid-cols-12 gap-6">
                {/* Left: cart items (col-span-8) */}
                <div className="col-span-12 md:col-span-8 bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingCart size={48} className="mx-auto text-gray-400" />
                            <div className="mt-4 text-lg font-medium">Your cart is empty</div>
                            <div className="text-sm text-gray-500 mt-2">Browse products and add items to your cart.</div>
                            <div className="mt-6 flex justify-center">
                                <Button onClick={() => navigate("/")} className="rounded-full">Browse Products</Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                {items.map((it) => {
                                    const discounted = it.discount ? Math.round(it.price * (1 - it.discount / 100)) : it.price;
                                    return (
                                        <div key={`${it.id}-${it.selectedSize}-${it.selectedColorIndex}`} className="flex items-center gap-4 border rounded-lg p-4">
                                            <img src={it.image ?? "/placeholder.png"} alt={it.name} className="w-24 h-24 object-contain rounded-md bg-gray-50" />
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="font-semibold">{it.name}</div>
                                                        <div className="text-sm text-gray-500">Net Qty: {it.qty}</div>
                                                        <div className="text-sm text-gray-500 mt-1">Size: {it.selectedSize ?? "M"}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-lg">₹{discounted}</div>
                                                        {it.discount && <div className="text-gray-400 line-through text-sm">₹{it.price}</div>}
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex items-center gap-3">
                                                    <div className="flex items-center bg-white border rounded-full px-2">
                                                        <button onClick={() => dispatch(decreaseQty({ id: it.id, selectedSize: it.selectedSize, selectedColorIndex: it.selectedColorIndex }))} className="p-2"><Minus /></button>
                                                        <div className="px-3">{it.qty}</div>
                                                        <button onClick={() => dispatch(increaseQty({ id: it.id, selectedSize: it.selectedSize, selectedColorIndex: it.selectedColorIndex }))} className="p-2"><Plus /></button>
                                                    </div>

                                                    <button onClick={() => dispatch(removeItem({ id: it.id, selectedSize: it.selectedSize, selectedColorIndex: it.selectedColorIndex }))} className="p-2">
                                                        <Trash2 />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6">
                                <Button onClick={() => navigate("/")} className="rounded-full"><Plus size={28} color="white" strokeWidth={3}/>Add More Items</Button>
                            </div>
                        </>
                    )}
                </div>

                {/* Right: Price details (col-span-4) */}
                <div className="col-span-12 md:col-span-4">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-lg mb-4">Price Details</h3>
                        <div className="text-sm text-gray-600 flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div className="text-sm text-gray-600 flex justify-between mb-2">
                            <span>Discount (-{GLOBAL_DISCOUNT_PERCENT}%)</span>
                            <span className="text-red-500">- ₹{discountAmount}</span>
                        </div>
                        <div className="text-sm text-gray-600 flex justify-between mb-3">
                            <span>Delivery Fee</span>
                            <span>₹{items.length > 0 ? DELIVERY_FEE : 0}</span>
                        </div>
                        <div className="border-t pt-3 mt-3 flex justify-between items-center">
                            <div className="text-lg font-bold">Total</div>
                            <div className="text-xl font-bold">₹{total}</div>
                        </div>

                        <div className="mt-4">
                            <div className="flex gap-2">
                                <input type="text" placeholder="Add promo code" className="flex-1 border rounded-md px-3 py-2" />
                                <button className="px-3 py-2 rounded-md border">Apply</button>
                            </div>
                            <Button className="mt-3 w-full rounded-full" onClick={() => navigate("/")}>Go to Checkout <MoveRight size={18} color="white"/></Button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button className="w-full border rounded-xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full"><BadgePercent size={30} fill="white" color="#FF3333"/></div>
                                <div>
                                    <div className="font-semibold">View Coupons & Offers</div>
                                </div>
                            </div>
                            <div><MoveRight size={18}/></div>
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <div className="text-sm mb-3">Need Help ?</div>
                        <div className="flex items-center justify-center gap-4">
                            <Button className=" p-5 rounded-full border"><Phone size={24}/></Button>
                            <Button className="p-5 rounded-full border"> <MessageCircleCode size={24}/></Button>
                            <Button className="p-5 rounded-full border"><Mail size={24}/></Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-span-12 mt-10">
                <div className="flex items-center justify-center  mb-5">
                    <h3 className="text-4xl font-semibold">You might also like</h3>
                </div>

                {items.length === 0 ? (
                    <div className="text-sm text-gray-500">No similar products found.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map((it) => (
                            <div role="button" key={it.id}
                                onClick={() => {
                                    // navigate to product detail and pass product in state for quick load
                                    navigate(`/product/${it.id}`, { state: { product: it } })
                                    // scroll to top smoothly
                                    window.scrollTo({ top: 0, behavior: "smooth" })
                                }}
                                className="p-3  rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                                aria-label={`View ${it.name}`}
                            >
                                <img src={it.image} alt={it.name} className="rounded-md mb-3" />
                                <div className="text-xl font-bold">{it.name}</div>
                                {/* <div className="text-xl text-gray-500 mt-2 flex items-center">
                                            {Array.from({ length: 5 }).map((_, i) => {
                                                const fillPercent = Math.max(0, Math.min(100, (it.rating - i) * 100))
                                                return (
                                                    <span key={i} className="relative  inline-block">
                                                        <Star size={20} color="#E6E6E6" />
                                                        <span style={{ width: `${fillPercent}%`, overflow: "hidden", position: "absolute", left: 0, top: 0, height: "100%" }}>
                                                            <Star size={20} color="#FFC633" fill="#FFC633" />
                                                        </span>
                                                    </span>
                                                )
                                            })}
                                            <span className="ml-2 text-sm">{it.rating}/5</span>
                                        </div> */}

                                <div className="flex items-center gap-2 mt-2">
                                    <span className="font-semibold text-xl">₹{it.price}</span>
                                    {it.discount && (
                                        <span className="text-red-500 text-xs">-{it.discount}%</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
