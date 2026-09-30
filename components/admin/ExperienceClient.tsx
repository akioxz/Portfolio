"use client";

import { useState } from "react";
import { VscAdd, VscEdit, VscTrash, VscClose } from "react-icons/vsc";
import { createExperience, updateExperience, deleteExperience } from "@/app/admin/actions";

export default function ExperienceClient({ initialExperience }: { initialExperience: any[] }) {
  const [experience] = useState(initialExperience);
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
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteExperience(id);
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    
    try {
      if (editingId) {
        await updateExperience(editingId, formData);
      } else {
        await createExperience(formData);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editingJob = editingId ? experience.find(p => p.id === editingId) : null;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-mono text-xl font-bold tracking-tighter text-cream">
          Experience
        </h1>
        <button
          onClick={handleOpenNew}
          className="font-mono text-xs text-cream/40 hover:text-cream transition-colors duration-300 flex items-center gap-1"
        >
          <VscAdd size={14} />
          Add
        </button>
      </div>

      <div>
        {experience.length === 0 ? (
          <p className="text-center text-cream/20 font-mono text-sm py-16">
            No experience found.
          </p>
        ) : (
          experience.map((job) => (
            <div key={job.id} className="grid grid-cols-12 gap-4 items-center w-full min-w-0 py-3 border-b border-cream/5 group">
                <div className="col-span-10 md:col-span-4">
                  <span className="font-mono text-sm font-bold text-cream truncate block">{job.role}</span>
                </div>
                <div className="hidden md:block md:col-span-6">
                  <span className="font-mono text-sm text-cream/20 truncate block">{job.project}</span>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={() => handleOpenEdit(job.id)} className="p-1.5 hover:text-cream transition-colors duration-300 text-cream/20">
                  <VscEdit size={14} />
                </button>
                <button onClick={() => handleDelete(job.id)} className="p-1.5 hover:text-red-400 transition-colors duration-300 text-cream/20">
                  <VscTrash size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-2xl">
          <div className="bg-ink border border-cream/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between p-6 border-b border-cream/5 sticky top-0 bg-surface/90 backdrop-blur-md z-10">
              <h2 className="font-mono text-lg font-bold text-cream tracking-tight">
                {editingId ? "Edit Role" : "New Role"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-cream/20 hover:text-cream transition-colors duration-300">
                <VscClose size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 font-mono text-sm">
              {error && <div className="p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">{error}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-cream/20 text-xs font-medium uppercase tracking-widest">Role Title *</label>
                  <input required name="role" defaultValue={editingJob?.role} className="w-full bg-transparent border-b border-cream/10 py-3 text-cream outline-none transition-all duration-300 focus:border-cream/30" />
                </div>
                <div className="space-y-2">
                  <label className="text-cream/20 text-xs font-medium uppercase tracking-widest">Company/Project Name *</label>
                  <input required name="project" defaultValue={editingJob?.project} className="w-full bg-transparent border-b border-cream/10 py-3 text-cream outline-none transition-all duration-300 focus:border-cream/30" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-cream/20 text-xs font-medium uppercase tracking-widest">Year *</label>
                  <input required name="year" defaultValue={editingJob?.year} className="w-full bg-transparent border-b border-cream/10 py-3 text-cream outline-none transition-all duration-300 focus:border-cream/30" />
                </div>
                <div className="space-y-2">
                  <label className="text-cream/20 text-xs font-medium uppercase tracking-widest">Subtitle (e.g. Full-time) *</label>
                  <input required name="subtitle" defaultValue={editingJob?.subtitle} className="w-full bg-transparent border-b border-cream/10 py-3 text-cream outline-none transition-all duration-300 focus:border-cream/30" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-cream/20 text-xs font-medium uppercase tracking-widest">Description *</label>
                <textarea required name="description" rows={3} defaultValue={editingJob?.description} className="w-full bg-transparent border-b border-cream/10 py-3 text-cream outline-none transition-all duration-300 focus:border-cream/30" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-cream/20 text-xs font-medium uppercase tracking-widest">Tags (comma separated)</label>
                  <input name="tags" defaultValue={editingJob?.tags?.join(", ")} className="w-full bg-transparent border-b border-cream/10 py-3 text-cream outline-none transition-all duration-300 focus:border-cream/30" />
                </div>
                <div className="space-y-2">
                  <label className="text-cream/20 text-xs font-medium uppercase tracking-widest">Sort Order</label>
                  <input type="number" name="sort_order" defaultValue={editingJob?.sort_order || 0} className="w-full bg-transparent border-b border-cream/10 py-3 text-cream outline-none transition-all duration-300 focus:border-cream/30" />
                </div>
              </div>

              <div className="pt-8 flex justify-end gap-4 border-t border-cream/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-lg text-cream/20 hover:text-cream transition-colors duration-300">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-lg bg-cream text-ink font-bold hover:hover:bg-white transition-all duration-300 active:scale-[0.98] disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
