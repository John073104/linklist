import React, { useEffect, useState } from "react";
import { LayoutGrid, Package, BarChart3, HelpCircle, Settings, Plus, Search, ChevronLeft, ChevronRight, List, Grid3x3, ExternalLink, X, Trash2, Eye, EyeOff, ArrowLeft, ShoppingBag, Play, Upload, LockKeyhole, Save, TrendingUp, MousePointerClick, Users, DollarSign, MessageCircle, Send, Inbox, Copy } from "lucide-react";

const CREAM = "#F7F3E9";
const CARD = "#FFFDF8";
const INK = "#1F1B14";
const GOLD = "#B8935F";
const FOREST = "#2E4A3D";
const DEFAULT_PROFILE = { name: "John Lloyd B. Jardines", bio: "Products I actually use and recommend.", passcode: "linklist" };

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background: FOREST }}>
        <Package size={16} color="#F7F3E9" strokeWidth={2} />
      </div>
      <span className="text-xl font-bold" style={{ fontFamily: "Georgia, serif", color: INK }}>Linklist</span>
    </div>
  );
}

function AddProductModal({ onClose, onAdd, initialProduct = null }) {
  const [name, setName] = useState(initialProduct?.name || "");
  const [price, setPrice] = useState(initialProduct?.price === "—" ? "" : initialProduct?.price || "");
  const [commission, setCommission] = useState(initialProduct?.commission || "");
  const [buyers, setBuyers] = useState(String(initialProduct?.buyers ?? 0));
  const [sales, setSales] = useState(String(initialProduct?.sales ?? 0));
  const [link, setLink] = useState(initialProduct?.link || "");
  const [media, setMedia] = useState(initialProduct?.media || []);
  const [error, setError] = useState("");

  const handleMediaChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 5) {
      setError("Choose between 1 and 5 images or videos.");
      return;
    }
    if (files.some((file) => !file.type.startsWith("image/") && !file.type.startsWith("video/"))) {
      setError("Only image and video files are supported.");
      return;
    }
    Promise.all(files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, type: file.type, src: reader.result });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }))).then(setMedia).catch(() => setError("Those files could not be uploaded."));
  };

  const handleSubmit = () => {
    if (!name.trim() || !link.trim()) {
      setError("Give this product a name and an affiliate link.");
      return;
    }
    try {
      new URL(link);
    } catch {
      setError("That link doesn't look valid. Include https://");
      return;
    }
    onAdd({
      ...(initialProduct || {}),
      id: initialProduct?.id || Date.now(),
      name: name.trim(),
      price: price.trim() || "—",
      commission: commission.trim(),
      buyers: Math.max(0, Number.parseInt(buyers, 10) || 0),
      sales: Math.max(0, Number.parseFloat(sales) || 0),
      clicks: initialProduct?.clicks || 0,
      link: link.trim(),
      media,
      published: initialProduct?.published ?? true,
      createdAt: initialProduct?.createdAt || new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(31,27,20,0.45)" }} onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
        style={{ background: CARD, border: `1px solid ${GOLD}33` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold" style={{ fontFamily: "Georgia, serif", color: INK }}>{initialProduct ? "Edit product" : "Add a product"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/5 transition-colors">
            <X size={18} color={INK} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium tracking-wide" style={{ color: `${INK}99` }}>Product name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ceramic pour-over kettle"
              className="w-full mt-1 px-3 py-2.5 rounded-lg text-sm outline-none border focus:border-current transition-colors"
              style={{ borderColor: `${INK}22`, color: INK, background: CREAM }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium tracking-wide" style={{ color: `${INK}99` }}>Price</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="$48.00"
                className="w-full mt-1 px-3 py-2.5 rounded-lg text-sm outline-none border"
                style={{ borderColor: `${INK}22`, color: INK, background: CREAM }}
              />
            </div>
            <div>
              <label className="text-xs font-medium tracking-wide" style={{ color: `${INK}99` }}>Commission % <span style={{ color: `${INK}66` }}>(optional)</span></label>
              <input
                value={commission}
                onChange={(e) => setCommission(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="9"
                className="w-full mt-1 px-3 py-2.5 rounded-lg text-sm outline-none border"
                style={{ borderColor: `${INK}22`, color: INK, background: CREAM }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium tracking-wide" style={{ color: `${INK}99` }}>Buyers</label>
              <input type="number" min="0" value={buyers} onChange={(event) => setBuyers(event.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-lg text-sm outline-none border" style={{ borderColor: `${INK}22`, color: INK, background: CREAM }} />
            </div>
            <div>
              <label className="text-xs font-medium tracking-wide" style={{ color: `${INK}99` }}>Sales value</label>
              <input type="number" min="0" step="0.01" value={sales} onChange={(event) => setSales(event.target.value)} placeholder="0.00" className="w-full mt-1 px-3 py-2.5 rounded-lg text-sm outline-none border" style={{ borderColor: `${INK}22`, color: INK, background: CREAM }} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium tracking-wide" style={{ color: `${INK}99` }}>Affiliate link</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://retailer.com/product?ref=you"
              className="w-full mt-1 px-3 py-2.5 rounded-lg text-sm outline-none border"
              style={{ borderColor: `${INK}22`, color: INK, background: CREAM }}
            />
            <p className="text-xs mt-1" style={{ color: `${INK}77` }}>Visitors get redirected here when they click.</p>
          </div>

          <div>
            <label className="text-xs font-medium tracking-wide" style={{ color: `${INK}99` }}>Product media</label>
            <label className="mt-1 flex items-center justify-center gap-2 px-3 py-5 rounded-lg border border-dashed cursor-pointer hover:bg-black/5" style={{ borderColor: `${INK}33`, color: FOREST }}>
              <Upload size={16} />
              <span className="text-sm">Replace with up to 5 images or videos</span>
              <input type="file" accept="image/*,video/*" multiple onChange={handleMediaChange} className="sr-only" />
            </label>
            {media.length > 0 && <p className="text-xs mt-1" style={{ color: `${INK}77` }}>{media.length} media file{media.length === 1 ? "" : "s"} selected</p>}
          </div>

          {error && <p className="text-sm" style={{ color: "#B34A3C" }}>{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-black/5"
              style={{ borderColor: `${INK}22`, color: INK }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
              style={{ background: FOREST, color: "#F7F3E9" }}
            >
              {initialProduct ? "Save product" : "Add product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-xl p-5 flex-1" style={{ background: CARD, border: `1px solid ${INK}14` }}>
      <p className="text-xs tracking-wide" style={{ color: `${INK}88` }}>{label}</p>
      <p className="mt-1.5" style={{ color: INK }}>
        <span className="text-3xl font-bold" style={{ fontFamily: "Georgia, serif" }}>{value}</span>{" "}
        <span className="text-sm" style={{ color: `${INK}77` }}>{sub}</span>
      </p>
    </div>
  );
}

function ProfileModal({ profile, onSave, onClose }) {
  const [draft, setDraft] = useState(profile);
  const [error, setError] = useState("");
  const save = () => {
    if (!draft.name.trim() || !draft.passcode.trim()) {
      setError("Display name and passcode cannot be blank.");
      return;
    }
    onSave({ ...draft, name: draft.name.trim(), bio: draft.bio.trim() || "Products I actually use and recommend.", passcode: draft.passcode.trim() });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(31,27,20,0.45)" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: CARD, border: `1px solid ${GOLD}33` }} onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between mb-5"><h2 className="text-xl font-bold" style={{ fontFamily: "Georgia, serif", color: INK }}>Account settings</h2><button onClick={onClose} aria-label="Close settings"><X size={18} /></button></div>
        <div className="space-y-4">
          <label className="block text-xs font-medium" style={{ color: `${INK}99` }}>Display name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className="w-full mt-1 px-3 py-2.5 rounded-lg text-sm outline-none border" style={{ borderColor: `${INK}22`, color: INK, background: CREAM }} /></label>
          <label className="block text-xs font-medium" style={{ color: `${INK}99` }}>Bio<input value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} className="w-full mt-1 px-3 py-2.5 rounded-lg text-sm outline-none border" style={{ borderColor: `${INK}22`, color: INK, background: CREAM }} /></label>
          <label className="block text-xs font-medium" style={{ color: `${INK}99` }}>Owner passcode<input type="password" value={draft.passcode} onChange={(event) => setDraft({ ...draft, passcode: event.target.value })} className="w-full mt-1 px-3 py-2.5 rounded-lg text-sm outline-none border" style={{ borderColor: `${INK}22`, color: INK, background: CREAM }} /></label>
          <p className="text-xs" style={{ color: `${INK}77` }}>This static site uses a browser passcode lock. For stronger protection, connect the app to a real authentication service.</p>
          {error && <p className="text-xs" style={{ color: "#B34A3C" }}>{error}</p>}
          <button onClick={save} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium" style={{ background: FOREST, color: "#fff" }}><Save size={15} /> Save changes</button>
        </div>
      </div>
    </div>
  );
}

function OwnerGate({ profile, onUnlock }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const submit = () => passcode === profile.passcode ? onUnlock() : setError("That passcode is not correct.");
  return <div className="min-h-screen flex items-center justify-center p-4" style={{ background: CREAM }}><div className="w-full max-w-sm rounded-2xl p-6 shadow-xl" style={{ background: CARD, border: `1px solid ${INK}14` }}><div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center mb-4" style={{ background: FOREST }}><LockKeyhole color="#fff" size={22} /></div><h1 className="text-2xl text-center font-bold" style={{ fontFamily: "Georgia, serif", color: INK }}>Owner dashboard</h1><p className="text-sm text-center mt-2 mb-5" style={{ color: `${INK}77` }}>Enter your owner passcode to manage Linklist.</p><input autoFocus type="password" value={passcode} onChange={(event) => setPasscode(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submit()} placeholder="Owner passcode" className="w-full px-3 py-2.5 rounded-lg text-sm outline-none border" style={{ borderColor: `${INK}22`, color: INK, background: CREAM }} />{error && <p className="text-xs mt-2" style={{ color: "#B34A3C" }}>{error}</p>}<button onClick={submit} className="w-full mt-4 py-2.5 rounded-lg text-sm font-medium" style={{ background: FOREST, color: "#fff" }}>Enter dashboard</button></div></div>;
}

function OverviewPanel({ products, setDashboardView, setPage, openSettings }) {
  const published = products.filter((product) => product.published).length;
  const mediaCount = products.reduce((total, product) => total + (product.media?.length || 0), 0);
  return <div className="max-w-6xl px-4 sm:px-8 py-6 sm:py-8"><p className="text-xs tracking-wider font-medium" style={{ color: `${INK}66` }}>WORKSPACE OVERVIEW</p><h1 className="text-3xl sm:text-4xl font-bold mt-1" style={{ fontFamily: "Georgia, serif", color: INK }}>Good to see you.</h1><p className="text-sm mt-1 mb-6" style={{ color: `${INK}88` }}>A quick view of your Linklist workspace.</p><div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"><StatCard label="Catalog size" value={products.length} sub="products" /><StatCard label="Live picks" value={published} sub="published" /><StatCard label="Media assets" value={mediaCount} sub="uploaded" /></div><div className="grid grid-cols-1 lg:grid-cols-2 gap-4"><div className="rounded-xl p-5" style={{ background: CARD, border: `1px solid ${INK}14` }}><h2 className="font-semibold" style={{ color: INK }}>Next steps</h2><div className="space-y-3 mt-4 text-sm" style={{ color: `${INK}88` }}><button onClick={() => setDashboardView("products")} className="block w-full text-left hover:underline">Add products to your catalog</button><button onClick={() => setDashboardView("analytics")} className="block w-full text-left hover:underline">Review link performance</button><button onClick={openSettings} className="block w-full text-left hover:underline">Update your account profile</button></div></div><div className="rounded-xl p-5" style={{ background: FOREST, color: "#fff" }}><TrendingUp size={22} /><h2 className="font-semibold mt-3">Public page</h2><p className="text-sm mt-1 opacity-80">Your visitors can only see published products, never this dashboard.</p><button onClick={() => setPage("public")} className="mt-4 rounded-lg px-3 py-2 text-xs font-semibold" style={{ background: GOLD }}>Open public page</button></div></div></div>;
}

function AnalyticsPanel({ products }) {
  const published = products.filter((product) => product.published).length;
  const draft = products.length - published;
  const clicks = products.reduce((total, product) => total + (product.clicks || 0), 0);
  const buyers = products.reduce((total, product) => total + (product.buyers || 0), 0);
  const sales = products.reduce((total, product) => total + (product.sales || 0), 0);
  const earnings = products.reduce((total, product) => total + ((product.sales || 0) * (Number.parseFloat(product.commission) || 0) / 100), 0);
  return <div className="max-w-6xl px-4 sm:px-8 py-6 sm:py-8"><p className="text-xs tracking-wider font-medium" style={{ color: `${INK}66` }}>PERFORMANCE</p><h1 className="text-3xl sm:text-4xl font-bold mt-1" style={{ fontFamily: "Georgia, serif", color: INK }}>Analytics</h1><p className="text-sm mt-1 mb-6" style={{ color: `${INK}88` }}>Live catalog activity and estimated affiliate earnings.</p><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6"><StatCard label="Link clicks" value={clicks} sub="tracked" /><StatCard label="Buyers" value={buyers} sub="recorded" /><StatCard label="Sales" value={`$${sales.toFixed(2)}`} sub="recorded value" /><StatCard label="Est. earnings" value={`$${earnings.toFixed(2)}`} sub="commission" /></div><div className="rounded-xl p-5" style={{ background: CARD, border: `1px solid ${INK}14` }}><h2 className="font-semibold" style={{ color: INK }}>Catalog status</h2><div className="mt-4 h-4 rounded-full overflow-hidden flex" style={{ background: `${INK}0F` }}><div style={{ width: `${products.length ? (published / products.length) * 100 : 0}%`, background: FOREST }} /><div style={{ flex: 1, background: GOLD }} /></div><div className="flex justify-between text-xs mt-2" style={{ color: `${INK}77` }}><span>{published} published</span><span>{draft} draft</span></div>{!products.length && <p className="text-sm mt-6" style={{ color: `${INK}77` }}>Add your first product to start collecting useful catalog insights.</p>}</div></div>;
}

function MessagesPanel({ messages, onMarkRead, onDelete }) {
  return <div className="max-w-6xl px-4 sm:px-8 py-6 sm:py-8"><p className="text-xs tracking-wider font-medium" style={{ color: `${INK}66` }}>INBOX</p><h1 className="text-3xl sm:text-4xl font-bold mt-1" style={{ fontFamily: "Georgia, serif", color: INK }}>Help center messages</h1><p className="text-sm mt-1 mb-6" style={{ color: `${INK}88` }}>Questions sent from your public page appear here.</p>{messages.length === 0 ? <div className="rounded-xl p-10 text-center" style={{ background: CARD, border: `1px dashed ${INK}22` }}><Inbox size={30} color={GOLD} className="mx-auto" /><p className="font-semibold mt-3" style={{ color: INK }}>Your inbox is clear</p><p className="text-sm mt-1" style={{ color: `${INK}77` }}>Public questions will appear here.</p></div> : <div className="space-y-3">{messages.map((message) => <div key={message.id} className="rounded-xl p-4" style={{ background: CARD, border: `1px solid ${message.read ? `${INK}14` : `${GOLD}66`}` }}><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-sm" style={{ color: INK }}>{message.name} <span className="font-normal" style={{ color: `${INK}66` }}>{message.email}</span></p><p className="text-sm mt-2 whitespace-pre-wrap" style={{ color: `${INK}88` }}>{message.text}</p></div><span className="text-xs whitespace-nowrap" style={{ color: `${INK}66` }}>{message.createdAt}</span></div><div className="flex gap-3 mt-3"><button onClick={() => onMarkRead(message.id)} className="text-xs font-medium" style={{ color: FOREST }}>{message.read ? "Mark unread" : "Mark read"}</button><button onClick={() => onDelete(message.id)} className="text-xs font-medium" style={{ color: "#B34A3C" }}>Delete</button></div></div>)}</div>}</div>;
}

function PublicMessageForm({ onSend, creatorName }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const submit = () => {
    if (!name.trim() || !text.trim()) return;
    onSend({ id: Date.now(), name: name.trim(), email: email.trim(), text: text.trim(), read: false, createdAt: new Date().toLocaleString() });
    setName("");
    setEmail("");
    setText("");
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };
  return <div className="mt-8 rounded-xl p-5" style={{ background: CARD, border: `1px solid ${INK}14` }}><div className="flex items-center gap-2"><MessageCircle size={18} color={FOREST} /><h2 className="font-semibold" style={{ color: INK }}>Have a question?</h2></div><p className="text-sm mt-1" style={{ color: `${INK}77` }}>Send a message to {creatorName}. It will appear in the creator's Help Center.</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name *" className="px-3 py-2.5 rounded-lg text-sm outline-none border" style={{ borderColor: `${INK}22`, background: CREAM, color: INK }} /><input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email (optional)" className="px-3 py-2.5 rounded-lg text-sm outline-none border" style={{ borderColor: `${INK}22`, background: CREAM, color: INK }} /></div><textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Write your question or concern..." rows="3" className="w-full mt-3 px-3 py-2.5 rounded-lg text-sm outline-none border resize-y" style={{ borderColor: `${INK}22`, background: CREAM, color: INK }} /><button onClick={submit} className="mt-3 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium" style={{ background: FOREST, color: "#fff" }}><Send size={14} /> Send message</button>{sent && <p className="text-xs mt-2" style={{ color: FOREST }}>Message sent.</p>}</div>;
}

function MediaStrip({ product, compact = false }) {
  const media = product.media?.length ? product.media : (product.image ? [{ src: product.image, type: "image/legacy" }] : []);
  if (!media.length) return <Package size={compact ? 18 : 28} color={GOLD} />;
  return <div className={`grid h-full w-full ${media.length > 1 ? "grid-cols-2 gap-0.5" : "grid-cols-1"}`}>{media.slice(0, 5).map((item, index) => <div key={`${item.src}-${index}`} className="relative min-h-0 overflow-hidden">{item.type.startsWith("video/") ? <><video src={item.src} className="w-full h-full object-cover" muted /><Play size={compact ? 12 : 20} color="#fff" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow" /></> : <img src={item.src} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />}</div>)}</div>;
}

function LinkCart({ links, onRemove, onOpenAll, onClear }) {
  const [open, setOpen] = useState(false);
  if (!links.length) return null;
  return (
    <div className="fixed bottom-4 right-4 z-40 w-[calc(100%-2rem)] max-w-sm">
      {open && <div className="mb-2 rounded-xl p-3 shadow-xl" style={{ background: CARD, border: `1px solid ${INK}22` }}>
        <div className="flex items-center justify-between mb-2"><p className="text-sm font-semibold" style={{ color: INK }}>Saved links</p><button onClick={() => setOpen(false)} aria-label="Close cart"><X size={16} /></button></div>
        <div className="max-h-48 overflow-auto space-y-1">{links.map((product) => <div key={product.id} className="flex items-center gap-2 text-sm" style={{ color: INK }}><span className="truncate flex-1">{product.name}</span><button onClick={() => onRemove(product.id)} aria-label={`Remove ${product.name}`}><X size={14} /></button></div>)}</div>
        <div className="flex gap-2 mt-3"><button onClick={onOpenAll} className="flex-1 rounded-lg py-2 text-xs font-semibold" style={{ background: FOREST, color: "#fff" }}>Open all links</button><button onClick={onClear} className="px-3 rounded-lg border text-xs" style={{ borderColor: `${INK}22` }}>Clear</button></div>
      </div>}
      <button onClick={() => setOpen(!open)} className="ml-auto flex items-center gap-2 rounded-full px-4 py-3 shadow-xl text-sm font-semibold" style={{ background: FOREST, color: "#fff" }} aria-label="Open link cart"><ShoppingBag size={17} /> Link cart <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: GOLD }}>{links.length}</span></button>
    </div>
  );
}

function ProductRow({ product, view, onTogglePublish, onDelete, onAddToCart, onEdit }) {
  if (view === "grid") {
    return (
      <div className="rounded-xl overflow-hidden flex flex-col" style={{ background: CARD, border: `1px solid ${INK}14` }}>
        <div className="h-32 flex items-center justify-center" style={{ background: `${GOLD}22` }}>
          <MediaStrip product={product} />
        </div>
        <div className="p-4 flex flex-col gap-2 flex-1">
          <p className="font-semibold text-sm" style={{ color: INK }}>{product.name}</p>
          <div className="flex items-center justify-between text-xs" style={{ color: `${INK}88` }}>
            <span>{product.price}</span>
            <span>{product.commission ? `${product.commission}% commission` : "Commission —"}</span>
          </div>
          <div className="flex gap-1.5 mt-auto pt-2">
            <button onClick={() => onTogglePublish(product.id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-medium border" style={{ borderColor: `${INK}22`, color: INK }}>
              {product.published ? <><EyeOff size={12} /> Unpublish</> : <><Eye size={12} /> Publish</>}
            </button>
            <button onClick={() => onAddToCart(product)} className="p-1.5 rounded-md border" style={{ borderColor: `${INK}22` }} aria-label="Add link to cart"><ShoppingBag size={13} color={FOREST} /></button>
            <button onClick={() => onEdit(product)} className="px-2 py-1.5 rounded-md border text-xs font-medium" style={{ borderColor: `${INK}22`, color: INK }}>Edit</button>
            <button onClick={() => onDelete(product.id)} className="p-1.5 rounded-md border" style={{ borderColor: `${INK}22` }}>
              <Trash2 size={13} color="#B34A3C" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_5rem_6rem_6rem_auto_auto_auto] items-center gap-3 py-3 px-2 border-b" style={{ borderColor: `${INK}0F` }}>
      <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${GOLD}22` }}>
        <MediaStrip product={product} compact />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: INK }}>{product.name}</p>
        <p className="text-xs truncate" style={{ color: `${INK}77` }}>{product.link}</p>
      </div>
      <span className="text-xs w-16 text-right" style={{ color: `${INK}88` }}>{product.price}</span>
      <span className="text-xs w-24 text-right" style={{ color: `${INK}88` }}>{product.commission ? `${product.commission}% comm.` : "—"}</span>
      <span
        className="text-xs px-2 py-1 rounded-full w-24 text-center"
        style={{ background: product.published ? `${FOREST}1A` : `${INK}0F`, color: product.published ? FOREST : `${INK}88` }}
      >
        {product.published ? "Published" : "Draft"}
      </span>
      <button onClick={() => onTogglePublish(product.id)} className="p-1.5 rounded-md hover:bg-black/5" title={product.published ? "Unpublish" : "Publish"}>
        {product.published ? <EyeOff size={15} color={INK} /> : <Eye size={15} color={INK} />}
      </button>
      <button onClick={() => onAddToCart(product)} className="p-1.5 rounded-md hover:bg-black/5" title="Add link to cart"><ShoppingBag size={15} color={FOREST} /></button>
      <button onClick={() => onEdit(product)} className="px-2 py-1.5 rounded-md hover:bg-black/5 text-xs font-medium" title="Edit product">Edit</button>
      <button onClick={() => onDelete(product.id)} className="p-1.5 rounded-md hover:bg-black/5" title="Delete">
        <Trash2 size={15} color="#B34A3C" />
      </button>
    </div>
  );
}

function CreatorDashboard({ products, setProducts, setPage, cart, setCart, profile, setProfile, messages, setMessages, onLock }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("list");
  const [notice, setNotice] = useState("");
  const [dashboardView, setDashboardView] = useState("products");
  const [profileOpen, setProfileOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [copied, setCopied] = useState(false);
  const publicUrl = `${window.location.origin}${window.location.pathname}?view=public`;

  const addProduct = (p) => setProducts((prev) => [p, ...prev]);
  const togglePublish = (id) => setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p)));
  const deleteProduct = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));
  const updateProduct = (product) => setProducts((prev) => prev.map((item) => item.id === product.id ? product : item));
  const addToCart = (product) => setCart((prev) => prev.some((item) => item.id === product.id) ? prev : [...prev, product]);
  const unreadMessages = messages.filter((message) => !message.read).length;

  let visible = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  if (filter === "published") visible = visible.filter((p) => p.published);
  if (filter === "draft") visible = visible.filter((p) => !p.published);
  visible = [...visible].sort((a, b) => (sort === "newest" ? b.id - a.id : a.id - b.id));

  const publishedCount = products.filter((p) => p.published).length;
  return (
    <div className="min-h-screen flex" style={{ background: CREAM, fontFamily: "system-ui, sans-serif" }}>
      {/* Sidebar */}
      <div className="hidden md:flex w-60 shrink-0 border-r flex-col justify-between" style={{ borderColor: `${INK}14` }}>
        <div>
          <div className="p-5"><Logo /></div>
          <div className="px-3 mt-4">
            <p className="text-xs tracking-wider font-medium px-3 mb-2" style={{ color: `${INK}66` }}>WORKSPACE</p>
            <div className="space-y-0.5">
              <button onClick={() => setDashboardView("overview")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${dashboardView === "overview" ? "font-medium" : ""}`} style={{ background: dashboardView === "overview" ? `${GOLD}2A` : "transparent", color: INK }}>
                <LayoutGrid size={16} /> Overview
              </button>
              <button onClick={() => setDashboardView("products")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${dashboardView === "products" ? "font-medium" : ""}`} style={{ background: dashboardView === "products" ? `${GOLD}2A` : "transparent", color: INK }}>
                <Package size={16} /> Products
              </button>
              <button onClick={() => setDashboardView("analytics")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${dashboardView === "analytics" ? "font-medium" : ""}`} style={{ background: dashboardView === "analytics" ? `${GOLD}2A` : "transparent", color: INK }}>
                <BarChart3 size={16} /> Analytics
              </button>
            </div>
          </div>
        </div>
        <div className="p-3 space-y-0.5 border-t" style={{ borderColor: `${INK}14` }}>
          <button onClick={() => setPage("public")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium" style={{ color: FOREST }}>
            <ExternalLink size={16} /> View public page
          </button>
          <button onClick={() => setDashboardView("messages")} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${dashboardView === "messages" ? "font-medium" : ""}`} style={{ background: dashboardView === "messages" ? `${GOLD}2A` : "transparent", color: INK }}>
            <HelpCircle size={16} /> Help center {unreadMessages > 0 && <span className="ml-auto rounded-full px-1.5 py-0.5 text-[10px]" style={{ background: GOLD, color: "#fff" }}>{unreadMessages}</span>}
          </button>
          <button onClick={() => setProfileOpen(true)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm" style={{ color: INK }}>
            <Settings size={16} /> Settings
          </button>
          <div className="flex items-center gap-2 pt-3 mt-2 border-t" style={{ borderColor: `${INK}14` }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: GOLD, color: "#fff" }}>JL</div>
            <div className="text-xs">
              <p className="font-medium truncate" style={{ color: INK }}>{profile.name}</p>
              <p style={{ color: `${INK}77` }}>Owner account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1">
        <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b" style={{ borderColor: `${INK}14` }}>
          <p className="text-sm" style={{ color: `${INK}88` }}>Workspace / <span style={{ color: INK }}>{dashboardView[0].toUpperCase() + dashboardView.slice(1)}</span></p>
          <div className="flex items-center gap-3">
            <button onClick={() => setDashboardView("overview")} className="hidden sm:block text-xs" style={{ color: `${INK}77` }}>Overview</button>
            <button onClick={() => setDashboardView("analytics")} className="hidden sm:block text-xs" style={{ color: `${INK}77` }}>Analytics</button>
            <button onClick={() => setPage("public")} className="md:hidden flex items-center gap-1.5 text-xs font-medium" style={{ color: FOREST }}>
              <ExternalLink size={14} /> View page
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: GOLD, color: "#fff" }}>JL</div>
          </div>
        </div>

        {dashboardView === "overview" && <OverviewPanel products={products} setDashboardView={setDashboardView} setPage={setPage} openSettings={() => setProfileOpen(true)} />}
        {dashboardView === "analytics" && <AnalyticsPanel products={products} />}
        {dashboardView === "messages" && <MessagesPanel messages={messages} onMarkRead={(id) => setMessages((current) => current.map((message) => message.id === id ? { ...message, read: !message.read } : message))} onDelete={(id) => setMessages((current) => current.filter((message) => message.id !== id))} />}
        {dashboardView === "products" && <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs tracking-wider font-medium mb-1" style={{ color: `${INK}66` }}>YOUR CATALOG</p>
              <h1 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "Georgia, serif", color: INK }}>Products</h1>
              <p className="text-sm mt-1" style={{ color: `${INK}88` }}>Curate, organize, and share the products your audience will love.</p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shrink-0 transition-opacity hover:opacity-90"
              style={{ background: FOREST, color: "#F7F3E9" }}
            >
              <Plus size={16} /> Add product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <StatCard label="Total products" value={products.length} sub="in your catalog" />
            <StatCard label="Published" value={publishedCount} sub="live on your page" />
            <StatCard label="Link clicks" value={products.reduce((total, product) => total + (product.clicks || 0), 0)} sub="tracked" />
            <StatCard label="Buyers" value={products.reduce((total, product) => total + (product.buyers || 0), 0)} sub="recorded" />
            <StatCard label="Sales" value={`$${products.reduce((total, product) => total + (product.sales || 0), 0).toFixed(2)}`} sub="recorded value" />
            <StatCard label="Est. earnings" value={`$${products.reduce((total, product) => total + ((product.sales || 0) * (Number.parseFloat(product.commission) || 0) / 100), 0).toFixed(2)}`} sub="commission" />
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border" style={{ borderColor: `${INK}22`, background: CARD }}>
              <Search size={16} color={`${INK}77`} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="flex-1 outline-none text-sm bg-transparent"
                style={{ color: INK }}
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2.5 rounded-lg border text-sm outline-none"
              style={{ borderColor: `${INK}22`, background: CARD, color: INK }}
            >
              <option value="all">All products</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2.5 rounded-lg border text-sm outline-none"
              style={{ borderColor: `${INK}22`, background: CARD, color: INK }}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <button onClick={() => setView("list")} className="p-2.5 rounded-lg border" style={{ borderColor: `${INK}22`, background: view === "list" ? `${INK}0F` : CARD }}>
              <List size={16} color={INK} />
            </button>
            <button onClick={() => setView("grid")} className="p-2.5 rounded-lg border" style={{ borderColor: `${INK}22`, background: view === "grid" ? `${INK}0F` : CARD }}>
              <Grid3x3 size={16} color={INK} />
            </button>
          </div>

          <div className="rounded-xl mt-4 overflow-x-auto" style={{ background: view === "list" ? CARD : "transparent", border: view === "list" ? `1px solid ${INK}14` : "none", padding: view === "list" ? "8px 12px" : 0 }}>
            {visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Package size={40} color={`${INK}44`} />
                <p className="text-xl font-bold mt-4" style={{ fontFamily: "Georgia, serif", color: INK }}>{products.length === 0 ? `Welcome to ${profile.name}'s Linklist` : "No products found"}</p>
                <p className="text-sm mt-1" style={{ color: `${INK}77` }}>
                  {products.length === 0 ? "Your catalog is ready. Add your first recommendation to share it with your audience." : "Try a different search or filter."}
                </p>
                {products.length === 0 && (
                  <button onClick={() => setModalOpen(true)} className="text-sm font-medium underline mt-4" style={{ color: FOREST }}>
                    Add a product
                  </button>
                )}
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visible.map((p) => (
                  <ProductRow key={p.id} product={p} view="grid" onTogglePublish={togglePublish} onDelete={deleteProduct} onAddToCart={addToCart} onEdit={setEditingProduct} />
                ))}
              </div>
            ) : (
              visible.map((p) => (
                <ProductRow key={p.id} product={p} view="list" onTogglePublish={togglePublish} onDelete={deleteProduct} onAddToCart={addToCart} onEdit={setEditingProduct} />
              ))
            )}
          </div>

          <div className="flex items-center justify-between mt-6 text-sm" style={{ color: `${INK}77` }}>
            <span>Showing {visible.length} of {products.length} products</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setNotice("You are viewing the first page.")} className="p-1.5 rounded-md border" style={{ borderColor: `${INK}22` }} aria-label="Previous page"><ChevronLeft size={14} /></button>
              <span className="px-3 py-1 rounded-md text-xs font-medium" style={{ background: FOREST, color: "#fff" }}>1</span>
              <button onClick={() => setNotice("All products are shown on this page.")} className="p-1.5 rounded-md border" style={{ borderColor: `${INK}22` }} aria-label="Next page"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>}
      </div>

      <div className="fixed top-20 right-4 z-30 flex items-center gap-2 rounded-xl px-3 py-2 shadow-lg" style={{ background: CARD, border: `1px solid ${INK}14` }}><ExternalLink size={15} color={FOREST} /><span className="hidden sm:inline text-xs max-w-xs truncate" style={{ color: INK }}>{publicUrl}</span><button onClick={() => { navigator.clipboard?.writeText(publicUrl); setCopied(true); setTimeout(() => setCopied(false), 1600); }} className="text-xs font-semibold" style={{ color: FOREST }}>{copied ? "Copied" : "Copy public link"}</button></div>
      {modalOpen && <AddProductModal onClose={() => setModalOpen(false)} onAdd={addProduct} />}
      {editingProduct && <AddProductModal initialProduct={editingProduct} onClose={() => setEditingProduct(null)} onAdd={(product) => { updateProduct(product); setEditingProduct(null); }} />}
      {profileOpen && <ProfileModal profile={profile} onSave={setProfile} onClose={() => setProfileOpen(false)} />}
      <button onClick={onLock} className="fixed bottom-4 left-4 z-30 flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold shadow-lg" style={{ background: INK, color: "#fff" }}><LockKeyhole size={13} /> Lock dashboard</button>
      <LinkCart links={cart} onRemove={(id) => setCart((prev) => prev.filter((item) => item.id !== id))} onClear={() => setCart([])} onOpenAll={() => cart.forEach((product) => window.open(product.link, "_blank", "noopener,noreferrer"))} />
      {notice && <button onClick={() => setNotice("")} className="fixed bottom-4 left-4 z-40 max-w-xs rounded-lg px-4 py-3 text-left text-xs shadow-lg" style={{ background: INK, color: "#fff" }}>{notice}</button>}
    </div>
  );
}

function PublicPage({ products, setPage, cart, setCart, profile, setProducts, setMessages }) {
  const [toast, setToast] = useState("");
  const published = products.filter((p) => p.published);

  const handleClick = (p) => {
    setProducts((current) => current.map((product) => product.id === p.id ? { ...product, clicks: (product.clicks || 0) + 1 } : product));
    setToast(`Redirecting to ${p.name}...`);
    window.open(p.link, "_blank", "noopener,noreferrer");
    setTimeout(() => setToast(""), 2500);
  };
  const addToCart = (event, product) => {
    event.stopPropagation();
    setCart((prev) => prev.some((item) => item.id === product.id) ? prev : [...prev, product]);
    setToast("Added to your link cart");
    setTimeout(() => setToast(""), 1800);
  };

  return (
    <div className="min-h-screen" style={{ background: CREAM, fontFamily: "system-ui, sans-serif" }}>
      <div className="flex items-center justify-between gap-3 px-4 sm:px-8 py-5 border-b" style={{ borderColor: `${INK}14` }}>
        <Logo />
        <span className="text-xs sm:text-sm" style={{ color: `${INK}77` }}>Public collection</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-xl font-bold mb-4" style={{ background: GOLD, color: "#fff" }}>JL</div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Georgia, serif", color: INK }}>{profile.name}'s picks</h1>
        <p className="text-sm mt-2" style={{ color: `${INK}88` }}>{profile.bio}</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        {published.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center rounded-xl" style={{ background: CARD, border: `1px dashed ${INK}22` }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: `${GOLD}33` }}><Package size={28} color={GOLD} /></div>
            <p className="text-2xl font-bold mt-4" style={{ fontFamily: "Georgia, serif", color: INK }}>Welcome to {profile.name}'s picks</p>
            <p className="text-sm mt-2 max-w-md" style={{ color: `${INK}77` }}>{profile.bio} New recommendations will appear here soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {published.map((p) => (
              <div
                key={p.id}
                className="text-left rounded-2xl overflow-hidden group transition-transform hover:-translate-y-0.5"
                style={{ background: CARD, border: `1px solid ${INK}14` }}
              >
                <div className="h-40 flex items-center justify-center" style={{ background: `${GOLD}22` }}>
                  <MediaStrip product={p} />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm" style={{ color: INK }}>{p.name}</p>
                    <button onClick={() => handleClick(p)} aria-label={`Open ${p.name}`}><ExternalLink size={14} color={`${INK}66`} className="shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" /></button>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-2"><p className="text-sm font-medium" style={{ color: FOREST }}>{p.price}</p><button onClick={(event) => addToCart(event, p)} className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium" style={{ borderColor: `${INK}22`, color: FOREST }}><ShoppingBag size={13} /> Save link</button></div>
                </div>
              </div>
            ))}
          </div>
        )}
        <PublicMessageForm creatorName={profile.name} onSend={(message) => setMessages((current) => [message, ...current])} />
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full text-sm font-medium shadow-lg" style={{ background: INK, color: "#F7F3E9" }}>
          {toast}
        </div>
      )}
      <LinkCart links={cart} onRemove={(id) => setCart((prev) => prev.filter((item) => item.id !== id))} onClear={() => setCart([])} onOpenAll={() => cart.forEach((product) => window.open(product.link, "_blank", "noopener,noreferrer"))} />
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState(() => new URLSearchParams(window.location.search).get("view") === "public" ? "public" : "creator");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem("linklist-products") || "[]").map((product) => ({ clicks: 0, buyers: 0, sales: 0, ...product })));
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("linklist-cart") || "[]"));
  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem("linklist-messages") || "[]"));
  const [profile, setProfile] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("linklist-profile") || "{}");
    return { ...DEFAULT_PROFILE, ...saved, name: saved.name?.trim() || DEFAULT_PROFILE.name, bio: saved.bio?.trim() || DEFAULT_PROFILE.bio, passcode: saved.passcode?.trim() || DEFAULT_PROFILE.passcode };
  });

  useEffect(() => localStorage.setItem("linklist-products", JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem("linklist-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("linklist-profile", JSON.stringify(profile)), [profile]);
  useEffect(() => localStorage.setItem("linklist-messages", JSON.stringify(messages)), [messages]);
  useEffect(() => {
    const sync = (event) => {
      if (event.key === "linklist-products" && event.newValue) setProducts(JSON.parse(event.newValue));
      if (event.key === "linklist-profile" && event.newValue) setProfile(JSON.parse(event.newValue));
      if (event.key === "linklist-messages" && event.newValue) setMessages(JSON.parse(event.newValue));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  if (page === "public") return <PublicPage products={products} setPage={setPage} cart={cart} setCart={setCart} profile={profile} setProducts={setProducts} setMessages={setMessages} />;
  if (!adminUnlocked) return <OwnerGate profile={profile} onUnlock={() => setAdminUnlocked(true)} />;
  return (
    <CreatorDashboard products={products} setProducts={setProducts} setPage={setPage} cart={cart} setCart={setCart} profile={profile} setProfile={setProfile} messages={messages} setMessages={setMessages} onLock={() => setAdminUnlocked(false)} />
  );
}
