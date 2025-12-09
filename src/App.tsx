import React, { useEffect, useState } from "react";
import PowerProvider from "./PowerProvider";
import { SharepointCrudformService } from "./generated/services/SharepointCrudformService";
import type { SharepointCrudform } from "./generated/models/SharepointCrudformModel";

export function App() {
  const [isDark, setIsDark] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<"list" | "form">("list");
  const [items, setItems] = useState<SharepointCrudform[]>([]);
  const [formData, setFormData] = useState<Partial<SharepointCrudform>>({
    Title: "",
    Description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const theme = isDark
    ? {
        bg: "#0f0f23",
        surface: "#1e1b4b",
        card: "#1e293b",
        text: "#f1f5f9",
        textSecondary: "#94a3b8",
        border: "#334155",
        primary: "#60a5fa",
        primaryHover: "#3b82f6",
        success: "#34d399",
        danger: "#f87171",
        heading: "#60a5fa",
        shadow:
          "0 4px 6px -1px rgba(0, 0,0, 0.2), 0 2px 4px -1px rgba(0, 0,0, 0.1)",
      }
    : {
        bg: "#e5e7eb",
        surface: "#ffffff",
        card: "#ffffff",
        text: "#0f172a",
        textSecondary: "#64748b",
        border: "#e2e8f0",
        primary: "#3b82f6",
        primaryHover: "#2563eb",
        success: "#10b981",
        danger: "#ef4444",
        heading: "#1d4ed8",
      };

  const loadItems = async () => {
    setLoading(true);
    try {
      console.log("Calling SharepointCrudformService.getAll...");
      const res = await SharepointCrudformService.getAll();
      console.log("getAll result", res);
      setItems(res.data || []);
    } catch (err) {
      console.error("getAll error", err);
      alert("Failed to load items. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.Title?.trim()) {
      alert("Title is required!");
      return;
    }

    console.log("Submitting payload", formData);

    setLoading(true);
    try {
      if (editingId) {
        console.log("Calling SharepointCrudformService.update...");
        const res = await SharepointCrudformService.update(
          editingId,
          formData as any
        );
        console.log("Update result", res);
      } else {
        console.log("Calling SharepointCrudformService.create...");
        const res = await SharepointCrudformService.create(formData as any);
        console.log("Create result", res);
      }
      resetForm();
      setCurrentScreen("list");
      await loadItems();
    } catch (err) {
      console.error("Create/Update error", err);
      alert("Create/Update failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: SharepointCrudform) => {
    setFormData({
      Title: item.Title || "",
      Description: item.Description || "",
    });
    setEditingId(String(item.ID));
    setCurrentScreen("form");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this item?")) {
      try {
        console.log("Calling SharepointCrudformService.delete...", id);
        const res = await SharepointCrudformService.delete(id);
        console.log("Delete result", res);
        await loadItems();
      } catch (err) {
        console.error("Delete error", err);
        alert("Delete failed. Check console for details.");
      }
    }
  };

  const resetForm = () => {
    setFormData({ Title: "", Description: "" });
    setEditingId(null);
  };

  const buttonPrimaryStyle: React.CSSProperties = {
    padding: "0.875rem 2rem",
    backgroundColor: theme.primary,
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: theme.shadow,
    transition: "all 0.2s ease",
  };

  const buttonDangerStyle: React.CSSProperties = {
    padding: "0.875rem 1.5rem",
    backgroundColor: theme.danger,
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.875rem",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: theme.shadow,
    transition: "all 0.2s ease",
  };

  if (currentScreen === "list") {
    return (
      <PowerProvider>
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: theme.bg,
            color: theme.text,
            padding: "2rem 1rem",
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              backgroundColor: theme.surface,
              borderRadius: "24px",
              boxShadow: theme.shadow,
              padding: "2rem 2rem 3rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2.5rem",
                paddingBottom: "1.5rem",
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: "2.25rem",
                    fontWeight: 800,
                    color: theme.heading,
                    margin: "0 0 0.25rem 0",
                  }}
                >
                  SharePoint Dashboard
                </h1>
              </div>
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <button
                  onClick={() => {
                    resetForm();
                    setCurrentScreen("form");
                  }}
                  style={buttonPrimaryStyle}
                >
                  ➕ New Item
                </button>
                <button
                  onClick={() => setIsDark(!isDark)}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.card,
                    color: theme.text,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    transition: "all 0.2s ease",
                    boxShadow: theme.shadow,
                  }}
                >
                  {isDark ? "☀️" : "🌙"}
                </button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2.5rem",
              }}
            >
              <div
                style={{
                  backgroundColor: theme.card,
                  padding: "1.5rem 2rem",
                  borderRadius: "16px",
                  border: `1px solid ${theme.border}`,
                  boxShadow: theme.shadow,
                }}
              >
                <div
                  style={{
                    color: theme.textSecondary,
                    fontSize: "0.875rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  Total Items
                </div>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  {items.length}
                </div>
              </div>
            </div>

            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "400px",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    border: `4px solid ${theme.border}`,
                    borderTop: `4px solid ${theme.primary}`,
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    marginBottom: "1rem",
                  }}
                />
                <p
                  style={{
                    color: theme.textSecondary,
                    fontSize: "1.1rem",
                  }}
                >
                  Loading items...
                </p>
              </div>
            ) : items.length === 0 ? (
              <div
                style={{
                  backgroundColor: theme.card,
                  padding: "4rem 2rem",
                  borderRadius: "20px",
                  border: `1px solid ${theme.border}`,
                  textAlign: "center",
                  boxShadow: theme.shadow,
                }}
              >
                <div
                  style={{
                    fontSize: "4rem",
                    color: theme.textSecondary,
                    marginBottom: "1rem",
                  }}
                >
                  📭
                </div>
                <h3
                  style={{
                    color: theme.text,
                    margin: "0 0 0.5rem 0",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                  }}
                >
                  No items yet
                </h3>
                <p
                  style={{
                    color: theme.textSecondary,
                    marginBottom: "2rem",
                  }}
                >
                  Get started by creating your first item
                </p>
                <button
                  onClick={() => setCurrentScreen("form")}
                  style={buttonPrimaryStyle}
                >
                  ➕ Create First Item
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(380px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {items.map((item) => (
                  <div
                    key={String(item.ID)}
                    style={{
                      backgroundColor: theme.card,
                      borderRadius: "20px",
                      padding: "2rem",
                      border: `1px solid ${theme.border}`,
                      boxShadow: theme.shadow,
                      transition:
                        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "default",
                    }}
                    onMouseOver={(
                      e: React.MouseEvent<HTMLDivElement>
                    ) => {
                      const target = e.currentTarget;
                      target.style.transform = "translateY(-4px)";
                      target.style.boxShadow =
                        "0 20px 40px rgba(0,0,0,0.1)";
                    }}
                    onMouseOut={(
                      e: React.MouseEvent<HTMLDivElement>
                    ) => {
                      const target = e.currentTarget;
                      target.style.transform = "translateY(0)";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            color: theme.text,
                            marginBottom: "1rem",
                            lineHeight: 1.3,
                          }}
                        >
                          {item.Title}
                        </h3>
                        {item.Description && (
                          <p
                            style={{
                              color: theme.textSecondary,
                              lineHeight: 1.6,
                              marginBottom: "1.5rem",
                              fontSize: "1rem",
                            }}
                          >
                            {item.Description}
                          </p>
                        )}
                        <div
                          style={{
                            display: "flex",
                            gap: "1.5rem",
                            fontSize: "0.875rem",
                            color: theme.textSecondary,
                          }}
                        >
                          <span>ID: {item.ID}</span>
                          <span>
                            {new Date(
                              item.Created || Date.now()
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          flexShrink: 0,
                        }}
                      >
                        <button
                          onClick={() => handleEdit(item)}
                          style={buttonPrimaryStyle}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(String(item.ID))
                          }
                          style={buttonDangerStyle}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            input:focus, textarea:focus, select:focus {
              outline: none;
              border-color: ${theme.primary} !important;
              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
            }
            button:hover:not(:disabled) {
              transform: translateY(-1px);
              box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }
          `}</style>
        </div>
      </PowerProvider>
    );
  }

  // FORM SCREEN
  return (
    <PowerProvider>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: theme.bg,
          color: theme.text,
          padding: "2rem 1rem",
          fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: theme.surface,
            borderRadius: "24px",
            boxShadow: theme.shadow,
            padding: "2rem 2rem 2.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "3rem",
              gap: "1rem",
            }}
          >
            <button
              onClick={() => setCurrentScreen("list")}
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.card,
                color: theme.text,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                fontWeight: 600,
                transition: "all 0.2s ease",
                boxShadow: theme.shadow,
              }}
            >
              ←
            </button>
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: theme.heading,
                  margin: "0 0 0.25rem 0",
                }}
              >
                {editingId ? "Edit Item" : "New Item"}
              </h1>
              <p style={{ color: theme.textSecondary, margin: 0 }}>
                {editingId
                  ? "Update item details"
                  : "Create new SharePoint item"}
              </p>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.card,
                color: theme.text,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                transition: "all 0.2s ease",
                boxShadow: theme.shadow,
              }}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>

          <div
            style={{
              backgroundColor: theme.card,
              padding: "2.5rem",
              borderRadius: "24px",
              border: `1px solid ${theme.border}`,
              boxShadow: theme.shadow,
            }}
          >
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "2rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.75rem",
                    fontWeight: 600,
                    color: theme.text,
                    fontSize: "1rem",
                  }}
                >
                  Title <span style={{ color: theme.danger }}>*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.Title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, Title: e.target.value })
                  }
                  placeholder="Enter item title"
                  style={{
                    width: "100%",
                    padding: "1rem 1.25rem",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "12px",
                    fontSize: "1rem",
                    backgroundColor: theme.card,
                    color: theme.text,
                    transition: "all 0.2s ease",
                    boxSizing: "border-box",
                  }}
                  disabled={loading}
                />
              </div>

              <div style={{ marginBottom: "2.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.75rem",
                    fontWeight: 600,
                    color: theme.text,
                    fontSize: "1rem",
                  }}
                >
                  Description
                </label>
                <textarea
                  value={formData.Description || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Description: e.target.value,
                    })
                  }
                  placeholder="Enter description (optional)"
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "1rem 1.25rem",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "12px",
                    fontSize: "1rem",
                    backgroundColor: theme.card,
                    color: theme.text,
                    resize: "vertical",
                    transition: "all 0.2s ease",
                    boxSizing: "border-box",
                    lineHeight: 1.6,
                    fontFamily: "inherit",
                  }}
                  disabled={loading}
                />
              </div>

              <div style={{ display: "flex", gap: "1.5rem" }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: "0.875rem 2rem",
                    backgroundColor: "transparent",
                    color: theme.textSecondary,
                    border: `1px solid ${theme.border}`,
                    borderRadius: "12px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.Title?.trim()}
                  style={{
                    padding: "0.875rem 2rem",
                    backgroundColor:
                      loading || !formData.Title?.trim()
                        ? theme.border
                        : theme.primary,
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor:
                      loading || !formData.Title?.trim()
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      loading || !formData.Title?.trim() ? 0.6 : 1,
                    boxShadow: theme.shadow,
                    transition: "all 0.2s ease",
                  }}
                >
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Update Item"
                    : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        input:focus, textarea:focus {
          outline: none;
          border-color: ${theme.primary} !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
      `}</style>
    </PowerProvider>
  );
}

export default App;
