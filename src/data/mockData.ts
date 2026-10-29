import { CropInfo, ProducePool, TransportRoute, BuyerInquiry, FarmerListing, FarmerBatchGroup } from '../types';

export const CROP_DATA: CropInfo[] = [
  {
    id: 'crop-kiwi',
    name: 'Ziro Valley Organic Kiwi',
    localNames: {
      en: 'Ziro Valley Kiwi',
      as: 'জিৰো উপত্যকাৰ কিৱি',
      hi: 'ज़ीरो वैली ऑर्गेनिक कीवी',
      bn: 'জিরো ভ্যালির কিউই ফল',
      kha: 'Ki Soh Kiwi Ziro',
      lus: 'Ziro Kiwi tha ber',
      mni: 'জিরো ভ্যালিগী কিৱি'
    },
    category: 'kiwi',
    origin: 'Ziro, Lower Subansiri',
    state: 'Arunachal Pradesh',
    giTagged: true,
    organicCertified: true,
    image: '/src/assets/images/crop_ziro_kiwi_1793216327303.jpg',
    middlemanPrice: 75,
    fairHarvestPrice: 165,
    metroMandiPrice: 240,
    unit: 'kg',
    harvestSeason: 'Oct - Jan (Peak Season)',
    shelfLifeDays: 28,
  },
  {
    id: 'crop-orange',
    name: 'Dambuk Mandarin Orange',
    localNames: {
      en: 'Dambuk Mandarin Orange',
      as: 'ডামবুকৰ কমোলা টেঙা',
      hi: 'दाम्बुक रसीला संतरा',
      bn: 'দাম্বুক কমলার লেবু',
      kha: 'Soh Niamtra Dambuk',
      lus: 'Dambuk Serthlum',
      mni: 'দাম্বুক কমোলা'
    },
    category: 'orange',
    origin: 'Dambuk, Lower Dibang Valley',
    state: 'Arunachal Pradesh',
    giTagged: true,
    organicCertified: true,
    image: '/src/assets/images/crop_dambuk_oranges_1793216328176.jpg',
    middlemanPrice: 35,
    fairHarvestPrice: 85,
    metroMandiPrice: 140,
    unit: 'kg',
    harvestSeason: 'Nov - Feb (Active)',
    shelfLifeDays: 20,
  },
  {
    id: 'crop-cardamom',
    name: 'Sikkim Large Cardamom (Badi Elaichi)',
    localNames: {
      en: 'Sikkim Large Cardamom',
      as: 'ছিকিমৰ বৰ ইলাচি',
      hi: 'सिक्किम बड़ी इलायची',
      bn: 'সিকিম বড় এলাচ',
      kha: 'Elaichi Heh Sikkim',
      lus: 'Sikkim Thinghmui Lian',
      mni: 'সিক্কিমগী ইলাইচি'
    },
    category: 'cardamom',
    origin: 'Mangan & Gyalshing',
    state: 'Sikkim',
    giTagged: true,
    organicCertified: true,
    image: '/src/assets/images/crop_sikkim_cardamom_1793216328537.jpg',
    middlemanPrice: 750,
    fairHarvestPrice: 1380,
    metroMandiPrice: 1850,
    unit: 'kg',
    harvestSeason: 'Aug - Dec (Cured)',
    shelfLifeDays: 360,
  },
  {
    id: 'crop-ginger',
    name: 'Karbi Anglong High-Oil Ginger',
    localNames: {
      en: 'Karbi Anglong Ginger',
      as: 'কাৰ্বি আংলংৰ আদা',
      hi: 'कार्बी आंगलोंग अदरक',
      bn: 'কার্বি আংলং আদা',
      kha: 'Sying Karbi Anglong',
      lus: 'Karbi Anglong Sawhthing',
      mni: 'কার্বি আংলোং শিং'
    },
    category: 'ginger',
    origin: 'Diphu & Bokajan',
    state: 'Assam',
    giTagged: true,
    organicCertified: true,
    image: '/src/assets/images/crop_organic_ginger_1793216328806.jpg',
    middlemanPrice: 28,
    fairHarvestPrice: 68,
    metroMandiPrice: 115,
    unit: 'kg',
    harvestSeason: 'Year-round (Peak Dec-Mar)',
    shelfLifeDays: 45,
  }
];

export const INITIAL_POOLS: ProducePool[] = [
  {
    id: 'pool-ziro-01',
    cropId: 'crop-kiwi',
    cropName: 'Ziro Valley Kiwi Export Collective',
    originHub: 'Hapoli Village Center, Ziro',
    state: 'Arunachal Pradesh',
    targetQuantityKg: 3500,
    currentQuantityKg: 2650,
    minContributionKg: 25,
    farmersCount: 18,
    poolClosingDate: 'In 3 days',
    dispatchDate: 'Nov 02, 2026',
    pricePerKg: 165,
    buyerOfferReceived: {
      buyerName: 'Nature Basket & Gourmet Grocers',
      buyerType: 'Supermarket',
      offeredPricePerKg: 170,
      status: 'escrow_funded'
    },
    destinationMandi: 'Guwahati Cold Hub → Delhi Azadpur',
    status: 'open'
  },
  {
    id: 'pool-dambuk-02',
    cropId: 'crop-orange',
    cropName: 'Dambuk Sweet Orange Processing Batch',
    originHub: 'Dambuk Orange Festival Hub',
    state: 'Arunachal Pradesh',
    targetQuantityKg: 6000,
    currentQuantityKg: 4900,
    minContributionKg: 50,
    farmersCount: 32,
    poolClosingDate: 'In 2 days',
    dispatchDate: 'Nov 04, 2026',
    pricePerKg: 85,
    buyerOfferReceived: {
      buyerName: 'Brahmaputra Agro Processing Ltd',
      buyerType: 'Processor',
      offeredPricePerKg: 88,
      status: 'accepted'
    },
    destinationMandi: 'Dibrugarh → Guwahati Terminal',
    status: 'open'
  },
  {
    id: 'pool-sikkim-03',
    cropId: 'crop-cardamom',
    cropName: 'Sikkim Organic Badi Elaichi Premium Lot',
    originHub: 'Mangan Farmer Producer Center',
    state: 'Sikkim',
    targetQuantityKg: 1200,
    currentQuantityKg: 1200,
    minContributionKg: 10,
    farmersCount: 22,
    poolClosingDate: 'Closed (Full)',
    dispatchDate: 'Tomorrow Morning',
    pricePerKg: 1380,
    buyerOfferReceived: {
      buyerName: 'SpiceCraft India Exports',
      buyerType: 'Retail Exporter',
      offeredPricePerKg: 1420,
      status: 'escrow_funded'
    },
    destinationMandi: 'Siliguri Terminal → Mumbai Port',
    status: 'target_reached'
  },
  {
    id: 'pool-karbi-04',
    cropId: 'crop-ginger',
    cropName: 'Karbi Anglong Fresh Ginger Batch A',
    originHub: 'Diphu APMC Direct Yard',
    state: 'Assam',
    targetQuantityKg: 5000,
    currentQuantityKg: 3400,
    minContributionKg: 50,
    farmersCount: 19,
    poolClosingDate: 'In 4 days',
    dispatchDate: 'Nov 06, 2026',
    pricePerKg: 68,
    buyerOfferReceived: {
      buyerName: 'Taj Vivanta & Ginger Hotels (Procurement)',
      buyerType: 'Hotel Chain',
      offeredPricePerKg: 72,
      status: 'accepted'
    },
    destinationMandi: 'Guwahati Wholesale Mandi',
    status: 'open'
  }
];

export const INITIAL_ROUTES: TransportRoute[] = [
  {
    id: 'route-ziro-guw',
    routeName: 'Ziro Valley → Guwahati Express Reefer',
    originVillage: 'Ziro (Hapoli Hub)',
    transitHub: 'Naharlagun Railway / Bus Yard',
    destinationMandi: 'Guwahati Wholesale Agriculture Center',
    vehicleType: 'Refrigerated Cold Truck (Tata 407)',
    frequency: 'Tuesdays & Fridays',
    nextDeparture: 'Tomorrow, 5:30 AM',
    totalCapacityCrates: 120,
    bookedCrates: 94,
    costPerCrate: 75, // ₹75 per 20kg crate (vs ₹7000 private vehicle)
    driverContact: '+91 94360 88219 (Tadar Balo)',
    consolidationHub: 'Ziro Kiwi Growers Society Yard'
  },
  {
    id: 'route-dambuk-pasighat',
    routeName: 'Dambuk → Pasighat → Dibrugarh Trunk Line',
    originVillage: 'Dambuk Valley Center',
    transitHub: 'Pasighat Agro Terminal',
    destinationMandi: 'Dibrugarh Rail Logistics Yard',
    vehicleType: 'Bolero Camper 4x4 (Hill Terrain)',
    frequency: 'Mon, Wed, Sat',
    nextDeparture: 'Thursday, 6:00 AM',
    totalCapacityCrates: 80,
    bookedCrates: 62,
    costPerCrate: 60,
    driverContact: '+91 98540 12763 (Oken Tayeng)',
    consolidationHub: 'Dambuk Village Council Depot'
  },
  {
    id: 'route-mangan-siliguri',
    routeName: 'North Sikkim → Siliguri Spice Link',
    originVillage: 'Mangan Bazaar Hub',
    transitHub: 'Gangtok 32nd Mile',
    destinationMandi: 'Siliguri Regulated Market',
    vehicleType: 'Eicher 14ft Covered Truck',
    frequency: 'Every 2 Days',
    nextDeparture: 'Friday, 4:00 AM',
    totalCapacityCrates: 100,
    bookedCrates: 88,
    costPerCrate: 90,
    driverContact: '+91 97330 45190 (Karma Bhutia)',
    consolidationHub: 'Mangan Organic Cooperative Office'
  },
  {
    id: 'route-diphu-guwahati',
    routeName: 'Karbi Anglong → Guwahati Direct Agro Shuttle',
    originVillage: 'Diphu APMC Yard',
    transitHub: 'Nagaon Bypass',
    destinationMandi: 'Guwahati Pamohi Fruit Yard',
    vehicleType: 'Ashok Leyland Dost',
    frequency: 'Daily (Mon-Sat)',
    nextDeparture: 'Tomorrow, 7:00 AM',
    totalCapacityCrates: 70,
    bookedCrates: 45,
    costPerCrate: 45,
    driverContact: '+91 94351 77302 (Ronghang Teron)',
    consolidationHub: 'Diphu Ginger Farmers Shed'
  }
];

export const INITIAL_BUYER_INQUIRIES: BuyerInquiry[] = [
  {
    id: 'inq-01',
    buyerName: 'Vivek Sharma (Taj Vivanta NE Group)',
    company: 'Taj Vivanta Hospitality',
    cropNeeded: 'Dambuk Mandarin Orange & Ziro Kiwi',
    quantityNeededKg: 2500,
    offeredPricePerKg: 172,
    destinationCity: 'Guwahati & Shillong',
    urgency: 'Within 7 days'
  },
  {
    id: 'inq-02',
    buyerName: 'Anita Singhal (Organic India Procurement)',
    company: 'Organic India & Herbal Tea Labs',
    cropNeeded: 'Sikkim Large Cardamom & High-Curcumin Turmeric',
    quantityNeededKg: 1500,
    offeredPricePerKg: 1400,
    destinationCity: 'Delhi NCR Hub',
    urgency: 'Seasonal Contract'
  },
  {
    id: 'inq-03',
    buyerName: 'Debabrata Das (Eastern Spices & Oils)',
    company: 'Eastern Flavors processing',
    cropNeeded: 'Karbi Anglong Ginger (High oleoresin)',
    quantityNeededKg: 4000,
    offeredPricePerKg: 70,
    destinationCity: 'Kolkata Wholesale Hub',
    urgency: 'Immediate'
  }
];

export const RECENT_FARMER_LISTINGS: FarmerListing[] = [
  {
    id: 'list-01',
    farmerName: 'Tage Hinda',
    village: 'Hari Village, Ziro',
    crop: 'Ziro Organic Kiwi',
    quantityKg: 80,
    grade: 'Export',
    expectedPrice: 165,
    listedDate: 'Today, 9:20 AM',
    pooled: true,
    status: 'available'
  },
  {
    id: 'list-02',
    farmerName: 'Kaling Lego',
    village: 'Bomjir, Lower Dibang',
    crop: 'Dambuk Mandarin Orange',
    quantityKg: 150,
    grade: 'A',
    expectedPrice: 85,
    listedDate: 'Today, 8:45 AM',
    pooled: true,
    status: 'available'
  },
  {
    id: 'list-03',
    farmerName: 'Phurba Lepcha',
    village: 'Singhik, North Sikkim',
    crop: 'Sikkim Large Cardamom',
    quantityKg: 35,
    grade: 'Export',
    expectedPrice: 1380,
    listedDate: 'Yesterday',
    pooled: true,
    status: 'reserved'
  },
  {
    id: 'list-04',
    farmerName: 'Sarsing Tisso',
    village: 'Manja, Karbi Anglong',
    crop: 'Karbi Organic Ginger',
    quantityKg: 200,
    grade: 'A',
    expectedPrice: 68,
    listedDate: 'Yesterday',
    pooled: true,
    status: 'available'
  }
];

export const INITIAL_FARMER_GROUPS: FarmerBatchGroup[] = [
  {
    id: 'group-ziro-kiwi',
    groupName: 'Ziro Apatani Kiwi Export Cluster',
    cropCategory: 'kiwi',
    cropName: 'Ziro Valley Organic Kiwi (Allison & Hayward)',
    clusterValley: 'Ziro Plateau (Hari, Hong, Tajang)',
    state: 'Arunachal Pradesh',
    leaderName: 'Tage Hinda',
    leaderPhone: '+91 94360 88219',
    targetCommercialVolumeKg: 6000,
    currentAggregatedKg: 4650,
    targetPricePerKg: 175,
    qualityStandard: 'Grade A+ Export Quality (Size 70g+, Brix 14°+, Zero Chemical)',
    aggregationHub: 'Hapoli Central Cold Shed',
    targetBuyerSegment: 'Premium Supermarkets',
    status: 'recruiting',
    members: [
      { id: 'm-1', name: 'Tage Hinda (Lead)', village: 'Hari Village', pledgedQuantityKg: 500, joinedDate: '3 days ago', isLeader: true },
      { id: 'm-2', name: 'Hage Tado', village: 'Hong Village', pledgedQuantityKg: 400, joinedDate: '3 days ago' },
      { id: 'm-3', name: 'Koj Rinya', village: 'Tajang', pledgedQuantityKg: 650, joinedDate: '2 days ago' },
      { id: 'm-4', name: 'Bamin Laji', village: 'Hari Village', pledgedQuantityKg: 800, joinedDate: '2 days ago' },
      { id: 'm-5', name: 'Nani Rika', village: 'Old Ziro', pledgedQuantityKg: 950, joinedDate: 'Yesterday' },
      { id: 'm-6', name: 'Puna Tara', village: 'Siiro Village', pledgedQuantityKg: 1350, joinedDate: 'Today' },
    ],
    buyerBids: [
      {
        id: 'bid-01',
        buyerName: 'Nature’s Basket Export Cell',
        company: 'Nature Basket Gourmet',
        bidPricePerKg: 180,
        escrowReady: true,
        timestamp: 'Today, 11:30 AM',
        status: 'pending'
      },
      {
        id: 'bid-02',
        buyerName: 'FreshToHome Organics',
        company: 'FreshToHome Direct',
        bidPricePerKg: 172,
        escrowReady: true,
        timestamp: 'Yesterday',
        status: 'pending'
      }
    ],
    discussionNotes: [
      {
        id: 'note-1',
        senderName: 'Tage Hinda',
        village: 'Hari',
        messageText: 'We need 1,350 kg more to lock the 6-tonne export container to Mumbai port. Packing crates ready at Hapoli shed.',
        isVoiceNote: true,
        timestamp: '2h ago'
      },
      {
        id: 'note-2',
        senderName: 'Koj Rinya',
        village: 'Tajang',
        messageText: 'Harvesting tomorrow morning. Will bring 650 kg by noon.',
        timestamp: '1h ago'
      }
    ]
  },
  {
    id: 'group-dambuk-orange',
    groupName: 'Dambuk GI Mandarin Pulp Syndicate',
    cropCategory: 'orange',
    cropName: 'Dambuk Mandarin Wild Orange',
    clusterValley: 'Lower Dibang Foothills (Dambuk, Bomjir, Paglam)',
    state: 'Arunachal Pradesh',
    leaderName: 'Kaling Lego',
    leaderPhone: '+91 98540 12763',
    targetCommercialVolumeKg: 12000,
    currentAggregatedKg: 9400,
    targetPricePerKg: 90,
    qualityStandard: 'GI-Certified Mandarin (Juice content >45%, Thin Peel, Naturally Ripened)',
    aggregationHub: 'Dambuk Council Agro Terminal',
    targetBuyerSegment: 'Fruit Pulp Processors',
    status: 'recruiting',
    members: [
      { id: 'dm-1', name: 'Kaling Lego (Lead)', village: 'Bomjir', pledgedQuantityKg: 1200, joinedDate: '5 days ago', isLeader: true },
      { id: 'dm-2', name: 'Oken Tayeng', village: 'Dambuk', pledgedQuantityKg: 1800, joinedDate: '4 days ago' },
      { id: 'dm-3', name: 'Bomen Moyong', village: 'Paglam', pledgedQuantityKg: 2400, joinedDate: '3 days ago' },
      { id: 'dm-4', name: 'Yater Ratan', village: 'Bizari', pledgedQuantityKg: 2000, joinedDate: 'Yesterday' },
      { id: 'dm-5', name: 'Talem Pertin', village: 'Dambuk', pledgedQuantityKg: 2000, joinedDate: 'Today' },
    ],
    buyerBids: [
      {
        id: 'bid-dambuk-01',
        buyerName: 'Brahmaputra Agro Processing Ltd',
        company: 'Brahmaputra Foods',
        bidPricePerKg: 94,
        escrowReady: true,
        timestamp: 'Today, 9:15 AM',
        status: 'pending'
      }
    ],
    discussionNotes: [
      {
        id: 'dnote-1',
        senderName: 'Kaling Lego',
        village: 'Bomjir',
        messageText: 'Processor offered ₹94/kg (₹4 above our target). Let us vote to accept once 12 tonnes is pooled.',
        isVoiceNote: true,
        timestamp: '3h ago'
      }
    ]
  },
  {
    id: 'group-sikkim-cardamom',
    groupName: 'North Sikkim Badi Elaichi Export Guild',
    cropCategory: 'cardamom',
    cropName: 'Sikkim Large Cardamom (Smoky Cured Ramsai)',
    clusterValley: 'Mangan & Upper Teesta Valleys',
    state: 'Sikkim',
    leaderName: 'Phurba Lepcha',
    leaderPhone: '+91 97330 45190',
    targetCommercialVolumeKg: 3000,
    currentAggregatedKg: 2650,
    targetPricePerKg: 1450,
    qualityStandard: '100% Certified Organic (Badi Elaichi Bold Pods, Moisture <11%)',
    aggregationHub: 'Mangan Organic FPO Yard',
    targetBuyerSegment: 'Exporters',
    status: 'recruiting',
    members: [
      { id: 'sm-1', name: 'Phurba Lepcha (Lead)', village: 'Singhik', pledgedQuantityKg: 350, joinedDate: '6 days ago', isLeader: true },
      { id: 'sm-2', name: 'Karma Bhutia', village: 'Mangan', pledgedQuantityKg: 500, joinedDate: '4 days ago' },
      { id: 'sm-3', name: 'Tenzing Namgyal', village: 'Chungthang', pledgedQuantityKg: 700, joinedDate: '3 days ago' },
      { id: 'sm-4', name: 'Dawa Lepcha', village: 'Kabi', pledgedQuantityKg: 1100, joinedDate: 'Yesterday' },
    ],
    buyerBids: [
      {
        id: 'bid-sikkim-01',
        buyerName: 'SpiceCraft India Exports',
        company: 'SpiceCraft Worldwide',
        bidPricePerKg: 1480,
        escrowReady: true,
        timestamp: 'Today, 8:30 AM',
        status: 'pending'
      }
    ]
  },
  {
    id: 'group-karbi-ginger',
    groupName: 'Karbi Hills High-Oleoresin Ginger Guild',
    cropCategory: 'ginger',
    cropName: 'Karbi Anglong Fresh Ginger (Nadia Grade)',
    clusterValley: 'Diphu & Bokajan Agro Belt',
    state: 'Assam',
    leaderName: 'Sarsing Teron',
    leaderPhone: '+91 94351 77302',
    targetCommercialVolumeKg: 8000,
    currentAggregatedKg: 6200,
    targetPricePerKg: 74,
    qualityStandard: 'High Oleoresin Extract Grade (Clean Washed, Low Soil)',
    aggregationHub: 'Diphu APMC Direct Agro Yard',
    targetBuyerSegment: 'Hospitality Chains',
    status: 'recruiting',
    members: [
      { id: 'kg-1', name: 'Sarsing Teron (Lead)', village: 'Diphu', pledgedQuantityKg: 1200, joinedDate: '4 days ago', isLeader: true },
      { id: 'kg-2', name: 'Biren Tisso', village: 'Manja', pledgedQuantityKg: 1600, joinedDate: '3 days ago' },
      { id: 'kg-3', name: 'Longsing Rongpi', village: 'Bokajan', pledgedQuantityKg: 2000, joinedDate: '2 days ago' },
      { id: 'kg-4', name: 'Khorsing Bey', village: 'Howraghat', pledgedQuantityKg: 1400, joinedDate: 'Today' },
    ],
    buyerBids: [
      {
        id: 'bid-ginger-01',
        buyerName: 'Taj Vivanta & Ginger Hotels Central Kitchen',
        company: 'Taj Vivanta Hospitality',
        bidPricePerKg: 76,
        escrowReady: true,
        timestamp: 'Yesterday',
        status: 'pending'
      }
    ]
  }
];

