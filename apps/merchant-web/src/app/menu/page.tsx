'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';

interface Category {
  id: string;
  name: string;
  is_active: boolean;
  sort_order: number;
}

interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  selling_price: number;
  is_active: boolean;
  is_sold_out: boolean;
}

interface Outlet {
  id: string;
  name: string;
}

export default function MenuCatalogPage() {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [activeOutletId, setActiveOutletId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [catName, setCatName] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCatId, setProdCatId] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [catModalOpen, setCatModalOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchOutlets();
  }, []);

  useEffect(() => {
    if (activeOutletId) {
      fetchCatalog(activeOutletId);
    }
  }, [activeOutletId]);

  const fetchOutlets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: member } = await supabase
        .from('tenant_members')
        .select('tenant_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (member) {
        const { data: outletsData } = await supabase
          .from('outlets')
          .select('id, name')
          .eq('tenant_id', member.tenant_id);

        setOutlets(outletsData || []);
        const firstOutlet = outletsData?.[0];
        if (firstOutlet) {
          setActiveOutletId(firstOutlet.id);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const fetchCatalog = async (outletId: string) => {
    setLoading(true);
    try {
      const { data: catData, error: catErr } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('outlet_id', outletId)
        .order('sort_order');

      if (catErr) throw catErr;
      setCategories(catData || []);
      if (catData && catData.length > 0) {
        setProdCatId(catData[0].id);
      }

      const { data: prodData, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .eq('outlet_id', outletId)
        .order('name');

      if (prodErr) throw prodErr;
      setProducts(prodData || []);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || !activeOutletId) return;

    try {
      const { error } = await supabase
        .from('menu_categories')
        .insert({
          name: catName,
          outlet_id: activeOutletId,
          sort_order: categories.length + 1,
        });

      if (error) throw error;
      
      setCatName('');
      setCatModalOpen(false);
      fetchCatalog(activeOutletId);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const priceNum = parseFloat(prodPrice);
    if (!prodName || isNaN(priceNum) || !activeOutletId) {
      setFormError('Please enter a valid product name and price.');
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .insert({
          outlet_id: activeOutletId,
          category_id: prodCatId || null,
          name: prodName,
          description: prodDesc || null,
          selling_price: priceNum,
          is_active: true,
          is_sold_out: false,
        });

      if (error) throw error;

      setModalOpen(false);
      setProdName('');
      setProdDesc('');
      setProdPrice('');
      
      fetchCatalog(activeOutletId);
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const toggleAvailability = async (id: string, currentSoldOut: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_sold_out: !currentSoldOut })
        .eq('id', id);

      if (error) throw error;
      fetchCatalog(activeOutletId);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleProductActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentActive })
        .eq('id', id);

      if (error) throw error;
      fetchCatalog(activeOutletId);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Menu Catalog</h1>
          <p className="text-slate-400 mt-2">Manage menu items, prices, modifiers, and categories.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Outlet select switcher */}
          {outlets.length > 1 && (
            <select
              value={activeOutletId}
              onChange={(e) => setActiveOutletId(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-700 text-sm text-slate-100 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              {outlets.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setCatModalOpen(true)}
            className="px-3.5 py-2 border border-slate-700 text-slate-300 hover:text-slate-100 hover:bg-slate-850 rounded text-sm font-semibold transition"
          >
            Add Category
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded text-sm font-semibold transition shadow-lg shadow-sky-600/10 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm h-fit">
          <h3 className="font-bold text-slate-200 text-sm mb-4">Categories</h3>
          {categories.length === 0 ? (
            <p className="text-xs text-slate-500">No categories found. Click 'Add Category'.</p>
          ) : (
            <ul className="space-y-1.5">
              {categories.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-850 text-xs font-semibold text-slate-300"
                >
                  <span>{c.name}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    Sort: {c.sort_order}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Products List Panel */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading catalog items...</div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No products found. Add menu items to start selling!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Item Details</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Selling Price</th>
                    <th className="px-6 py-4">Availability</th>
                    <th className="px-6 py-4">Active Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {products.map((p) => {
                    const cat = categories.find((c) => c.id === p.category_id);
                    return (
                      <tr key={p.id} className="hover:bg-slate-850/50 transition">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-100">{p.name}</div>
                          {p.description && (
                            <div className="text-xs text-slate-500 mt-0.5 max-w-xs truncate" title={p.description}>
                              {p.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {cat ? cat.name : <span className="text-slate-600 font-medium">Unassigned</span>}
                        </td>
                        <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                          ₹{p.selling_price}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                              !p.is_sold_out
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {!p.is_sold_out ? 'In Stock' : 'Sold Out'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center text-xs px-2 py-0.5 rounded font-semibold border ${
                              p.is_active
                                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {p.is_active ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => toggleAvailability(p.id, p.is_sold_out)}
                            className="px-2.5 py-1 text-xs rounded border border-slate-700 text-slate-300 hover:text-slate-100 hover:bg-slate-850 transition"
                          >
                            Toggle Stock
                          </button>
                          <button
                            onClick={() => toggleProductActive(p.id, p.is_active)}
                            className="px-2.5 py-1 text-xs rounded border border-slate-700 text-slate-300 hover:text-slate-100 hover:bg-slate-850 transition"
                          >
                            {p.is_active ? 'Draft' : 'Publish'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {catModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-850 flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-base">Add Menu Category</h3>
              <button
                onClick={() => setCatModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Beverages"
                  className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-855">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-855 flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-base">Add Menu Product</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Product Name *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Cappuccino Latte"
                  className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
                <textarea
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Double espresso coffee shot with thick textured steamed milk foam"
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-655 focus:outline-none focus:ring-1 focus:ring-sky-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                  <select
                    value={prodCatId}
                    onChange={(e) => setProdCatId(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Selling Price (INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="180"
                    className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              {formError && (
                <div className="p-3 rounded text-xs bg-rose-950/50 border border-rose-800 text-rose-350">
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-855">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition shadow-lg shadow-sky-600/10"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
