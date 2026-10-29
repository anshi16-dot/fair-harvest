export type Language = 'en' | 'as' | 'hi' | 'bn' | 'kha' | 'lus' | 'mni';

export type UserRole = 'farmer' | 'buyer';

export type ProduceCategory = 'kiwi' | 'orange' | 'cardamom' | 'ginger' | 'turmeric' | 'chilli';

export interface CropInfo {
  id: string;
  name: string;
  localNames: Record<Language, string>;
  category: ProduceCategory;
  origin: string;
  state: string;
  giTagged: boolean;
  organicCertified: boolean;
  image: string;
  middlemanPrice: number; // ₹ per kg
  fairHarvestPrice: number; // ₹ per kg
  metroMandiPrice: number; // ₹ per kg (Delhi/Kolkata wholesale)
  unit: string;
  harvestSeason: string;
  shelfLifeDays: number;
}

export interface ProducePool {
  id: string;
  cropId: string;
  cropName: string;
  originHub: string;
  state: string;
  targetQuantityKg: number;
  currentQuantityKg: number;
  minContributionKg: number;
  farmersCount: number;
  poolClosingDate: string;
  dispatchDate: string;
  pricePerKg: number;
  buyerOfferReceived?: {
    buyerName: string;
    buyerType: 'Hotel Chain' | 'Processor' | 'Retail Exporter' | 'Supermarket';
    offeredPricePerKg: number;
    status: 'pending' | 'accepted' | 'escrow_funded';
  };
  destinationMandi: string;
  status: 'open' | 'target_reached' | 'in_transit' | 'completed';
}

export interface TransportRoute {
  id: string;
  routeName: string;
  originVillage: string;
  transitHub: string;
  destinationMandi: string;
  vehicleType: string;
  frequency: string;
  nextDeparture: string;
  totalCapacityCrates: number;
  bookedCrates: number;
  costPerCrate: number; // ₹ per crate (~20kg)
  driverContact: string;
  consolidationHub: string;
}

export interface FarmerListing {
  id: string;
  farmerName: string;
  village: string;
  crop: string;
  quantityKg: number;
  grade: 'A' | 'B' | 'Export';
  expectedPrice: number;
  listedDate: string;
  pooled: boolean;
  status: 'available' | 'reserved' | 'sold';
}

export interface BuyerInquiry {
  id: string;
  buyerName: string;
  company: string;
  cropNeeded: string;
  quantityNeededKg: number;
  offeredPricePerKg: number;
  destinationCity: string;
  urgency: 'Immediate' | 'Within 7 days' | 'Seasonal Contract';
}

export interface FarmerGroupMember {
  id: string;
  name: string;
  village: string;
  pledgedQuantityKg: number;
  joinedDate: string;
  isLeader?: boolean;
}

export interface CommercialBuyerBid {
  id: string;
  buyerName: string;
  company: string;
  bidPricePerKg: number;
  escrowReady: boolean;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface FarmerBatchGroup {
  id: string;
  groupName: string;
  cropCategory: ProduceCategory;
  cropName: string;
  clusterValley: string;
  state: string;
  leaderName: string;
  leaderPhone: string;
  targetCommercialVolumeKg: number;
  currentAggregatedKg: number;
  targetPricePerKg: number;
  qualityStandard: string;
  aggregationHub: string;
  targetBuyerSegment: 'Premium Supermarkets' | 'Exporters' | 'Fruit Pulp Processors' | 'Hospitality Chains';
  status: 'recruiting' | 'batch_locked' | 'contract_awarded' | 'dispatched';
  members: FarmerGroupMember[];
  buyerBids: CommercialBuyerBid[];
  discussionNotes?: {
    id: string;
    senderName: string;
    village: string;
    messageText: string;
    isVoiceNote?: boolean;
    timestamp: string;
  }[];
}

