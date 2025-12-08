import React, { useEffect, useState } from "react";
import PowerProvider from "./PowerProvider";
import { SharepointCrudformService } from "./generated/services/SharepointCrudformService";
import type { SharepointCrudform } from "./generated/models/SharepointCrudformModel";

export function App() {
  const [items, setItems] = useState<SharepointCrudform[]>([]);
  const [formData, setFormData] = useState<Partial<SharepointCrudform>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadItems = async () => {
    const res = await SharepointCrudformService.getAll();
    if (res.data) setItems(res.data);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.Title) {
      await SharepointCrudformService.create(formData as SharepointCrudform);
      setFormData({});
      loadItems();
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId && formData.Title) {
      await SharepointCrudformService.update(editingId, formData as SharepointCrudform);
      setEditingId(null);
      setFormData({});
      loadItems();
    }
  };

  const handleDelete = async (id: string) => {
    await SharepointCrudformService.delete(id);
    loadItems();
  };

  const startEdit = (item: SharepointCrudform) => {
    setEditingId(String(item.ID));
    setFormData(item);
  };

  return (
    <PowerProvider>
      <div style={{ padding: "20px" }}>
        <h1>CRUD with SharePoint List</h1>
        
        {/* Create/Edit Form */}
        <form onSubmit={editingId ? handleUpdate : handleCreate} style={{ marginBottom: "20px" }}>
          <input
            placeholder="Title"
            value={formData.Title || ""}
            onChange={(e) => setFormData({ ...formData, Title: e.target.value })}
            required
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <button type="submit" style={{ padding: "5px 10px" }}>
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setFormData({}); }} style={{ padding: "5px 10px", marginLeft: "10px" }}>
              Cancel
            </button>
          )}
        </form>

        {/* Items List */}
        <ul>
          {items.map((item) => (
            <li key={String(item.ID)} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span>{item.Title}</span>
              <div>
                <button onClick={() => startEdit(item)} style={{ padding: "5px", marginRight: "5px" }}>Edit</button>
                <button onClick={() => handleDelete(String(item.ID))} style={{ padding: "5px" }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </PowerProvider>
  );
}
