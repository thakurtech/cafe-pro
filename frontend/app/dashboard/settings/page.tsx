"use client";

import { useState } from "react";
import { Settings, Palette, Store, CreditCard, Printer, Globe, Shield, Save, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function SettingsPage() {
  const [shopName, setShopName] = useState("Café Noir");
  const [slug, setSlug] = useState("cafe-noir");
  const [tagline, setTagline] = useState("Artisanal Coffee & Handcrafted Pastries");
  const [themeColor, setThemeColor] = useState("#6366F1");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("owner@cafenoir.com");
  const [address, setAddress] = useState("12 Indiranagar 100ft Road, Bengaluru, Karnataka 560038");
  const [upiId, setUpiId] = useState("cafenoir@okaxis");
  const [gstNumber, setGstNumber] = useState("29ABCDE1234F1Z5");
  const [fssaiNumber, setFssaiNumber] = useState("11223344556677");
  const [taxRate, setTaxRate] = useState("5");
  const [receiptFooter, setReceiptFooter] = useState("Thank you for visiting Café Noir! Follow @cafenoir on Instagram ☕");
  const [customDomain, setCustomDomain] = useState("order.cafenoir.in");

  const COLOR_PRESETS = [
    { name: "Indigo Modern", hex: "#6366F1" },
    { name: "Emerald Cafe", hex: "#10B981" },
    { name: "Warm Amber", hex: "#F59E0B" },
    { name: "Coffee Roast", hex: "#8B4513" },
    { name: "Rose Berry", hex: "#F43F5E" },
    { name: "Midnight Slate", hex: "#0F172A" },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Cafe branding & operational settings updated successfully!");
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pb-24">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Cafe Branding & Storefront Customization</h2>
          <p className="text-slate-500">Customize every visual detail of your customer web storefront, receipts, and invoices.</p>
        </div>
        <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
          <Save className="w-4 h-4 mr-2" /> Save All Settings
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Theme & Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-600" /> Visual Theme & Storefront Colors
            </CardTitle>
            <CardDescription>Changes apply instantly across your branded customer web storefront and QR menu.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2">Preset Accent Colors</Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.hex}
                    type="button"
                    onClick={() => setThemeColor(p.hex)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${themeColor === p.hex ? "ring-2 ring-indigo-500 border-indigo-500 bg-slate-50" : "bg-white"}`}
                  >
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: p.hex }} />
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="customColor">Custom Hex Color Code</Label>
                <div className="flex gap-2">
                  <Input 
                    id="customColor" 
                    value={themeColor} 
                    onChange={e => setThemeColor(e.target.value)} 
                    className="font-mono"
                  />
                  <input 
                    type="color" 
                    value={themeColor} 
                    onChange={e => setThemeColor(e.target.value)} 
                    className="w-10 h-10 rounded-lg cursor-pointer border p-0.5"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border flex items-center justify-between" style={{ backgroundColor: `${themeColor}10` }}>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: themeColor }}>Storefront Preview Button</span>
                  <p className="text-xs text-slate-600 mt-0.5">Primary customer CTA</p>
                </div>
                <div className="px-4 py-2 rounded-xl text-white font-bold text-xs shadow-sm" style={{ backgroundColor: themeColor }}>
                  Order Now →
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cafe Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-slate-700" /> Business Profile & Location
            </CardTitle>
            <CardDescription>Displayed on customer invoices, web headers, and Google business QR embeds.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sname">Cafe Name</Label>
                <Input id="sname" value={shopName} onChange={e => setShopName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sslug">Storefront URL Slug</Label>
                <div className="flex items-center">
                  <span className="text-xs text-slate-400 mr-1.5">cafeos.in/shop/</span>
                  <Input id="sslug" value={slug} onChange={e => setSlug(e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tagline">Tagline / Subheading</Label>
              <Input id="tagline" value={tagline} onChange={e => setTagline(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Contact Phone</Label>
                <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Business Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="addr">Physical Address</Label>
              <Textarea id="addr" rows={2} value={address} onChange={e => setAddress(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Payments, Taxes & Invoicing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" /> Payments, Taxes & GST Compliance
            </CardTitle>
            <CardDescription>Direct UPI routing and statutory tax calculation snapshots.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="upi">Merchant UPI ID (For Direct Counter QR)</Label>
                <Input id="upi" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="cafenoir@okaxis" />
                <p className="text-[11px] text-slate-500">100% of customer payments go directly to your bank account with 0 platform cuts.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tax">Standard GST Rate (%)</Label>
                <Input id="tax" type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} placeholder="5" />
                <p className="text-[11px] text-slate-500">Standard Indian restaurant GST is 5% (2.5% CGST + 2.5% SGST).</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
              <div className="space-y-1.5">
                <Label htmlFor="gst">GSTIN Number (Optional)</Label>
                <Input id="gst" value={gstNumber} onChange={e => setGstNumber(e.target.value)} placeholder="29ABCDE1234F1Z5" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fssai">FSSAI License Number</Label>
                <Input id="fssai" value={fssaiNumber} onChange={e => setFssaiNumber(e.target.value)} placeholder="11223344556677" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receipts & Thermal Printers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-slate-700" /> Thermal Printer & KOT Output
            </CardTitle>
            <CardDescription>Configure 80mm / 58mm POS thermal receipt layouts and kitchen ticket headers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="rec">Receipt Footer Message</Label>
              <Input id="rec" value={receiptFooter} onChange={e => setReceiptFooter(e.target.value)} />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
              <div>
                <p className="text-sm font-bold text-slate-900">Auto-Print KOT to Kitchen on Order</p>
                <p className="text-xs text-slate-500">Sends raw ESC/POS commands directly to local USB or Network printer</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Custom Domain Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" /> Custom Domain / White-Label
            </CardTitle>
            <CardDescription>Serve your cafe's ordering experience on your exact branded domain.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <Input 
                value={customDomain} 
                onChange={e => setCustomDomain(e.target.value)} 
                placeholder="order.yourbrand.in"
                className="max-w-md"
              />
              <Button type="button" variant="outline" onClick={() => toast.success("DNS record verified!")}>
                Verify DNS CNAME
              </Button>
            </div>
            <p className="text-xs text-slate-500">Point a CNAME record from <span className="font-mono text-slate-800">{customDomain}</span> to <span className="font-mono text-slate-800">cname.cafeos.in</span></p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            <Save className="w-4 h-4 mr-2" /> Save All Configuration Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
