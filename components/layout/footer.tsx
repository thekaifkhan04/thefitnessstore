import React from "react";
import Link from "next/link";
import { TFSLogo } from "@/components/brand/tfs-logo";
import { MessageSquare, Phone, Mail, MapPin, ExternalLink, ShieldAlert } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = buildWhatsAppUrl("Hello THE FITNESS STORE! I would like to enquire about your products and wholesale availability.");

  return (
    <footer className="bg-[#060606] border-t border-[#1f1f1f] text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <TFSLogo size="lg" />
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              THE FITNESS STORE (TFS) is a leading retailer and wholesaler of sports goods, gym equipment, weightlifting accessories, fitness wear, and genuine supplements.
            </p>
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#141414] border border-[#2b2b2b] hover:border-[#E31E2F] hover:text-white transition-all text-xs font-semibold uppercase tracking-wider text-neutral-200"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span>Chat On WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-display text-white text-base font-bold uppercase tracking-wider">
              CATEGORIES
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/shop/mens-wear" className="hover:text-[#E31E2F] transition-colors">Men's Wear</Link></li>
              <li><Link href="/shop/womens-wear" className="hover:text-[#E31E2F] transition-colors">Women's Wear</Link></li>
              <li><Link href="/shop/supplements" className="hover:text-[#E31E2F] transition-colors">Supplements</Link></li>
              <li><Link href="/shop/shakers" className="hover:text-[#E31E2F] transition-colors">Shakers</Link></li>
              <li><Link href="/shop/dumbbells" className="hover:text-[#E31E2F] transition-colors">Dumbbells & Weights</Link></li>
              <li><Link href="/shop/gym-belts" className="hover:text-[#E31E2F] transition-colors">Lever & Gym Belts</Link></li>
              <li><Link href="/shop/gym-equipment" className="hover:text-[#E31E2F] transition-colors">Commercial Equipment</Link></li>
              <li><Link href="/shop/resistance-bands" className="hover:text-[#E31E2F] transition-colors">Resistance Bands</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-white text-base font-bold uppercase tracking-wider">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/shop" className="hover:text-[#E31E2F] transition-colors">All Products</Link></li>
              <li><Link href="/offers" className="text-[#E31E2F] hover:underline font-semibold">Featured Offers</Link></li>
              <li><Link href="/bulk-orders" className="hover:text-[#E31E2F] transition-colors">Wholesale & Gym Setup</Link></li>
              <li><Link href="/about" className="hover:text-[#E31E2F] transition-colors">About TFS</Link></li>
              <li><Link href="/contact" className="hover:text-[#E31E2F] transition-colors">Contact Details</Link></li>
              <li><Link href="/admin/login" className="hover:text-white transition-colors text-neutral-500">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Store Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-white text-base font-bold uppercase tracking-wider">
              CONTACT & SHOWROOM
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E31E2F] shrink-0 mt-0.5" />
                <span>Shop 12, Prime Fitness Hub, Commercial Plaza, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E31E2F] shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E31E2F] shrink-0" />
                <span>contact@thefitnessstore.com</span>
              </div>
              <div className="pt-2 text-[11px] text-neutral-500">
                <p>Timings: Mon – Sat: 10:00 AM – 8:30 PM</p>
                <p>Retail & Wholesale enquiries welcome.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Policies and Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#181818] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-neutral-300 transition-colors">Terms of Service</Link>
            <Link href="/shipping-policy" className="hover:text-neutral-300 transition-colors">Shipping Information</Link>
            <Link href="/returns-policy" className="hover:text-neutral-300 transition-colors">Return & Replacement Policy</Link>
          </div>
          <div>
            &copy; {currentYear} THE FITNESS STORE (TFS). All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
