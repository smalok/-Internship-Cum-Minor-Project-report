import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Package, MapPin, CreditCard, Heart, Key, LogOut, Smartphone, Trash2, Pencil, } from "lucide-react";
import productimg from "../assets/product-img.png";

type Tab = | "profile" | "orders" | "addresses" | "upi" | "cards" | "wishlist" | "password" | "logout";

const Account = () => {
    const [activeTab, setActiveTab] = useState<Tab>("profile");

    const menuItems = [
        { id: "profile", label: "My Profile", icon: User },
        { id: "orders", label: "My Orders", icon: Package },
        { id: "addresses", label: "Manage Addresses", icon: MapPin },
        { id: "upi", label: "Saved UPI", icon: Smartphone },
        { id: "cards", label: "Saved Cards", icon: CreditCard },
        { id: "wishlist", label: "My Wishlists", icon: Heart },
        { id: "password", label: "Reset Password", icon: Key },
        { id: "logout", label: "Logout", icon: LogOut },
    ]

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row  bg-gray-50 p-4 gap-4">
                {/* Sidebar */}
                <Card className="w-full md:w-64 p-4 flex flex-col items-center md:items-start">
                    <div className="flex flex-row items-center mb-6 border-b-[1.5px] border-gray-200 w-full">
                        <img src={productimg} alt="Profile" className="rounded-full w-20 h-20 mb-2" />
                        <div>
                            <p className="font-medium">Your name</p>
                            <p className="text-sm text-gray-500 mb-4">+91 91234 56789</p>
                        </div>
                    </div>

                    <nav className="w-full space-y-2">
                        {menuItems.map(({ id, label, icon: Icon }) => (
                            <Button key={id} variant={activeTab === id ? "secondary" : "ghost"} className="w-full justify-start gap-2" onClick={() => setActiveTab(id as Tab)}>
                                <Icon size={18} />{label}
                            </Button>
                        ))}
                    </nav>
                </Card>

                {/* Content */}
                <Card className="flex-1 p-6">
                    <CardContent className="p-0">
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">My Profile</h2>
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>First Name</Label>
                                        <Input placeholder="Enter first name" />
                                    </div>
                                    <div>
                                        <Label>Last Name</Label>
                                        <Input placeholder="Enter last name" />
                                    </div>
                                    <div>
                                        <Label>Mobile Number</Label>
                                        <Input placeholder="Enter mobile number" />
                                    </div>
                                    <div>
                                        <Label>Alternate Mobile Number</Label>
                                        <Input placeholder="Enter alternate mobile" />
                                    </div>
                                    <div>
                                        <Label>Email Id</Label>
                                        <Input type="email" placeholder="Enter email" />
                                    </div>
                                    <div>
                                        <Label>Alternate Email Id</Label>
                                        <Input type="email" placeholder="Enter alternate email" />
                                    </div>
                                    <div>
                                        <Label>Date of Birth</Label>
                                        <Input type="date" />
                                    </div>
                                </form>
                                <div className="mt-6">
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        Edit Profile
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === "orders" && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">My Orders</h2>
                                <div className="flex items-center gap-2 mb-4">
                                    <Input placeholder="Search Orders" className="max-w-sm" />
                                    <Button>Search</Button>
                                    <select className="ml-auto border rounded px-3 py-2 text-sm">
                                        <option>Last 3 months</option>
                                        <option>Last 6 months</option>
                                        <option>Last 1 year</option>
                                    </select>
                                </div>

                                {[1, 2].map((order) => (
                                    <Card key={order} className="mb-4 p-4">
                                        <div className="flex flex-col md:flex-row items-center gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500"> Order ID: 123456789 </p>
                                                <img src={productimg} alt="product" className="rounded-md w-[164px] h-[164px] object-contain" />
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h3 className="text-[20px] sm:text-[22px] md:text-[24px] leading-[30px] font-medium text-[#333333]">HP Laptop with Intel Core i7</h3>
                                                <div className="text-sm">Qty: <span className="text-black font-semibold">1 Nos</span></div>
                                               
                                                <div className="flex flex-row justify-between items-center mt-4">
                                                     <div className="font-semibold mt-1 text-[30px] text-black">$240</div>
                                                    <div className="flex gap-2">
                                                {order === 1 ? (
                                                    <>
                                                        <Button variant="destructive">Cancel Order</Button>
                                                        <Button>Track Order</Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button variant="secondary">Return Order</Button>
                                                        <Button>Reorder</Button>
                                                    </>
                                                )}
                                            </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === "addresses" && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Manage Addresses</h2>
                                {[1, 2].map((address) => (
                                    <Card key={address} className="mb-4 p-4 flex justify-between">
                                        <div>
                                            <p className="font-medium">User Name</p>
                                            <p className="text-sm text-gray-600">
                                                123 Anywhere St., Any City, ST 12345
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon">
                                                <Pencil size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Trash2 size={16} className="text-red-500" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    + Add New Address
                                </Button>
                            </div>
                        )}

                        {/* UPI Tab */}
                        {activeTab === "upi" && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Saved UPI</h2>
                                {[1, 2].map((upi) => (
                                    <Card key={upi} className="mb-4 p-4 flex justify-between">
                                        <p className="font-medium">abcd@bank</p>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon">
                                                <Pencil size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Trash2 size={16} className="text-red-500" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    + Add New UPI Id
                                </Button>
                            </div>
                        )}

                        {/* Cards Tab */}
                        {activeTab === "cards" && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Saved Cards</h2>
                                {[1, 2].map((card) => (
                                    <Card key={card} className="mb-4 p-4 flex justify-between">
                                        <p className="font-medium">**** **** **** 1234</p>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon">
                                                <Pencil size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Trash2 size={16} className="text-red-500" />
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    + Add New Card
                                </Button>
                            </div>
                        )}

                        {/* Wishlist Tab */}
                        {activeTab === "wishlist" && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">My Wishlists</h2>
                                {[1, 2].map((wish) => (
                                    <Card key={wish} className="mb-4 p-4 flex justify-between">
                                        <div className="flex gap-4 items-center">
                                            <img
                                                src={productimg}
                                                alt="wishlist"
                                                className="rounded-md"
                                            />
                                            <div>
                                                <h3 className="font-medium">
                                                    HP Laptop with Intel Core i7
                                                </h3>
                                                <p className="font-semibold mt-1">$240</p>
                                            </div>
                                        </div>
                                        <Button>Add to Cart</Button>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Reset Password Tab */}
                        {activeTab === "password" && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
                                <form className="grid gap-4 max-w-md">
                                    <div>
                                        <Label>Current Password</Label>
                                        <Input type="password" placeholder="Enter current password" />
                                    </div>
                                    <div>
                                        <Label>New Password</Label>
                                        <Input type="password" placeholder="Enter new password" />
                                    </div>
                                    <div>
                                        <Label>Confirm Password</Label>
                                        <Input
                                            type="password"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        Update Password
                                    </Button>
                                </form>
                            </div>
                        )}

                        {/* Logout Tab */}
                        {activeTab === "logout" && (
                            <div className="flex flex-col items-center justify-center py-10">
                                <h2 className="text-xl font-semibold mb-4">Logout</h2>
                                <p className="mb-6 text-gray-600">
                                    Are you sure you want to log out?
                                </p>
                                <Button variant="destructive">Confirm Logout</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Account;
