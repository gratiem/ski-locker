import { useState } from "react";

// ─── Northstar Brand Colors ───────────────────────────────────────────────────
const C = {
  deepGreen:  "#1C3D2E",
  pineGreen:  "#2D6A4F",
  lightGreen: "#74C69D",
  snowBg:     "#F7F4EF",
  white:      "#FFFFFF",
  text:       "#1A1A1A",
  muted:      "#6B7280",
  border:     "#E0DDD8",
  softGreen:  "#E8F5EE",
  danger:     "#DC2626",
  dangerBg:   "#FEE2E2",
};

const TEAM_CODE = "northstar2024";

const initialAthletes = [
  { id: 1, name: "Emma Reyes",  email: "emma@email.com",  phone: "530-555-0201" },
  { id: 2, name: "Jake Liu",    email: "jake@email.com",  phone: "530-555-0202" },
  { id: 3, name: "Sofia Patel", email: "sofia@email.com", phone: "530-555-0203" },
];

const GEAR_TYPES = ["Snowboard", "Jacket", "Pants", "Boots", "Helmet", "Other"];

const initialGear = [
  { id: 1, athleteId: 1, type: "Snowboard", brand: "Burton",    description: "Custom X 154cm",        size: "154cm", price: 320, forSale: true  },
  { id: 2, athleteId: 1, type: "Boots",     brand: "ThirtyTwo", description: "Lashed 2024",            size: "9",     price: 120, forSale: true  },
  { id: 3, athleteId: 2, type: "Jacket",    brand: "Volcom",    description: "Gore-Tex Shell, navy",   size: "L",     price: 180, forSale: true  },
  { id: 4, athleteId: 2, type: "Helmet",    brand: "Smith",     description: "Vantage MIPS, black",    size: "M",     price: 80,  forSale: false },
  { id: 5, athleteId: 3, type: "Pants",     brand: "686",       description: "Smarty 3-in-1, olive",   size: "M",     price: 110, forSale: true  },
  { id: 6, athleteId: 3, type: "Snowboard", brand: "Lib Tech",  description: "T.Rice Pro 156",         size: "156cm", price: 0,   forSale: false },
];

const typeIcons = {
  Snowboard: "🏂", Jacket: "🧥", Pants: "👖", Boots: "👢", Helmet: "⛑️", Other: "📦"
};

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 8,
  border: `1px solid ${C.border}`, fontSize: 14,
  fontFamily: "inherit", outline: "none",
  background: C.white, color: C.text,
};

// ─── Small reusable components ────────────────────────────────────────────────

function Avatar({ name }) {
  return (
    <div style={{
      width: 44, height: 44, borderRadius: "50%",
      background: `linear-gradient(135deg, ${C.deepGreen}, ${C.pineGreen})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: C.lightGreen, fontWeight: "bold", fontSize: 17, flexShrink: 0,
    }}>
      {name.charAt(0)}
    </div>
  );
}

function Tag({ children }) {
  return (
    <span style={{
      background: C.snowBg, color: C.muted,
      borderRadius: 6, padding: "3px 9px", fontSize: 12,
      border: `1px solid ${C.border}`,
    }}>
      {children}
    </span>
  );
}

function GreenButton({ onClick, children, style = {} }) {
  return (
    <button onClick={onClick} style={{
      padding: "11px 20px",
      background: `linear-gradient(135deg, ${C.deepGreen}, ${C.pineGreen})`,
      color: C.white, border: "none", borderRadius: 10,
      cursor: "pointer", fontFamily: "inherit",
      fontWeight: "bold", fontSize: 14, ...style,
    }}>
      {children}
    </button>
  );
}

function DangerButton({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "11px 16px", background: C.dangerBg,
      color: C.danger, border: "none", borderRadius: 10,
      cursor: "pointer", fontFamily: "inherit", fontSize: 14,
    }}>
      {children}
    </button>
  );
}

function ModalHeader({ title, onClose, icon }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      alignItems: "center", marginBottom: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon}
        <h3 style={{ margin: 0, color: C.deepGreen, fontSize: 18 }}>{title}</h3>
      </div>
      <button onClick={onClose} style={{
        background: "none", border: "none",
        fontSize: 18, cursor: "pointer", color: C.muted, padding: 4,
      }}>✕</button>
    </div>
  );
}

function FieldRow({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: "block", fontSize: 12, color: C.muted,
        marginBottom: 5, fontWeight: "bold", letterSpacing: 0.3,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      padding: "9px 12px", background: C.snowBg,
      borderRadius: 8, border: `1px solid ${C.border}`,
    }}>
      <span style={{ color: C.muted, fontSize: 14 }}>{label}</span>
      <span style={{ color: C.text, fontSize: 14, fontWeight: "500" }}>{value}</span>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [authed, setAuthed]         = useState(false);
  const [codeInput, setCodeInput]   = useState("");
  const [codeError, setCodeError]   = useState(false);
  const [view, setView]             = useState("marketplace");
  const [athletes, setAthletes]     = useState(initialAthletes);
  const [gear, setGear]             = useState(initialGear);
  const [modal, setModal]           = useState(null);
  const [form, setForm]             = useState({});
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
    const entry = {
      ...form,
      athleteId: parseInt(form.athleteId),
      price: parseFloat(form.price) || 0,
      forSale: !!form.forSale,
    };
    if (form.id) {
      setGear(gear.map(g => g.id === form.id ? entry : g));
    } else {
      setGear([...gear, { ...entry, id: Date.now() }]);
    }
    closeModal();
  }

  function deleteItem(type, id) {
    if (type === "athlete") {
      setAthletes(athletes.filter(a => a.id !== id));
      setGear(gear.filter(g => g.athleteId !== id));
    }
    if (type === "gear") setGear(gear.filter(g => g.id !== id));
    closeModal();
  }

  const forSaleGear = gear.filter(
    g => g.forSale && (filterType === "All" || g.type === filterType)
  );

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${C.deepGreen} 0%, #0f2318 60%, ${C.deepGreen} 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Georgia', serif", position: "relative", overflow: "hidden",
      }}>
        <style>{`
          @keyframes drift { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        `}</style>
        {[...Array(22)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            width: Math.random() * 5 + 2, height: Math.random() * 5 + 2,
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            animation: `drift ${4 + Math.random() * 5}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }} />
        ))}

        <div style={{
          background: "rgba(255,255,255,0.06)", backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.13)", borderRadius: 20,
          padding: "52px 44px", maxWidth: 400, width: "90%",
          textAlign: "center", boxShadow: "0 32px 80px rgba(0,0,0,0.55)",
          animation: "fadeUp 0.5s ease both",
        }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🏔️</div>
          <div style={{
            color: C.lightGreen, fontSize: 10, letterSpacing: 5,
            textTransform: "uppercase", marginBottom: 8,
          }}>
            Northstar Teams
          </div>
          <h1 style={{ color: C.white, fontSize: 28, fontWeight: "bold", margin: "0 0 8px" }}>
            Ski Locker
          </h1>
          <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 14, marginBottom: 36 }}>
            Enter your team code to access
          </p>
          <input
            type="password" placeholder="Team code"
            value={codeInput} onChange={e => setCodeInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 10,
              border: `1px solid ${codeError ? "#ef4444" : "rgba(255,255,255,0.2)"}`,
              background: "rgba(255,255,255,0.08)", color: C.white, fontSize: 15,
              outline: "none", boxSizing: "border-box", marginBottom: 12,
              fontFamily: "inherit", transition: "border 0.2s",
            }}
          />
          {codeError && (
            <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>
              Incorrect team code. Try again.
            </p>
          )}
          <button onClick={login} style={{
            width: "100%", padding: "14px",
            background: `linear-gradient(135deg, ${C.pineGreen}, ${C.deepGreen})`,
            border: `1px solid ${C.lightGreen}`, borderRadius: 10,
            color: C.white, fontWeight: "bold", fontSize: 15,
            cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5,
          }}>
            Enter Locker
          </button>
        </div>
      </div>
    );
  }

  // ── Main app shell ────────────────────────────────────────────────────────
  const navItems = [
    { id: "marketplace", label: "Marketplace", icon: "🏪" },
    { id: "athletes",    label: "Athletes",    icon: "🏂" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.snowBg, fontFamily: "'Georgia', serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        button { transition: opacity 0.15s; }
        button:hover { opacity: 0.85; }
        .card { transition: transform 0.18s, box-shadow 0.18s; }
        .card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(28,61,46,0.13) !important; }
        input:focus, select:focus { border-color: ${C.pineGreen} !important; box-shadow: 0 0 0 3px rgba(45,106,79,0.12); }
      `}</style>

      {/* Header */}
      <header style={{
        background: C.deepGreen, padding: "0 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 2px 12px rgba(0,0,0,0.22)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0" }}>
          <span style={{ fontSize: 26 }}>🏔️</span>
          <div>
            <div style={{
              color: C.lightGreen, fontSize: 9, letterSpacing: 4,
              textTransform: "uppercase", marginBottom: 1,
            }}>
              Northstar Teams
            </div>
            <div style={{ color: C.white, fontSize: 17, fontWeight: "bold", lineHeight: 1 }}>
              Ski Locker
            </div>
          </div>
        </div>
        <nav style={{ display: "flex", gap: 4 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setView(n.id)} style={{
              padding: "8px 18px",
              background: view === n.id ? "rgba(116,198,157,0.15)" : "transparent",
              border: view === n.id ? "1px solid rgba(116,198,157,0.4)" : "1px solid transparent",
              borderRadius: 8,
              color: view === n.id ? C.lightGreen : "rgba(255,255,255,0.58)",
              cursor: "pointer", fontSize: 13, fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {n.icon} {n.label}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px" }}>

        {/* ── Marketplace ─────────────────────────────────────────────── */}
        {view === "marketplace" && (
          <div>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "flex-end", marginBottom: 28,
              flexWrap: "wrap", gap: 16,
            }}>
              <div>
                <h2 style={{ margin: 0, color: C.deepGreen, fontSize: 28, fontWeight: "bold" }}>
                  Gear Marketplace
                </h2>
                <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 14 }}>
                  {forSaleGear.length} item{forSaleGear.length !== 1 ? "s" : ""} for sale
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["All", ...GEAR_TYPES].map(t => (
                  <button key={t} onClick={() => setFilterType(t)} style={{
                    padding: "6px 14px", borderRadius: 20,
                    background: filterType === t ? C.deepGreen : C.white,
                    color: filterType === t ? C.white : C.muted,
                    border: `1px solid ${filterType === t ? C.deepGreen : C.border}`,
                    cursor: "pointer", fontSize: 13, fontFamily: "inherit",
                  }}>
                    {t !== "All" ? typeIcons[t] + " " : ""}{t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 18,
            }}>
              {forSaleGear.length === 0 && (
                <div style={{
                  gridColumn: "1/-1", textAlign: "center",
                  padding: "64px 0", color: C.muted,
                }}>
                  No gear listed for sale yet.
                </div>
              )}
              {forSaleGear.map(g => {
                const owner = athletes.find(a => a.id === g.athleteId);
                return (
                  <div key={g.id} className="card"
                    onClick={() => openModal("viewGear", g)}
                    style={{
                      background: C.white, borderRadius: 14, padding: 22,
                      cursor: "pointer", border: `1px solid ${C.border}`,
                      boxShadow: "0 2px 8px rgba(28,61,46,0.07)",
                    }}
                  >
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "flex-start", marginBottom: 12,
                    }}>
                      <span style={{ fontSize: 34 }}>{typeIcons[g.type]}</span>
                      <span style={{
                        background: C.softGreen, color: C.pineGreen,
                        fontWeight: "bold", borderRadius: 8,
                        padding: "4px 12px", fontSize: 15,
                        border: "1px solid rgba(45,106,79,0.2)",
                      }}>
                        ${g.price}
                      </span>
                    </div>
                    <div style={{ fontWeight: "bold", color: C.text, fontSize: 16, marginBottom: 3 }}>
                      {g.brand}
                    </div>
                    <div style={{ color: C.muted, fontSize: 14, marginBottom: 10 }}>
                      {g.description}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                      <Tag>{g.type}</Tag>
                      <Tag>Size: {g.size}</Tag>
                    </div>
                    {owner && (
                      <div style={{
                        borderTop: `1px solid ${C.border}`, paddingTop: 10,
                        color: C.muted, fontSize: 12,
                      }}>
                        👤 {owner.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Athletes ─────────────────────────────────────────────────── */}
        {view === "athletes" && (
          <div>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 28,
            }}>
              <div>
                <h2 style={{ margin: 0, color: C.deepGreen, fontSize: 28, fontWeight: "bold" }}>
                  Athletes
                </h2>
                <p style={{ margin: "4px 0 0", color: C.muted, fontSize: 14 }}>
                  {athletes.length} team member{athletes.length !== 1 ? "s" : ""}
                </p>
              </div>
              <GreenButton onClick={() => openModal("addAthlete")}>
                + Add Athlete
              </GreenButton>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))",
              gap: 18,
            }}>
              {athletes.map(a => {
                const athleteGear  = gear.filter(g => g.athleteId === a.id);
                const forSaleCount = athleteGear.filter(g => g.forSale).length;
                return (
                  <div key={a.id} className="card" style={{
                    background: C.white, borderRadius: 14, padding: 22,
                    border: `1px solid ${C.border}`,
                    boxShadow: "0 2px 8px rgba(28,61,46,0.07)",
                  }}>
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "flex-start", marginBottom: 12,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Avatar name={a.name} />
                        <div>
                          <div style={{ fontWeight: "bold", color: C.text, fontSize: 16 }}>
                            {a.name}
                          </div>
                          <div style={{ color: C.muted, fontSize: 13 }}>{a.email}</div>
                        </div>
                      </div>
                      <button onClick={() => openModal("addAthlete", { ...a })} style={{
                        background: "none", border: "none",
                        cursor: "pointer", color: C.muted, fontSize: 15, padding: 4,
                      }}>
                        ✏️
                      </button>
                    </div>

                    <div style={{ color: C.muted, fontSize: 13, marginBottom: 14 }}>
                      📞 {a.phone}
                    </div>

                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", marginBottom: 10,
                      }}>
                        <span style={{ fontSize: 13, color: C.text, fontWeight: "bold" }}>
                          Gear ({athleteGear.length})
                          {forSaleCount > 0 && (
                            <span style={{ color: C.pineGreen, fontWeight: "normal" }}>
                              {" "}· {forSaleCount} for sale
                            </span>
                          )}
                        </span>
                        <button onClick={() => openModal("addGear", { athleteId: a.id })} style={{
                          fontSize: 12, padding: "4px 10px",
                          background: C.softGreen,
                          border: "1px solid rgba(45,106,79,0.25)",
                          borderRadius: 6, cursor: "pointer",
                          color: C.pineGreen, fontFamily: "inherit",
                        }}>
                          + Add Gear
                        </button>
                      </div>

                      {athleteGear.length === 0 && (
                        <div style={{ color: C.border, fontSize: 13 }}>No gear yet</div>
                      )}
                      {athleteGear.map(g => (
                        <div key={g.id} onClick={() => openModal("viewGear", g)} style={{
                          display: "flex", alignItems: "center",
                          justifyContent: "space-between",
                          padding: "7px 10px", borderRadius: 8,
                          cursor: "pointer", background: C.snowBg,
                          marginBottom: 4, border: `1px solid ${C.border}`,
                        }}>
                          <span style={{ fontSize: 13, color: C.text }}>
                            {typeIcons[g.type]} {g.brand} — {g.description}
                          </span>
                          {g.forSale && (
                            <span style={{
                              background: C.softGreen, color: C.pineGreen,
                              fontSize: 11, padding: "2px 7px", borderRadius: 4,
                              fontWeight: "bold", flexShrink: 0, marginLeft: 6,
                            }}>
                              ${g.price}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      {modal && (
        <div onClick={closeModal} style={{
          position: "fixed", inset: 0,
          background: "rgba(15,35,24,0.52)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: 20,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: C.white, borderRadius: 16, padding: 28,
            width: "100%", maxWidth: 440,
            boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
            maxHeight: "90vh", overflowY: "auto",
          }}>

            {/* View Gear */}
            {modal === "viewGear" && (() => {
              const g     = form;
              const owner = athletes.find(a => a.id === g.athleteId);
              return (
                <div>
                  <ModalHeader
                    title={`${g.brand} ${g.type}`}
                    onClose={closeModal}
                    icon={<span style={{ fontSize: 36 }}>{typeIcons[g.type]}</span>}
                  />
                  <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
                    {[
                      ["Description", g.description],
                      ["Size",        g.size],
                      ["Status",      g.forSale ? `For Sale — $${g.price}` : "Not for sale"],
                      ["Owner",       owner?.name],
                    ].map(([k, v]) => <InfoRow key={k} label={k} value={v} />)}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <GreenButton onClick={() => openModal("addGear", { ...g })} style={{ flex: 1 }}>
                      Edit
                    </GreenButton>
                    <DangerButton onClick={() => deleteItem("gear", g.id)}>
                      Delete
                    </DangerButton>
                  </div>
                </div>
              );
            })()}

            {/* Add / Edit Athlete */}
            {modal === "addAthlete" && (
              <div>
                <ModalHeader title={`${form.id ? "Edit" : "Add"} Athlete`} onClose={closeModal} />
                {[["name", "Name *"], ["email", "Email *"], ["phone", "Phone"]].map(([k, label]) => (
                  <FieldRow key={k} label={label}>
                    <input
                      value={form[k] || ""}
                      onChange={e => setForm({ ...form, [k]: e.target.value })}
                      style={inputStyle}
                    />
                  </FieldRow>
                ))}
                <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                  <GreenButton onClick={saveAthlete} style={{ flex: 1 }}>Save</GreenButton>
                  {form.id && (
                    <DangerButton onClick={() => deleteItem("athlete", form.id)}>Delete</DangerButton>
                  )}
                </div>
              </div>
            )}

            {/* Add / Edit Gear */}
            {modal === "addGear" && (
              <div>
                <ModalHeader title={`${form.id ? "Edit" : "Add"} Gear`} onClose={closeModal} />

                <FieldRow label="Owner *">
                  <select
                    value={form.athleteId || ""}
                    onChange={e => setForm({ ...form, athleteId: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">Select athlete…</option>
                    {athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </FieldRow>

                <FieldRow label="Type *">
                  <select
                    value={form.type || ""}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">Select type…</option>
                    {GEAR_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </FieldRow>

                {[["brand", "Brand *"], ["description", "Description"], ["size", "Size"]].map(([k, label]) => (
                  <FieldRow key={k} label={label}>
                    <input
                      value={form[k] || ""}
                      onChange={e => setForm({ ...form, [k]: e.target.value })}
                      style={inputStyle}
                    />
                  </FieldRow>
                ))}

                <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="checkbox" id="forsale"
                    checked={!!form.forSale}
                    onChange={e => setForm({ ...form, forSale: e.target.checked })}
                    style={{ accentColor: C.pineGreen, width: 16, height: 16 }}
                  />
                  <label htmlFor="forsale" style={{ fontSize: 14, color: C.text, cursor: "pointer" }}>
                    Listed for sale
                  </label>
                </div>

                {form.forSale && (
                  <FieldRow label="Price ($)">
                    <input
                      type="number" value={form.price || ""}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      style={inputStyle}
                    />
                  </FieldRow>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                  <GreenButton onClick={saveGear} style={{ flex: 1 }}>Save</GreenButton>
                  {form.id && (
                    <DangerButton onClick={() => deleteItem("gear", form.id)}>Delete</DangerButton>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
