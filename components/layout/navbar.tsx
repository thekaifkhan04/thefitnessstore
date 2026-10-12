"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TFSLogo } from "@/components/brand/tfs-logo";
import { useCart } from "@/context/cart-context";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ChevronDown,
  PhoneCall,
  Dumbbell,
  ShieldCheck,
  Flame,
} from "lucide-react";

interface CategoryLink {
  name: string;
  slug: string;
}

const CATEGORIES: CategoryLink[] = [
  { name: "Men's Wear", slug: "mens-wear" },
  { name: "Women's Wear", slug: "womens-wear" },
  { name: "Supplements", slug: "supplements" },
  { name: "Shakers", slug: "shakers" },
  { name: "Dumbbells", slug: "dumbbells" },
  { name: "Weight Plates", slug: "weight-plates" },
  { name: "Rods and Barbells", slug: "rods-and-barbells" },
  { name: "Gym & Lever Belts", slug: "gym-belts" },
  { name: "Gym Equipment", slug: "gym-equipment" },
  { name: "Machine Handles & Parts", slug: "machine-handles-and-parts" },
  { name: "Wrist Wraps & Supports", slug: "wrist-wraps-and-supports" },
  { name: "Resistance Bands", slug: "resistance-bands" },
  { name: "Gym Bags", slug: "gym-bags" },
  { name: "Skipping Ropes", slug: "skipping-ropes" },
  { name: "Gym Gloves & Joint Supports", slug: "gloves-and-supports" },
  { name: "Fitness Accessories", slug: "fitness-accessories" },
  { name: "Sports Gear", slug: "sports-gear" },
];

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
  }, [pathname]);

  const isAdminRoute = pathname?.startsWith("/admin");
  if (isAdminRoute) return null; // Admin has its own dedicated shell

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#080808]/90 backdrop-blur-md border-b border-[#222222] py-3 shadow-xl"
            : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <TFSLogo size="md" href="/" />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold uppercase tracking-wider text-neutral-300">
              <Link
                href="/"
                className={`hover:text-[#E31E2F] transition-colors ${
                  pathname === "/" ? "text-[#E31E2F]" : ""
                }`}
              >
                Home
              </Link>

              <Link
                href="/shop"
                className={`hover:text-[#E31E2F] transition-colors ${
                  pathname === "/shop" ? "text-[#E31E2F]" : ""
                }`}
              >
                Shop
              </Link>

              {/* Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                onMouseLeave={() => setCategoriesDropdownOpen(false)}
              >
                <button
                  className="flex items-center gap-1 hover:text-[#E31E2F] transition-colors py-2 cursor-pointer"
                  onClick={() => setCategoriesDropdownOpen((p) => !p)}
                >
                  <span>Categories</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" />
                </button>

                {categoriesDropdownOpen && (
                  <div className="absolute top-full -left-20 w-[480px] p-4 bg-[#111111]/95 backdrop-blur-xl border border-[#2b2b2b] rounded-xl shadow-2xl grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/shop/${cat.slug}`}
                        className="px-3 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-[#1a1a1a] hover:border-l-2 hover:border-[#E31E2F] transition-all flex items-center justify-between group"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[#E31E2F] opacity-0 group-hover:opacity-100 text-[10px]">
                          &rarr;
                        </span>
                      </Link>
                    ))}
                    <div className="col-span-2 pt-2 border-t border-[#222222] mt-1 flex justify-between items-center text-[11px] text-neutral-400">
                      <span>Total 17 Categories</span>
                      <Link
                        href="/shop"
                        className="text-[#E31E2F] font-semibold hover:underline"
                      >
                        View Full Catalogue &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/shop/gym-equipment"
                className={`hover:text-[#E31E2F] transition-colors ${
                  pathname === "/shop/gym-equipment" ? "text-[#E31E2F]" : ""
                }`}
              >
                Equipment
              </Link>

              <Link
                href="/shop/supplements"
                className={`hover:text-[#E31E2F] transition-colors ${
                  pathname === "/shop/supplements" ? "text-[#E31E2F]" : ""
                }`}
              >
                Supplements
              </Link>

              <Link
                href="/offers"
                className={`flex items-center gap-1 text-[#E31E2F] font-bold hover:brightness-110 transition-all ${
                  pathname === "/offers" ? "underline" : ""
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Offers</span>
              </Link>

              <Link
                href="/bulk-orders"
                className={`hover:text-[#E31E2F] transition-colors ${
                  pathname === "/bulk-orders" ? "text-[#E31E2F]" : ""
                }`}
              >
                Wholesale
              </Link>

              <Link
                href="/about"
                className={`hover:text-[#E31E2F] transition-colors ${
                  pathname === "/about" ? "text-[#E31E2F]" : ""
                }`}
              >
                About
              </Link>

              <Link
                href="/contact"
                className={`hover:text-[#E31E2F] transition-colors ${
                  pathname === "/contact" ? "text-[#E31E2F]" : ""
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Right Side Actions: Search, Cart, Mobile Menu */}
            <div className="flex items-center space-x-3">
              {/* Search Button */}
              <Link
                href="/search"
                className="p-2.5 rounded-lg text-neutral-300 hover:text-white hover:bg-[#181818] transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* Cart Trigger */}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-lg text-neutral-300 hover:text-white hover:bg-[#181818] transition-colors cursor-pointer"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E31E2F] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#080808] animate-in zoom-in-50">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen((p) => !p)}
                className="lg:hidden p-2.5 rounded-lg text-neutral-300 hover:text-white hover:bg-[#181818] transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden pt-20 bg-[#080808]/98 backdrop-blur-2xl flex flex-col p-6 overflow-y-auto border-b border-[#222222]">
          <div className="flex flex-col space-y-4 text-base font-semibold uppercase tracking-wider text-neutral-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#1c1c1c] hover:text-[#E31E2F]"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#1c1c1c] hover:text-[#E31E2F]"
            >
              All Products
            </Link>
            <Link
              href="/offers"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#1c1c1c] text-[#E31E2F] flex items-center gap-2"
            >
              <Flame className="w-4 h-4" /> Deals & Offers
            </Link>
            <Link
              href="/bulk-orders"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#1c1c1c] hover:text-[#E31E2F]"
            >
              Wholesale & Gym Bulk Enquiries
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#1c1c1c] hover:text-[#E31E2F]"
            >
              About TFS
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#1c1c1c] hover:text-[#E31E2F]"
            >
              Contact Us
            </Link>

            <div className="pt-2">
              <span className="text-xs text-neutral-500 tracking-widest block mb-2">
                POPULAR CATEGORIES
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs normal-case font-normal text-neutral-300">
                {CATEGORIES.slice(0, 10).map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/shop/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded bg-[#131313] border border-[#222222] hover:border-[#E31E2F]"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
