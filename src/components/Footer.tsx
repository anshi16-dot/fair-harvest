import React from 'react';
import { Sprout, Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-400 text-xs border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-base mb-2">
              <span className="w-6 h-6 rounded bg-emerald-800 text-amber-300 flex items-center justify-center">
                <Sprout className="w-4 h-4" />
              </span>
              <span>Fair Harvest</span>
            </div>
            <p className="text-stone-400 leading-relaxed mb-4">
              Direct Farmer-to-Buyer aggregation and logistics network engineered for the 8 northeastern states of India.
            </p>
            <div className="text-[11px] text-stone-500">
              In support of APEDA, NERAMAC, and North Eastern Regional Agricultural Marketing Initiatives.
            </div>
          </div>

          {/* Key Northeast Agricultural Hubs */}
          <div>
            <div className="text-white font-semibold uppercase tracking-wider text-xs mb-3">
              Key Aggregation Hubs
            </div>
            <ul className="space-y-2">
              <li>Ziro Valley Kiwi Center (Arunachal Pradesh)</li>
              <li>Dambuk Mandarin Terminal (Lower Dibang)</li>
              <li>Mangan Organic Spices Yard (Sikkim)</li>
              <li>Diphu Agro Collective (Karbi Anglong, Assam)</li>
              <li>Tamenglong Orange Depot (Manipur)</li>
              <li>Jowai Lakadong Turmeric Hub (Meghalaya)</li>
            </ul>
          </div>

          {/* Platform Navigation */}
          <div>
            <div className="text-white font-semibold uppercase tracking-wider text-xs mb-3">
              Direct Solutions
            </div>
            <ul className="space-y-2">
              <li><a href="#mandi-prices" className="hover:text-white transition-colors">Daily Mandi Intelligence</a></li>
              <li><a href="#produce-pools" className="hover:text-white transition-colors">FPO Produce Pooling</a></li>
              <li><a href="#transport" className="hover:text-white transition-colors">Shared Hill Truck Routes</a></li>
              <li><a href="#buyer-demand" className="hover:text-white transition-colors">Institutional Buyer Tenders</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">Farmer Earnings Calculator</a></li>
            </ul>
          </div>

          {/* Rural Farmer Help & Support */}
          <div>
            <div className="text-white font-semibold uppercase tracking-wider text-xs mb-3">
              Kisan Support Desk
            </div>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-white font-medium">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Toll-Free: 1800-180-1551</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-stone-500" />
                <span>support@fairharvest-northeast.in</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <span>Regional Coordinating Center: Guwahati Agricultural Terminal, Assam</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500">
          <div>
            &copy; 2026 Fair Harvest Network. Built for North East Smallholders &amp; Direct Buyers.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Code The Arena · Addovedi 2026</span>
            <span>·</span>
            <span>NIT Arunachal Pradesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
