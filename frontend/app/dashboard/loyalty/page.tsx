"use client";

import { useState } from "react";
import { Star, Award, Gift, Sparkles, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function LoyaltyManagementPage() {
  const [pointsPerRupee, setPointsPerRupee] = useState("1");
  const [rupeesPerPointRedemption, setRupeesPerPointRedemption] = useState("0.25");
  const [stampGoal, setStampGoal] = useState("8");
  const [welcomeBonus, setWelcomeBonus] = useState("50");
  const [isStreakEnabled, setIsStreakEnabled] = useState(true);

  const [rewards, setRewards] = useState([
    { id: "rew-1", name: "Free Cappuccino", pointsCost: 150, category: "Beverage", active: true },
    { id: "rew-2", name: "Butter Croissant", pointsCost: 120, category: "Bakery", active: true },
    { id: "rew-3", name: "₹100 Off Bill", pointsCost: 400, category: "Discount", active: true },
    { id: "rew-4", name: "Upgrade to Large Size", pointsCost: 60, category: "Upgrade", active: true }
  ]);

  const [newReward, setNewReward] = useState({ name: "", pointsCost: "", category: "Beverage" });

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Loyalty & Earn rules updated successfully!");
  };

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReward.name || !newReward.pointsCost) return;
    setRewards([...rewards, {
      id: `rew-${Date.now()}`,
      name: newReward.name,
      pointsCost: parseInt(newReward.pointsCost),
      category: newReward.category,
      active: true
    }]);
    setNewReward({ name: "", pointsCost: "", category: "Beverage" });
    toast.success("New reward item added to customer catalog!");
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Loyalty & Rewards Engine</h2>
        <p className="text-slate-500">Configure spend-to-points rules, stamp cards, membership tiers, and redemption rewards.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Earn & Redemption Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" /> Points Earning Rules
            </CardTitle>
            <CardDescription>How customers accumulate loyalty currency on every visit.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveRules} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="earnRate">Points Earned per ₹100 Spent</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="earnRate" 
                    type="number" 
                    value={pointsPerRupee} 
                    onChange={e => setPointsPerRupee(e.target.value)} 
                    className="max-w-[120px]"
                  />
                  <span className="text-sm text-slate-500">Points = (e.g. 100 points per ₹100)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="redemptionRate">Redemption Value (₹ per 1 Point)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="redemptionRate" 
                    type="number" 
                    step="0.05" 
                    value={rupeesPerPointRedemption} 
                    onChange={e => setRupeesPerPointRedemption(e.target.value)} 
                    className="max-w-[120px]"
                  />
                  <span className="text-sm text-slate-500">₹ (e.g. 100 points = ₹25 discount)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="welcome">New Customer Welcome Bonus</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="welcome" 
                    type="number" 
                    value={welcomeBonus} 
                    onChange={e => setWelcomeBonus(e.target.value)} 
                    className="max-w-[120px]"
                  />
                  <span className="text-sm text-slate-500">Points awarded on first order</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <p className="text-sm font-medium">Daily Visit Streaks</p>
                  <p className="text-xs text-slate-500">Multiply points for 3+ consecutive weekly visits</p>
                </div>
                <Switch checked={isStreakEnabled} onCheckedChange={setIsStreakEnabled} />
              </div>

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2">
                Save Rule Parameters
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Digital Stamp Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" /> Digital Stamp Card Program
            </CardTitle>
            <CardDescription>Reward repeat customers with instant milestone perks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Live Customer Card</span>
                <Badge className="bg-emerald-500 text-white font-normal text-[10px]">Active</Badge>
              </div>
              <p className="text-lg font-bold">Buy {stampGoal} Coffees, Get 1 Free!</p>
              <div className="grid grid-cols-4 gap-2 pt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <div key={s} className="h-10 rounded-lg border border-white/20 flex items-center justify-center text-xs font-bold bg-white/5">
                    {s === 8 ? "🎁 Free" : `☕ #${s}`}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="goal">Stamps Needed for Free Reward</Label>
              <Input 
                id="goal" 
                type="number" 
                value={stampGoal} 
                onChange={e => setStampGoal(e.target.value)} 
                className="max-w-[120px]"
              />
            </div>
            <Button onClick={() => toast.success("Stamp card rules saved!")} variant="outline" className="w-full">
              Update Stamp Program
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Rewards Catalog */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-600" /> Customer Rewards Catalog
            </CardTitle>
            <CardDescription>Perks and items customers can claim during checkout using points.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleAddReward} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border">
            <Input 
              placeholder="Reward title (e.g. Free Brownie)" 
              value={newReward.name} 
              onChange={e => setNewReward({ ...newReward, name: e.target.value })} 
              className="sm:col-span-2"
              required 
            />
            <Input 
              type="number" 
              placeholder="Points Cost (e.g. 200)" 
              value={newReward.pointsCost} 
              onChange={e => setNewReward({ ...newReward, pointsCost: e.target.value })} 
              required 
            />
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-1" /> Add Reward
            </Button>
          </form>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {rewards.map((rew) => (
              <div key={rew.id} className="p-4 rounded-xl border bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-[10px]">{rew.category}</Badge>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {rew.pointsCost} pts
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-900">{rew.name}</h4>
                </div>
                <div className="flex items-center justify-between pt-3 mt-3 border-t text-xs text-slate-500">
                  <span>Status: Active</span>
                  <button 
                    onClick={() => {
                      setRewards(rewards.filter(r => r.id !== rew.id));
                      toast.info("Reward removed");
                    }}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
