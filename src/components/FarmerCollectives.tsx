import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  MapPin,
  TrendingUp,
  Volume2,
  Plus,
  ArrowRight,
  CheckCircle2,
  Building2,
  MessageSquare,
  Award,
  Calendar,
  Sparkles,
  Phone,
  FileCheck
} from 'lucide-react';
import { FarmerBatchGroup, FarmerGroupMember, CommercialBuyerBid, UserRole, ProduceCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { CROP_DATA } from '../data/mockData';

interface FarmerCollectivesProps {
  groups: FarmerBatchGroup[];
  userRole: UserRole;
  onJoinGroup: (groupId: string, member: FarmerGroupMember) => void;
  onCreateGroup: (newGroup: FarmerBatchGroup) => void;
  onPlaceBuyerBid: (groupId: string, bid: CommercialBuyerBid) => void;
}

export const FarmerCollectives: React.FC<FarmerCollectivesProps> = ({
  groups,
  userRole,
  onJoinGroup,
  onCreateGroup,
  onPlaceBuyerBid,
}) => {
  const { t, speak, language } = useLanguage();

  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [selectedGroupForJoin, setSelectedGroupForJoin] = useState<FarmerBatchGroup | null>(null);
  const [selectedGroupForDiscussion, setSelectedGroupForDiscussion] = useState<FarmerBatchGroup | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isBuyerBidModalOpen, setIsBuyerBidModalOpen] = useState<boolean>(false);
  const [activeBidGroup, setActiveBidGroup] = useState<FarmerBatchGroup | null>(null);

  // Join Form State
  const [farmerName, setFarmerName] = useState<string>('');
  const [farmerVillage, setFarmerVillage] = useState<string>('');
  const [pledgeKg, setPledgeKg] = useState<number>(100);

  // Create Group Form State
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newCropCategory, setNewCropCategory] = useState<ProduceCategory>('kiwi');
  const [newClusterValley, setNewClusterValley] = useState<string>('Ziro Valley Foothills');
  const [newState, setNewState] = useState<string>('Arunachal Pradesh');
  const [newLeaderName, setNewLeaderName] = useState<string>('');
  const [newLeaderPhone, setNewLeaderPhone] = useState<string>('+91 ');
  const [newTargetVolumeKg, setNewTargetVolumeKg] = useState<number>(5000);
  const [newTargetPrice, setNewTargetPrice] = useState<number>(175);
  const [newQualityStandard, setNewQualityStandard] = useState<string>(
    'Grade A Export Quality, Zero Chemical, Brix > 13°'
  );
  const [newAggregationHub, setNewAggregationHub] = useState<string>('Village Council Community Shed');
  const [newTargetBuyerSegment, setNewTargetBuyerSegment] = useState<
    'Premium Supermarkets' | 'Exporters' | 'Fruit Pulp Processors' | 'Hospitality Chains'
  >('Premium Supermarkets');

  // Buyer Bid Form State
  const [bidBuyerName, setBidBuyerName] = useState<string>('');
  const [bidCompanyName, setBidCompanyName] = useState<string>('');
  const [bidPrice, setBidPrice] = useState<number>(180);

  // Group discussion message input
  const [discussionInput, setDiscussionInput] = useState<string>('');

  // Notification feedback
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const showAlert = (msg: string) => {
    setAlertMessage(msg);
    setTimeout(() => setAlertMessage(null), 5000);
  };

  const filteredGroups = groups.filter((g) => {
    if (selectedCropFilter === 'all') return true;
    return g.cropCategory === selectedCropFilter;
  });

  const handleSpeakGroup = (group: FarmerBatchGroup) => {
    const remainingKg = Math.max(0, group.targetCommercialVolumeKg - group.currentAggregatedKg);
    let speech = '';
    if (language === 'hi') {
      speech = `${group.groupName}: ${group.members.length} किसानों ने मिलकर ${group.currentAggregatedKg} किलो फसल जोड़ ली है। व्यावसायिक निर्यात बैच के लिए ${remainingKg} किलो शेष है। लक्ष्य भाव ₹${group.targetPricePerKg} प्रति किलो है।`;
    } else if (language === 'as') {
      speech = `${group.groupName}ত ${group.members.length} জন কৃষকে মিলি ${group.currentAggregatedKg} কেজি সংগ্ৰহ কৰিছে। আৰু ${remainingKg} কেজি যোগ হ’লে সম্পূৰ্ণ বেচ ৰপ্তানি হ’ব।`;
    } else if (language === 'mni') {
      speech = `${group.groupName}দা লৌমী ${group.members.length} না পুন্না ${group.currentAggregatedKg} কেজি খোমজিনখ্রে। অচুম্বা মমল কিলোদা ₹${group.targetPricePerKg} নি।`;
    } else {
      speech = `${group.groupName}: ${group.members.length} smallholders aggregated ${group.currentAggregatedKg} kilograms towards ${group.targetCommercialVolumeKg} kg commercial batch. Target price ₹${group.targetPricePerKg} per kilo.`;
    }
    speak(speech);
  };

  const handleConfirmJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupForJoin) return;

    const newMember: FarmerGroupMember = {
      id: `mem-${Date.now()}`,
      name: farmerName.trim() || 'Grower Partner',
      village: farmerVillage.trim() || selectedGroupForJoin.clusterValley.split('(')[0].trim(),
      pledgedQuantityKg: pledgeKg,
      joinedDate: 'Just now',
    };

    onJoinGroup(selectedGroupForJoin.id, newMember);
    showAlert(
      `Pledged ${pledgeKg} kg to ${selectedGroupForJoin.groupName}! You are now Member #${selectedGroupForJoin.members.length + 1}.`
    );
    setSelectedGroupForJoin(null);
    setFarmerName('');
    setFarmerVillage('');
    setPledgeKg(100);
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const group: FarmerBatchGroup = {
      id: `group-${Date.now()}`,
      groupName: newGroupName.trim() || 'Northeast Farmer Collective',
      cropCategory: newCropCategory,
      cropName:
        CROP_DATA.find((c) => c.category === newCropCategory)?.name || 'High Value Northeast Crop',
      clusterValley: newClusterValley.trim() || 'Central Valley Hub',
      state: newState,
      leaderName: newLeaderName.trim() || 'Farmer Lead',
      leaderPhone: newLeaderPhone.trim() || '+91 94360 00000',
      targetCommercialVolumeKg: newTargetVolumeKg,
      currentAggregatedKg: 600, // founding member pledge
      targetPricePerKg: newTargetPrice,
      qualityStandard: newQualityStandard.trim(),
      aggregationHub: newAggregationHub.trim(),
      targetBuyerSegment: newTargetBuyerSegment,
      status: 'recruiting',
      members: [
        {
          id: `lead-${Date.now()}`,
          name: `${newLeaderName.trim() || 'Founder'} (Lead)`,
          village: newClusterValley.split(' ')[0],
          pledgedQuantityKg: 600,
          joinedDate: 'Today',
          isLeader: true,
        },
      ],
      buyerBids: [],
      discussionNotes: [
        {
          id: `msg-${Date.now()}`,
          senderName: newLeaderName.trim() || 'Founder Lead',
          village: newClusterValley.split(' ')[0],
          messageText: `Welcome to our farmer collective! We are aggregating ${newTargetVolumeKg} kg to negotiate directly with ${newTargetBuyerSegment}.`,
          timestamp: 'Just now',
        },
      ],
    };

    onCreateGroup(group);
    setIsCreateModalOpen(false);
    showAlert(`Farmer Collective "${group.groupName}" successfully formed! Local growers can now pledge produce.`);
  };

  const handleBuyerBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBidGroup) return;

    const bid: CommercialBuyerBid = {
      id: `bid-${Date.now()}`,
      buyerName: bidBuyerName.trim() || 'Procurement Executive',
      company: bidCompanyName.trim() || 'Verified Institutional Buyer',
      bidPricePerKg: bidPrice,
      escrowReady: true,
      timestamp: 'Just now',
      status: 'pending',
    };

    onPlaceBuyerBid(activeBidGroup.id, bid);
    setIsBuyerBidModalOpen(false);
    showAlert(`Commercial Bid of ₹${bidPrice}/kg submitted for ${activeBidGroup.groupName}. Group members notified!`);
  };

  return (
    <section id="farmer-collectives" className="py-12 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Smallholder Collective Action · FPG Clusters</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Farmer Producer Clusters for High-Value Batches
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-3xl">
              Smallholders with similar crop interests unite to aggregate 5–15 Metric Tonne commercial lots.
              Bypass middlemen, demand export-grade price premiums, and attract direct contracts from hospitality chains,
              fruit processors, and organic exporters.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {userRole === 'farmer' ? (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Form New Farmer Collective</span>
              </button>
            ) : (
              <span className="text-xs text-stone-600 bg-stone-100 border border-stone-200 px-3 py-2 rounded-lg font-medium">
                Institutional Buyer Tender Mode Active
              </span>
            )}
          </div>
        </div>

        {/* Success Alert Banner */}
        {alertMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-sm font-medium">{alertMessage}</div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          <span className="text-xs text-stone-500 font-medium whitespace-nowrap">Cluster Crop:</span>
          {[
            { id: 'all', label: 'All High-Value Batches' },
            { id: 'kiwi', label: '🥝 Ziro Kiwi Clusters' },
            { id: 'orange', label: '🍊 Dambuk Orange Syndicates' },
            { id: 'cardamom', label: '🌿 Sikkim Badi Elaichi' },
            { id: 'ginger', label: '🥔 Karbi Anglong Ginger' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCropFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCropFilter === cat.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Collectives Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGroups.map((group) => {
            const pctAggregated = Math.min(
              100,
              Math.round((group.currentAggregatedKg / group.targetCommercialVolumeKg) * 100)
            );
            const remainingKg = Math.max(0, group.targetCommercialVolumeKg - group.currentAggregatedKg);
            const topBid = group.buyerBids?.[0];

            return (
              <div
                key={group.id}
                className="bg-stone-50/60 rounded-2xl border border-stone-200 p-6 flex flex-col justify-between hover:border-emerald-700/60 transition-all shadow-xs"
              >
                <div>
                  {/* Cluster Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-semibold text-stone-800">{group.clusterValley}</span>
                        <span>· {group.state}</span>
                      </div>
                      <h3 className="text-lg font-bold text-stone-900 leading-snug">
                        {group.groupName}
                      </h3>
                      <div className="text-xs text-emerald-800 font-medium mt-0.5">
                        Target Produce: {group.cropName}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSpeakGroup(group)}
                      className="p-2 rounded-full bg-white border border-stone-200 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 transition-colors shadow-xs"
                      title="Audio overview of this collective"
                    >
                      <Volume2 className="w-4 h-4 text-emerald-700" />
                    </button>
                  </div>

                  {/* Aggregation Progress Bar */}
                  <div className="mb-4 bg-white p-4 rounded-xl border border-stone-200">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-stone-600">
                        Commercial Batch Progress: <strong className="text-stone-900 font-mono">{pctAggregated}%</strong>
                      </span>
                      <span className="text-stone-800 font-mono font-bold">
                        {group.currentAggregatedKg.toLocaleString()} / {group.targetCommercialVolumeKg.toLocaleString()} kg
                      </span>
                    </div>

                    <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                      <div
                        className={`h-full transition-all duration-500 ${
                          pctAggregated >= 100 ? 'bg-emerald-600' : 'bg-emerald-700'
                        }`}
                        style={{ width: `${pctAggregated}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs mt-2 text-stone-600">
                      <span className="flex items-center gap-1 font-medium text-stone-800">
                        <Users className="w-3.5 h-3.5 text-emerald-700" />
                        <span><strong>{group.members.length}</strong> smallholder farmers joined</span>
                      </span>
                      <span>
                        {remainingKg > 0 ? (
                          <span className="text-amber-800 font-semibold font-mono">
                            {remainingKg.toLocaleString()} kg needed to lock lot
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-bold">Commercial Lot Filled</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Commercial Terms & Standards */}
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div className="p-3 bg-white rounded-lg border border-stone-200">
                      <div className="text-stone-500 text-[11px]">Group Negotiated Price</div>
                      <div className="text-base font-bold text-emerald-800 font-mono mt-0.5">
                        ₹{group.targetPricePerKg} <span className="text-xs font-normal text-stone-500">/kg</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                        Direct to Bank · No tout commission
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-stone-200">
                      <div className="text-stone-500 text-[11px]">Target Buyer Segment</div>
                      <div className="font-bold text-stone-900 mt-0.5">{group.targetBuyerSegment}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">
                        Hub: {group.aggregationHub.split(' ')[0]}
                      </div>
                    </div>
                  </div>

                  {/* Quality Standard */}
                  <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200 text-xs text-emerald-950 mb-4 flex items-start gap-2">
                    <Award className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong>Batch Standard:</strong> {group.qualityStandard}
                    </div>
                  </div>

                  {/* Active Institutional Buyer Bid Section */}
                  {topBid && (
                    <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-amber-950 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-amber-800" />
                          <span>Top Buyer Offer: {topBid.company}</span>
                        </span>
                        <span className="font-mono font-bold text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded text-[11px]">
                          ₹{topBid.bidPricePerKg}/kg
                        </span>
                      </div>
                      <div className="text-amber-800 text-[11px] flex items-center justify-between">
                        <span>{topBid.buyerName} ({topBid.timestamp})</span>
                        <span className="font-medium text-emerald-800">✓ 100% Escrow Deposited</span>
                      </div>
                    </div>
                  )}

                  {/* Member Roster Preview */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-stone-700 mb-2 flex items-center justify-between">
                      <span>Pledged Growers Roster ({group.members.length}):</span>
                      <button
                        onClick={() => setSelectedGroupForDiscussion(group)}
                        className="text-emerald-800 hover:text-emerald-900 text-xs font-medium flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Cluster Chat ({group.discussionNotes?.length || 0})</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {group.members.slice(0, 4).map((m) => (
                        <span
                          key={m.id}
                          className="px-2.5 py-1 bg-white border border-stone-200 rounded-md text-[11px] text-stone-700 flex items-center gap-1"
                        >
                          <span className="font-semibold">{m.name}</span>
                          <span className="text-stone-400">·</span>
                          <span className="font-mono text-emerald-800 font-bold">{m.pledgedQuantityKg}kg</span>
                        </span>
                      ))}
                      {group.members.length > 4 && (
                        <span className="px-2 py-1 bg-stone-200/80 rounded-md text-[11px] text-stone-600 font-medium">
                          +{group.members.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions based on Role */}
                <div className="pt-4 border-t border-stone-200 flex items-center gap-3">
                  {userRole === 'farmer' ? (
                    <>
                      <button
                        onClick={() => {
                          setSelectedGroupForJoin(group);
                          setPledgeKg(80);
                        }}
                        className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Pledge Harvest to Group</span>
                      </button>

                      <button
                        onClick={() => setSelectedGroupForDiscussion(group)}
                        className="px-3.5 py-2.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                        title="Open group discussion & coordination"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                        <span>Coordinate</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveBidGroup(group);
                        setBidPrice(group.targetPricePerKg + 2);
                        setIsBuyerBidModalOpen(true);
                      }}
                      className="w-full py-2.5 bg-stone-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Building2 className="w-4 h-4 text-amber-400" />
                      <span>Submit Commercial Tender Bid (Full Batch)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Pledge Harvest to Group */}
      {selectedGroupForJoin && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              Join {selectedGroupForJoin.groupName}
            </h3>
            <p className="text-xs text-stone-600 mb-4">
              Aggregate your harvest with neighbor farmers to fulfill commercial orders for {selectedGroupForJoin.targetBuyerSegment}.
            </p>

            <form onSubmit={handleConfirmJoin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Koj Rinya"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-700"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase mb-1">Village / Orchard Location</label>
                <input
                  type="text"
                  placeholder="e.g. Tajang Village, Ziro"
                  value={farmerVillage}
                  onChange={(e) => setFarmerVillage(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-700"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase mb-1">
                  Pledged Quantity (kg)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="25"
                    max="5000"
                    value={pledgeKg}
                    onChange={(e) => setPledgeKg(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono font-bold text-base text-stone-900 focus:ring-1 focus:ring-emerald-700"
                    required
                  />
                  <span className="font-semibold text-stone-600 text-sm">kg</span>
                </div>
                <div className="text-[11px] text-stone-500 mt-1">
                  (~{Math.ceil(pledgeKg / 20)} standard 20kg crates)
                </div>
              </div>

              {/* Price Preview */}
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between text-xs text-emerald-900">
                  <span>Guaranteed Cluster Payout:</span>
                  <span className="font-mono font-bold text-base text-emerald-950">
                    ₹{(pledgeKg * selectedGroupForJoin.targetPricePerKg).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">
                  Collection Hub: {selectedGroupForJoin.aggregationHub}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedGroupForJoin(null)}
                  className="px-4 py-2 border border-stone-300 rounded-lg font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold shadow-xs"
                >
                  Confirm Group Pledge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Form New Farmer Batch Collective */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8">
            <h3 className="text-xl font-bold text-stone-900 mb-1">
              Form a Farmer Producer Cluster (FPG)
            </h3>
            <p className="text-xs text-stone-600 mb-5">
              Unite with neighbor farmers in your valley to aggregate commercial lots (2,000–20,000 kg) and sell directly at premium rates.
            </p>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 uppercase mb-1">Collective Group Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ziro Organic Kiwi Producers Guild"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-700"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 uppercase mb-1">Crop Type</label>
                  <select
                    value={newCropCategory}
                    onChange={(e) => setNewCropCategory(e.target.value as ProduceCategory)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-900 focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="kiwi">Ziro Kiwi</option>
                    <option value="orange">Dambuk Mandarin Orange</option>
                    <option value="cardamom">Sikkim Large Cardamom</option>
                    <option value="ginger">Karbi Anglong Ginger</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 uppercase mb-1">State</label>
                  <select
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-900 focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Assam">Assam</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase mb-1">Cluster Valley &amp; Villages</label>
                <input
                  type="text"
                  placeholder="e.g. Ziro Plateau (Hari, Hong, Tajang)"
                  value={newClusterValley}
                  onChange={(e) => setNewClusterValley(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900 focus:ring-1 focus:ring-emerald-700"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 uppercase mb-1">
                    Target Lot Volume (kg)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    max="50000"
                    step="500"
                    value={newTargetVolumeKg}
                    onChange={(e) => setNewTargetVolumeKg(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono font-bold text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 uppercase mb-1">
                    Target Price (₹/kg)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="3000"
                    value={newTargetPrice}
                    onChange={(e) => setNewTargetPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono font-bold text-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase mb-1">Quality &amp; Grading Standard</label>
                <input
                  type="text"
                  placeholder="e.g. Grade A+ Export Quality (Size >70g, Brix >14°)"
                  value={newQualityStandard}
                  onChange={(e) => setNewQualityStandard(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 uppercase mb-1">Founder / Lead Name</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={newLeaderName}
                    onChange={(e) => setNewLeaderName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 94360 XXXXX"
                    value={newLeaderPhone}
                    onChange={(e) => setNewLeaderPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase mb-1">Village Aggregation Shed / Hub</label>
                <input
                  type="text"
                  placeholder="e.g. Hapoli Cold Storage Yard"
                  value={newAggregationHub}
                  onChange={(e) => setNewAggregationHub(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold shadow-xs"
                >
                  Launch Farmer Collective
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Group Coordination & Voice Notes */}
      {selectedGroupForDiscussion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 flex flex-col max-h-[85vh]">
            <div className="pb-3 border-b border-stone-200 flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  {selectedGroupForDiscussion.groupName}
                </h3>
                <div className="text-xs text-stone-500">
                  Grower Coordination Board · {selectedGroupForDiscussion.members.length} members
                </div>
              </div>
              <button
                onClick={() => setSelectedGroupForDiscussion(null)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold p-1"
              >
                &times;
              </button>
            </div>

            {/* Chat Thread */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 text-xs">
              {selectedGroupForDiscussion.discussionNotes?.map((note) => (
                <div key={note.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                    <span className="font-bold text-stone-800">{note.senderName} ({note.village})</span>
                    <span>{note.timestamp}</span>
                  </div>
                  <p className="text-stone-700">{note.messageText}</p>
                </div>
              ))}
            </div>

            {/* Send coordination message */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!discussionInput.trim()) return;
                const note = {
                  id: `note-${Date.now()}`,
                  senderName: 'You (Farmer)',
                  village: 'Local Hub',
                  messageText: discussionInput.trim(),
                  timestamp: 'Just now',
                };
                selectedGroupForDiscussion.discussionNotes = [
                  ...(selectedGroupForDiscussion.discussionNotes || []),
                  note,
                ];
                setDiscussionInput('');
              }}
              className="pt-3 border-t border-stone-200 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Message cluster farmers (e.g. Bringing 10 crates tomorrow)..."
                value={discussionInput}
                onChange={(e) => setDiscussionInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-xs text-stone-900 focus:ring-1 focus:ring-emerald-700"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Buyer Place Commercial Tender Bid */}
      {isBuyerBidModalOpen && activeBidGroup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              Submit Commercial Tender Bid
            </h3>
            <p className="text-xs text-stone-600 mb-4">
              Contract directly for the aggregated batch of <strong>{activeBidGroup.groupName}</strong> ({activeBidGroup.currentAggregatedKg.toLocaleString()} kg available).
            </p>

            <form onSubmit={handleBuyerBidSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 uppercase mb-1">Company / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Radisson Blu / Nature's Basket"
                  value={bidCompanyName}
                  onChange={(e) => setBidCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase mb-1">Procurement Officer</label>
                <input
                  type="text"
                  placeholder="e.g. Sunita Rao"
                  value={bidBuyerName}
                  onChange={(e) => setBidBuyerName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 uppercase mb-1">
                  Offered Price (₹/kg)
                </label>
                <input
                  type="number"
                  min="30"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono font-bold text-base text-emerald-800"
                  required
                />
                <div className="text-[11px] text-stone-500 mt-1">
                  Group target is ₹{activeBidGroup.targetPricePerKg}/kg. Bids at or above target receive priority lock.
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-950 text-xs">
                <strong>Escrow Guarantee:</strong> Once the group lead accepts, payment is held in escrow and released directly to farmers upon hub delivery.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBuyerBidModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-emerald-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  Submit Commercial Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
