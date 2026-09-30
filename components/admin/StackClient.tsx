"use client";

import { useState } from "react";
import { VscAdd, VscEdit, VscTrash, VscClose } from "react-icons/vsc";
import { createStack, updateStack, deleteStack } from "@/app/admin/actions";

export default function StackClient({ initialStack }: { initialStack: any[] }) {
  const [stack] = useState(initialStack);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleOpenNew = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      await deleteStack(id);
      window.location.reload();
    } catch (err: any) {
      alert("Error deleting: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      icon: formData.get("icon") as string,
      sort_order: parseInt(formData.get("sort_order") as string) || 0,
    };

    try {
      if (editingId) {
        await updateStack(editingId, data);
      } else {
        await createStack(data);
      }
      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editingSkill = editingId ? stack.find((s) => s.id === editingId) : null;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-mono text-xl font-bold tracking-tighter text-cream">
          Stack
        </h1>
        <button
          onClick={handleOpenNew}
          className="font-mono text-xs text-slate hover:text-cream transition-colors duration-300"
        >
          <VscAdd size={16} />
        </button>
      </div>

      <div>
        {stack.length === 0 ? (
          <p className="text-center text-slate font-mono text-sm py-16">
            No skills yet.
          </p>
        ) : (
          stack.map((skill) => (
            <div
              key={skill.id}
              className="flex py-3 border-b border-slate/20 group"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-bold text-cream">
                  {skill.name}
                </span>
                <span className="font-mono text-xs text-slate">
                  {skill.category}
                </span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleOpenEdit(skill.id)}
                  className="p-1.5 text-slate hover:text-cream transition-colors duration-300"
                >
                  <VscEdit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="p-1.5 text-slate hover:text-red-400 transition-colors duration-300"
                >
                  <VscTrash size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-2xl">
          <div className="bg-ink border border-slate/30 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between p-6 border-b border-slate/20 sticky top-0 bg-surface/90 backdrop-blur-md z-10">
              <h2 className="font-mono text-sm font-bold text-cream tracking-tight">
                {editingId ? "Edit Skill" : "New Skill"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate hover:text-cream transition-colors duration-300">
                <VscClose size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 font-mono text-sm">
              {error && <div className="p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">{error}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-slate text-xs font-medium uppercase tracking-widest">Name *</label>
                  <input required name="name" defaultValue={editingSkill?.name} className="w-full bg-transparent border-b border-slate/30 py-2.5 text-cream outline-none transition-all duration-300 focus:border-slate/50 placeholder:text-slate" />
                </div>
                <div className="space-y-2">
                  <label className="text-slate text-xs font-medium uppercase tracking-widest">Category *</label>
                  <input required name="category" defaultValue={editingSkill?.category} placeholder="e.g. Frontend, Backend" className="w-full bg-transparent border-b border-slate/30 py-2.5 text-cream outline-none transition-all duration-300 focus:border-slate/50 placeholder:text-slate" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-slate text-xs font-medium uppercase tracking-widest">Icon URL (Optional)</label>
                  <input name="icon" defaultValue={editingSkill?.icon} className="w-full bg-transparent border-b border-slate/30 py-2.5 text-cream outline-none transition-all duration-300 focus:border-slate/50 placeholder:text-slate" />
                </div>
                <div className="space-y-2">
                  <label className="text-slate text-xs font-medium uppercase tracking-widest">Sort Order</label>
                  <input type="number" name="sort_order" defaultValue={editingSkill?.sort_order || 0} className="w-full bg-transparent border-b border-slate/30 py-2.5 text-cream outline-none transition-all duration-300 focus:border-slate/50 placeholder:text-slate" />
                </div>
              </div>

              <div className="pt-8 flex justify-end gap-4 border-t border-slate/20">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-lg text-slate hover:text-cream transition-colors duration-300">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-lg bg-cream text-ink font-bold hover:hover:bg-white transition-all duration-300 active:scale-[0.98] disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
