"use client";

import { useState } from "react";
import { Gamepad2, Sparkles, Trophy, ShieldCheck, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function GamesManagementPage() {
  const [isScratchActive, setIsScratchActive] = useState(true);
  const [winRate, setWinRate] = useState("35");
  const [dailyAttempts, setDailyAttempts] = useState("1");
  const [rewardValue, setRewardValue] = useState("50");
  const [minOrder, setMinOrder] = useState("150");

  const [isSpinActive, setIsSpinActive] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Gamification engine parameters saved!");
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Gamification & Micro-Engagement</h2>
        <p className="text-slate-500">Configure post-order scratch cards and daily challenges to drive addictive customer repeat visits.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Scratch Card Config */}
        <Card className="border-indigo-100">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" /> Post-Order Scratch Card
                </CardTitle>
                <CardDescription>Presented to customers immediately upon order confirmation.</CardDescription>
              </div>
              <Switch checked={isScratchActive} onCheckedChange={setIsScratchActive} />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-amber-500 to-indigo-600 rounded-xl text-white shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">Customer Preview</span>
                  <Badge className="bg-white/20 text-white border-0 text-[10px]">Active Game</Badge>
                </div>
                <h4 className="text-lg font-bold">✨ Scratch & Win Loyalty Bonus!</h4>
                <p className="text-xs opacity-90 mt-1">Win up to {rewardValue} bonus loyalty points on today's visit.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="winRate">Winning Probability (%)</Label>
                  <Input 
                    id="winRate" 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={winRate} 
                    onChange={e => setWinRate(e.target.value)} 
                  />
                  <p className="text-[10px] text-slate-500">{winRate}% of plays grant a reward</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rewardVal">Reward Points</Label>
                  <Input 
                    id="rewardVal" 
                    type="number" 
                    value={rewardValue} 
                    onChange={e => setRewardValue(e.target.value)} 
                  />
                  <p className="text-[10px] text-slate-500">Credited to customer ledger</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="attempts">Max Plays per Day</Label>
                  <Input 
                    id="attempts" 
                    type="number" 
                    value={dailyAttempts} 
                    onChange={e => setDailyAttempts(e.target.value)} 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="min">Min Order to Qualify (₹)</Label>
                  <Input 
                    id="min" 
                    type="number" 
                    value={minOrder} 
                    onChange={e => setMinOrder(e.target.value)} 
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                Save Scratch Card Settings
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Spin the Wheel (P1 feature) */}
        <Card className="opacity-90">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-purple-500" /> Daily Spin & Win Wheel
                </CardTitle>
                <CardDescription>Daily app check-in engagement for customer profile page.</CardDescription>
              </div>
              <Switch checked={isSpinActive} onCheckedChange={setIsSpinActive} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-100 rounded-xl border space-y-2 text-center">
              <div className="text-3xl">🎡</div>
              <h4 className="font-bold text-slate-800">Spinning Wheel Registry</h4>
              <p className="text-xs text-slate-500">8 segments: 10 pts, 25 pts, Free Cookie, 50 pts, Better Luck, 10% Off, Free Chai, 100 pts.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 border-b pb-2">
                <span>Fraud Protection & Rate Limiter</span>
                <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">Device Fingerprint Active</Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 border-b pb-2">
                <span>Budget Cap per Week</span>
                <span className="font-bold text-slate-800">₹2,000 in points</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => toast.info("Spin wheel settings updated!")}
            >
              Configure Wheel Slices
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Game Performance Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Gamification Metrics (Last 30 Days)</CardTitle>
          <CardDescription>How micro-rewards influence repeat visits and basket size.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="p-4 bg-slate-50 rounded-xl border">
              <p className="text-xs text-slate-500">Total Games Played</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">428</h3>
              <p className="text-[11px] text-emerald-600 mt-0.5">↑ 82% participation rate</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border">
              <p className="text-xs text-slate-500">Rewards Won</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">152</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">35.5% effective win rate</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border">
              <p className="text-xs text-slate-500">Total Points Distributed</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">7,600 pts</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">₹1,900 merchant liability</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border">
              <p className="text-xs text-slate-500">Influenced Reorders</p>
              <h3 className="text-2xl font-bold text-indigo-600 mt-1">68 Orders</h3>
              <p className="text-[11px] text-emerald-600 mt-0.5">₹23,800 gross revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
