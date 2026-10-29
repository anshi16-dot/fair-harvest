/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { MandiPriceBoard } from './components/MandiPriceBoard';
import { ProducePools } from './components/ProducePools';
import { FarmerCollectives } from './components/FarmerCollectives';
import { LogisticsBoard } from './components/LogisticsBoard';
import { BuyerMarketplace } from './components/BuyerMarketplace';
import { FarmerListingModal } from './components/FarmerListingModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { VoiceMessenger } from './components/VoiceMessenger';
import { FaqAndImpact } from './components/FaqAndImpact';
import { Footer } from './components/Footer';
import { Mic, MessageSquare } from 'lucide-react';
import {
  INITIAL_POOLS,
  INITIAL_ROUTES,
  INITIAL_BUYER_INQUIRIES,
  RECENT_FARMER_LISTINGS,
  INITIAL_FARMER_GROUPS,
  CROP_DATA
} from './data/mockData';
import {
  CropInfo,
  FarmerListing,
  ProducePool,
  TransportRoute,
  BuyerInquiry,
  UserRole,
  FarmerBatchGroup,
  FarmerGroupMember,
  CommercialBuyerBid
} from './types';

function MainApp() {
  const [userRole, setUserRole] = useState<UserRole>('farmer');
  const [pools, setPools] = useState<ProducePool[]>(INITIAL_POOLS);
  const [farmerGroups, setFarmerGroups] = useState<FarmerBatchGroup[]>(INITIAL_FARMER_GROUPS);
  const [routes, setRoutes] = useState<TransportRoute[]>(INITIAL_ROUTES);
  const [farmerListings, setFarmerListings] = useState<FarmerListing[]>(RECENT_FARMER_LISTINGS);
  const [buyerInquiries, setBuyerInquiries] = useState<BuyerInquiry[]>(INITIAL_BUYER_INQUIRIES);

  // Modals
  const [isSellModalOpen, setIsSellModalOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [selectedCropForListing, setSelectedCropForListing] = useState<CropInfo | null>(null);

  // Handlers
  const handleJoinPool = (pool: ProducePool, quantityKg: number) => {
    setPools((prev) =>
      prev.map((p) => {
        if (p.id === pool.id) {
          const newQty = p.currentQuantityKg + quantityKg;
          return {
            ...p,
            currentQuantityKg: newQty,
            farmersCount: p.farmersCount + 1,
            status: newQty >= p.targetQuantityKg ? 'target_reached' : 'open',
          };
        }
        return p;
      })
    );
  };

  const handleBookCrates = (routeId: string, cratesCount: number) => {
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id === routeId) {
          return {
            ...r,
            bookedCrates: Math.min(r.totalCapacityCrates, r.bookedCrates + cratesCount),
          };
        }
        return r;
      })
    );
  };

  const handleAddFarmerListing = (newListing: FarmerListing) => {
    setFarmerListings((prev) => [newListing, ...prev]);

    // If marked for pooling, also increment appropriate pool
    if (newListing.pooled) {
      setPools((prev) =>
        prev.map((p) => {
          if (p.cropName.toLowerCase().includes(newListing.crop.toLowerCase().split(' ')[0])) {
            return {
              ...p,
              currentQuantityKg: p.currentQuantityKg + newListing.quantityKg,
              farmersCount: p.farmersCount + 1,
            };
          }
          return p;
        })
      );
    }
  };

  const handlePostInquiry = (inquiry: BuyerInquiry) => {
    setBuyerInquiries((prev) => [inquiry, ...prev]);
  };

  const handleFundPool = (poolId: string) => {
    setPools((prev) =>
      prev.map((p) => {
        if (p.id === poolId) {
          return {
            ...p,
            buyerOfferReceived: {
              buyerName: 'Institutional Partner (Escrow Secured)',
              buyerType: 'Supermarket',
              offeredPricePerKg: p.pricePerKg + 5,
              status: 'escrow_funded',
            },
          };
        }
        return p;
      })
    );
  };

  const handleJoinFarmerGroup = (groupId: string, member: FarmerGroupMember) => {
    setFarmerGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const newAgg = g.currentAggregatedKg + member.pledgedQuantityKg;
          return {
            ...g,
            currentAggregatedKg: newAgg,
            members: [member, ...g.members],
            status: newAgg >= g.targetCommercialVolumeKg ? 'batch_locked' : g.status,
          };
        }
        return g;
      })
    );
  };

  const handleCreateFarmerGroup = (newGroup: FarmerBatchGroup) => {
    setFarmerGroups((prev) => [newGroup, ...prev]);
  };

  const handlePlaceBuyerBidOnGroup = (groupId: string, bid: CommercialBuyerBid) => {
    setFarmerGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            buyerBids: [bid, ...g.buyerBids],
          };
        }
        return g;
      })
    );
  };

  const handleSelectCropForListing = (crop: CropInfo) => {
    setSelectedCropForListing(crop);
    setIsSellModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900 selection:bg-emerald-200">
      {/* Strict 3-zone Header with sub-utility bar */}
      <Header
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenSellModal={() => {
          setSelectedCropForListing(CROP_DATA[0]);
          setIsSellModalOpen(true);
        }}
        onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Banner with landscape view and 4-column metric strip */}
        <HeroBanner
          userRole={userRole}
          onOpenSellModal={() => {
            setSelectedCropForListing(CROP_DATA[0]);
            setIsSellModalOpen(true);
          }}
          onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
        />

        {/* Section 1: Transparent Daily Mandi Board & Fair Price Calculator */}
        <MandiPriceBoard onSelectCropForListing={handleSelectCropForListing} />

        {/* Section 2: Smallholder Collective Produce Pools */}
        <ProducePools
          pools={pools}
          userRole={userRole}
          onJoinPool={handleJoinPool}
          onBuyerFundPool={handleFundPool}
        />

        {/* Section 3: Farmer Producer Clusters for High-Value Commercial Batches */}
        <FarmerCollectives
          groups={farmerGroups}
          userRole={userRole}
          onJoinGroup={handleJoinFarmerGroup}
          onCreateGroup={handleCreateFarmerGroup}
          onPlaceBuyerBid={handlePlaceBuyerBidOnGroup}
        />

        {/* Section 4: Shared Village Hill Transport & Logistics */}
        <LogisticsBoard routes={routes} onBookCrates={handleBookCrates} />

        {/* Section 4: Institutional Buyer & Processor Portal */}
        <BuyerMarketplace
          pools={pools}
          farmerListings={farmerListings}
          buyerInquiries={buyerInquiries}
          onPostInquiry={handlePostInquiry}
          onFundPool={handleFundPool}
        />

        {/* Section 5: Field Impact, Proof, and 4-Step Farmer Guide */}
        <FaqAndImpact />
      </main>

      {/* Quiet, clean Footer */}
      <Footer />

      {/* Low-Literacy & Voice-Friendly Sell Modal */}
      <FarmerListingModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onAddListing={handleAddFarmerListing}
        initialCrop={selectedCropForListing}
      />

      {/* Interactive AI Voice Messenger (Codes farmer local voice to text & decodes answer in language) */}
      <VoiceMessenger
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onNavigateToSection={(sectionId) => {
          const el = document.getElementById(sectionId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenSellModal={() => {
          setSelectedCropForListing(CROP_DATA[0]);
          setIsSellModalOpen(true);
        }}
      />

      {/* Floating Quick Voice Messenger Launcher (Rural WhatsApp-style trigger) */}
      <aside aria-label="Quick voice messenger launcher" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="group flex items-center gap-3 bg-emerald-800 hover:bg-emerald-700 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl border-2 border-emerald-600 transition-all hover:scale-105 active:scale-95"
          title="Open AI Voice Messenger"
        >
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-400"></span>
          </span>

          <div className="flex flex-col text-left">
            <span className="text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>🎙️ Voice Messenger</span>
              <span className="text-[10px] bg-emerald-950/80 px-1.5 py-0.5 rounded text-amber-300">AI</span>
            </span>
            <span className="text-[10px] text-emerald-200">
              हिन्दी · অসমীয়া · মৈতৈলোন্ · English
            </span>
          </div>
        </button>
      </aside>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
