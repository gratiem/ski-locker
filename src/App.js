import { useState } from "react";

const TEAM_CODE = "northstar2024";

const initialCoaches = [
  { id: 1, name: "Mike Torres", email: "mike@northstar.com", phone: "530-555-0101" },
];

const initialAthletes = [
  { id: 1, name: "Emma Reyes", email: "emma@email.com", phone: "530-555-0201" },
  { id: 2, name: "Jake Liu", email: "jake@email.com", phone: "530-555-0202" },
  { id: 3, name: "Sofia Patel", email: "sofia@email.com", phone: "530-555-0203" },
];

const GEAR_TYPES = ["Snowboard", "Jacket", "Pants", "Boots", "Helmet", "Other"];

const initialGear = [
  { id: 1, athleteId: 1, type: "Snowboard", brand: "Burton", description: "Custom X 154cm", size: "154cm", price: 320, forSale: true },
  { id: 2, athleteId: 1, type: "Boots", brand: "ThirtyTwo", description: "Lashed 2024", size: "9", price: 120, forSale: true },
  { id: 3, athleteId: 2, type: "Jacket", brand: "Volcom", description: "L Gore-Tex Shell, navy", size: "L", price: 180, forSale: true },
  { id: 4, athleteId: 2, type: "Helmet", brand: "Smith", description: "Vantage MIPS, black", size: "M", price: 80, forSale: false },
  { id: 5, athleteId: 3, type: "Pants", brand: "686", description: "Smarty 3-in-1, olive", size: "M", price: 110, forSale: true },
  { id: 6, athleteId: 3, type: "Snowboard", brand: "Lib Tech", description: "T.Rice Pro 156", size: "156cm", price: 0, forSale: false },
];

const typeIcons = {
  Snowboard: "🏂", Jacket: "🧥", Pants: "👖", Boots: "👢", Helmet: "⛑️", Other: "📦"
};

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [view, setView] = useState("marketplace");
  const [coaches, setCoaches] = useState(initialCoaches);
  const [athletes, setAthletes] = useState(initialAthletes);
  const [gear, setGear] = useState(initialGear);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [filterType, setFilterType] = useState("All");

  function login() {
    if (codeInput.trim().toLowerCase() === TEAM_CODE) {
      setAuthed(true);
    } else {
      setCodeError(true);
      setTimeout(() => setCodeError(false), 2000);
    }
  }

  function openModal(type, data = {}) { setModal(type); setForm(data); }
  function closeModal() { setModal(null); setForm({}); }

  function saveCoach() {
    if (!form.name || !form.email) return;
    if (form.id) {
      setCoaches(coaches.map(c => c.id === form.id ? { ...form } : c));
    } else {
      setCoaches([...coaches, { ...form, id: Date.now() }]);
    }
    closeModal();
  }

  function saveAthlete() {
    if (!form.name || !form.email) return;
    if (form.id) {
      setAthletes(athletes.map(a => a.id === form.id ? { ...form } : a));
    } else {
      setAthletes([...athletes, { ...form, id: Date.now() }]);
    }
    closeModal();
  }

  function saveGear() {
    if (!form.type || !form.brand || !form.athleteId) return;
    const entry = { ...form, athleteId: parseInt(form.athleteId), price: parseFloat(form.price) || 0, forSale: !!form.forSale };
    if (form.id) {
      setGear(gear.map(g => g.id === form.id ? entry : g));
    } else {
      setGear([...gear, { ...entry, id: Date.now() }]);
    }
    closeModal();
  }

  function deleteItem(type, id) {
    if (type === "coach") setCoaches(coaches.filter(c => c.id !== id));
    if (type === "athlete") {
      setAthletes(athletes.filter(a => a.id !== id));
      setGear(gear.filter(g => g.athleteId !== id));
    }
    if (type === "gear") setGear(gear.filter(g => g.id !== id));
    closeModal();
  }

  const forSaleGear = gear.filter(g => g.forSale && (filterType === "All" || g.type === filterType));

  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh", background: "linear-gradient(160deg, #0a1628 0%, #0e2144 50%, #0a1628 100%)",
        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif",
        position: "relative", overflow: "hidden"
      }}>
        {[...Array(30)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%", background: "rgba(255,255,255,0.15)",
            width: Math.random() * 4 + 2, height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`
          }} />
        ))}
        <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }`}</style>
        <div style={{
          background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20,
          padding: "48px 40px", maxWidth: 400, width: "90%", textAlign: "center",
          boxShadow: "0 32px 64px rgba(0,0,0,0.5)"
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⛷️</div>
          <div style={{ color: "#c9a84c", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 }}>Northstar Teams</div>
          <h1 style={{ color: "#fff", fontSize: 26, fontWeight: "bold", margin: "0 0 6px" }}>Ski Locker</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 32 }}>Enter your team code to access</p>
          <input
            type="password" placeholder="Team code"
            value={codeInput} onChange={e => setCodeInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 10,
              border: `1px solid ${codeError ? "#ef4444" : "rgba(255,255,255,0.2)"}`,
              background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 15,
              outline: "none", boxSizing: "border-box", marginBottom: 12,
              transition: "border 0.2s", fontFamily: "inherit"
            }}
          />
          {codeError && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>Incorrect team code. Try again.</p>}
          <button onClick={login} style={{
            width: "100%", padding: "14px",
            background: "linear-gradient(135deg, #c9a84c, #e8c96a)",
            border: "none", borderRadius: 10, color: "#0a1628", fontWeight: "bold",
            fontSize: 15, cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5
          }}>Enter Locker</button>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "marketplace", label: "Marketplace", icon: "🏪" },
    { id: "athletes", label: "Athletes", icon: "🏂" },
    { id: "coaches", label: "Coaches", icon: "📋" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Georgia', serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        button:hover { opacity: 0.88; }
        .card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important; }
        .card { transition: transform 0.18s, box-shadow 0.18s; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0a1628 0%, #0e2144 100%)",
        padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 16px rgba(0,0,0,0.3)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0" }}>
          <span style={{ fontSize: 28 }}>⛷️</span>
          <div>
            <div style={{ color: "#c9a84c", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>Northstar Teams</div>
            <div style={{ color: "#fff", fontSize: 18, fontWeight: "bold", lineHeight: 1.1 }}>Ski Locker</div>
          </div>
        </div>
        <nav style={{ display: "flex", gap: 4 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setView(n.id)} style={{
              padding: "8px 16px",
              background: view === n.id ? "rgba(201,168,76,0.2)" : "transparent",
              border: view === n.id ? "1px solid rgba(201,168,76,0.5)" : "1px solid transparent",
              borderRadius: 8, color: view === n.id ? "#c9a84c" : "rgba(255,255,255,0.65)",
              cursor: "pointer", fontSize: 13, fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 6
            }}>
              <span>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* MARKETPLACE */}
        {view === "marketplace" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
              <div>
                <h2 style={{ margin: 0, color: "#0a1628", fontSize: 26 }}>Gear Marketplace</h2>
                <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>{forSaleGear.length} items for sale</p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["All", ...GEAR_TYPES].map(t => (
                  <button key={t} onClick={() => setFilterType(t)} style={{
                    padding: "6px 14px", borderRadius: 20,
                    background: filterType === t ? "#0a1628" : "#fff",
                    color: filterType === t ? "#fff" : "#64748b",
                    border: "1px solid #d1d5db", cursor: "pointer", fontSize: 13, fontFamily: "inherit"
                  }}>{t !== "All" ? typeIcons[t] + " " : ""}{t}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {forSaleGear.length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 48, color: "#94a3b8" }}>
                  No gear listed for sale yet.
                </div>
              )}
              {forSaleGear.map(g => {
                const owner = athletes.find(a => a.id === g.athleteId);
                return (
                  <div key={g.id} className="card" onClick={() => openModal("viewGear", g)} style={{
                    background: "#fff", borderRadius: 14, padding: 20, cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)", border: "1px solid #e2e8f0"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <span style={{ fontSize: 32 }}>{typeIcons[g.type]}</span>
                      <span style={{
                        background: "linear-gradient(135deg, #c9a84c, #e8c96a)", color: "#0a1628",
                        fontWeight: "bold", borderRadius: 8, padding: "4px 10px", fontSize: 15
                      }}>${g.price}</span>
                    </div>
                    <div style={{ fontWeight: "bold", color: "#0a1628", fontSize: 16, marginBottom: 2 }}>{g.brand}</div>
                    <div style={{ color: "#475569", fontSize: 14, marginBottom: 8 }}>{g.description}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ background: "#f1f5f9", color: "#64748b", borderRadius: 6, padding: "2px 8px", fontSize: 12 }}>{g.type}</span>
                      <span style={{ background: "#f1f5f9", color: "#64748b", borderRadius: 6, padding: "2px 8px", fontSize: 12 }}>Size: {g.size}</span>
                    </div>
                    {owner && <div style={{ marginTop: 10, color: "#94a3b8", fontSize: 12 }}>👤 {owner.name}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ATHLETES */}
        {view === "athletes" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ margin: 0, color: "#0a1628", fontSize: 26 }}>Athletes</h2>
                <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>{athletes.length} team members</p>
              </div>
              <button onClick={() => openModal("addAthlete")} style={{
                padding: "10px 20px", background: "linear-gradient(135deg, #0a1628, #0e2144)",
                color: "#c9a84c", border: "none", borderRadius: 10, cursor: "pointer",
                fontFamily: "inherit", fontWeight: "bold", fontSize: 14
              }}>+ Add Athlete</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {athletes.map(a => {
                const athleteGear = gear.filter(g => g.athleteId === a.id);
                const forSaleCount = athleteGear.filter(g => g.forSale).length;
                return (
                  <div key={a.id} className="card" style={{
                    background: "#fff", borderRadius: 14, padding: 20,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)", border: "1px solid #e2e8f0"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 42, height: 42, borderRadius: "50%",
                          background: "linear-gradient(135deg, #0a1628, #1e3a6e)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#c9a84c", fontWeight: "bold", fontSize: 16
                        }}>{a.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: "bold", color: "#0a1628", fontSize: 16 }}>{a.name}</div>
                          <div style={{ color: "#64748b", fontSize: 13 }}>{a.email}</div>
                        </div>
                      </div>
                      <button onClick={() => openModal("addAthlete", { ...a })} style={{
                        background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 16
                      }}>✏️</button>
                    </div>
                    <div style={{ color: "#64748b", fontSize: 13, marginBottom: 12 }}>📞 {a.phone}</div>
                    <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 13, color: "#475569", fontWeight: "bold" }}>
                          Gear ({athleteGear.length}) {forSaleCount > 0 && <span style={{ color: "#c9a84c" }}>· {forSaleCount} for sale</span>}
                        </span>
                        <button onClick={() => openModal("addGear", { athleteId: a.id })} style={{
                          fontSize: 12, padding: "4px 10px", background: "#f8fafc",
                          border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer",
                          color: "#475569", fontFamily: "inherit"
                        }}>+ Add Gear</button>
                      </div>
                      {athleteGear.length === 0 && <div style={{ color: "#cbd5e1", fontSize: 13 }}>No gear yet</div>}
                      {athleteGear.map(g => (
                        <div key={g.id} onClick={() => openModal("viewGear", g)} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "6px 8px", borderRadius: 8, cursor: "pointer",
                          background: "#f8fafc", marginBottom: 4
                        }}>
                          <span style={{ fontSize: 13 }}>{typeIcons[g.type]} {g.brand} — {g.description}</span>
                          {g.forSale && <span style={{ background: "#fef9ee", color: "#92650a", fontSize: 11, padding: "2px 6px", borderRadius: 4 }}>${g.price}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* COACHES */}
        {view === "coaches" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ margin: 0, color: "#0a1628", fontSize: 26 }}>Coaches</h2>
                <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>{coaches.length} coaches</p>
              </div>
              <button onClick={() => openModal("addCoach")} style={{
                padding: "10px 20px", background: "linear-gradient(135deg, #0a1628, #0e2144)",
                color: "#c9a84c", border: "none", borderRadius: 10, cursor: "pointer",
                fontFamily: "inherit", fontWeight: "bold", fontSize: 14
              }}>+ Add Coach</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {coaches.map(c => (
                <div key={c.id} className="card" style={{
                  background: "#fff", borderRadius: 14, padding: 20,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.07)", border: "1px solid #e2e8f0"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: "50%",
                        background: "linear-gradient(135deg, #c9a84c, #e8c96a)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#0a1628", fontWeight: "bold", fontSize: 16
                      }}>{c.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: "bold", color: "#0a1628", fontSize: 16 }}>{c.name}</div>
                        <div style={{ color: "#64748b", fontSize: 12, background: "#fef9ee", display: "inline-block", padding: "1px 8px", borderRadius: 4 }}>Coach</div>
                      </div>
                    </div>
                    <button onClick={() => openModal("addCoach", { ...c })} style={{
                      background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 16
                    }}>✏️</button>
                  </div>
                  <div style={{ marginTop: 14, color: "#64748b", fontSize: 13, display: "flex", flexDirection: "column", gap: 4 }}>
                    <div>✉️ {c.email}</div>
                    <div>📞 {c.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {modal && (
        <div onClick={closeModal} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: 20
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 440,
            boxShadow: "0 24px 48px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto"
          }}>

            {modal === "viewGear" && (() => {
              const g = form;
              const owner = athletes.find(a => a.id === g.athleteId);
              return (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 36 }}>{typeIcons[g.type]}</span>
                      <div>
                        <h3 style={{ margin: 0, color: "#0a1628" }}>{g.brand}</h3>
                        <div style={{ color: "#64748b", fontSize: 14 }}>{g.type}</div>
                      </div>
                    </div>
                    <button onClick={closeModal} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8" }}>✕</button>
                  </div>
                  <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
                    {[["Description", g.description], ["Size", g.size], ["Status", g.forSale ? `For Sale — $${g.price}` : "Not for sale"], ["Owner", owner?.name]].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#f8fafc", borderRadius: 8 }}>
                        <span style={{ color: "#64748b", fontSize: 14 }}>{k}</span>
                        <span style={{ color: "#0a1628", fontSize: 14, fontWeight: "500" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => openModal("addGear", { ...g })} style={{
                      flex: 1, padding: "10px", background: "#0a1628", color: "#c9a84c",
                      border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", fontWeight: "bold"
                    }}>Edit</button>
                    <button onClick={() => deleteItem("gear", g.id)} style={{
                      padding: "10px 16px", background: "#fee2e2", color: "#dc2626",
                      border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit"
                    }}>Delete</button>
                  </div>
                </div>
              );
            })()}

            {modal === "addCoach" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <h3 style={{ margin: 0, color: "#0a1628" }}>{form.id ? "Edit" : "Add"} Coach</h3>
                  <button onClick={closeModal} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
                </div>
                {[["name", "Name *"], ["email", "Email *"], ["phone", "Phone"]].map(([k, label]) => (
                  <div key={k} style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 13, color: "#64748b", marginBottom: 4 }}>{label}</label>
                    <input value={form[k] || ""} onChange={e => setForm({ ...form, [k]: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
                  </div>
                ))}
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button onClick={saveCoach} style={{ flex: 1, padding: 12, background: "#0a1628", color: "#c9a84c", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", fontWeight: "bold" }}>Save</button>
                  {form.id && <button onClick={() => deleteItem("coach", form.id)} style={{ padding: "12px 16px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>}
                </div>
              </div>
            )}

            {modal === "addAthlete" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <h3 style={{ margin: 0, color: "#0a1628" }}>{form.id ? "Edit" : "Add"} Athlete</h3>
                  <button onClick={closeModal} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
                </div>
                {[["name", "Name *"], ["email", "Email *"], ["phone", "Phone"]].map(([k, label]) => (
                  <div key={k} style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 13, color: "#64748b", marginBottom: 4 }}>{label}</label>
                    <input value={form[k] || ""} onChange={e => setForm({ ...form, [k]: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
                  </div>
                ))}
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button onClick={saveAthlete} style={{ flex: 1, padding: 12, background: "#0a1628", color: "#c9a84c", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", fontWeight: "bold" }}>Save</button>
                  {form.id && <button onClick={() => deleteItem("athlete", form.id)} style={{ athleteId: form.id }} style={{ padding: "12px 16px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit" }} onClick={() => deleteItem("athlete", form.id)}>Delete</button>}
                </div>
              </div>
            )}

            {modal === "addGear" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                  <h3 style={{ margin: 0, color: "#0a1628" }}>{form.id ? "Edit" : "Add"} Gear</h3>
                  <button onClick={closeModal} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>✕</button>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 13, color: "#64748b", marginBottom: 4 }}>Owner *</label>
                  <select value={form.athleteId || ""} onChange={e => setForm({ ...form, athleteId: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none" }}>
                    <option value="">Select athlete...</option>
                    {athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 13, color: "#64748b", marginBottom: 4 }}>Type *</label>
                  <select value={form.type || ""} onChange={e => setForm({ ...form, type: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none" }}>
                    <option value="">Select type...</option>
                    {GEAR_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                {[["brand", "Brand *"], ["description", "Description"], ["size", "Size"]].map(([k, label]) => (
                  <div key={k} style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 13, color: "#64748b", marginBottom: 4 }}>{label}</label>
                    <input value={form[k] || ""} onChange={e => setForm({ ...form, [k]: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
                  </div>
                ))}
                <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="checkbox" id="forsale" checked={!!form.forSale} onChange={e => setForm({ ...form, forSale: e.target.checked })} />
                  <label htmlFor="forsale" style={{ fontSize: 14, color: "#0a1628" }}>Listed for sale</label>
                </div>
                {form.forSale && (
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 13, color: "#64748b", marginBottom: 4 }}>Price ($)</label>
                    <input type="number" value={form.price || ""} onChange={e => setForm({ ...form, price: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
                  </div>
                )}
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button onClick={saveGear} style={{ flex: 1, padding: 12, background: "#0a1628", color: "#c9a84c", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", fontWeight: "bold" }}>Save</button>
                  {form.id && <button onClick={() => deleteItem("gear", form.id)} style={{ padding: "12px 16px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
