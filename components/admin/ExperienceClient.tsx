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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-white/5">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-tighter uppercase text-cream">
            Manage Experience
          </h1>
          <p className="font-mono text-[10px] text-slate mt-1.5 uppercase tracking-widest font-medium">
            Add or edit work history
          </p>
        </div>
        <button 
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-cream hover:bg-white/15 border border-white/5 rounded-lg font-mono text-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]"
        >
          <VscAdd size={16} />
          New Role
        </button>
      </div>

      <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left font-mono text-sm">
          <thead className="bg-white/5 border-b border-white/5 text-slate">
            <tr>
              <th className="p-5 font-medium">Role</th>
              <th className="p-5 font-medium hidden md:table-cell">Company</th>
              <th className="p-5 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {experience.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-12 text-center text-slate">
                  No experience found.
                </td>
              </tr>
            ) : (
              experience.map((job) => (
                <tr key={job.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-5 text-cream font-bold">{job.role}</td>
                  <td className="p-5 text-slate hidden md:table-cell">
                    {job.project}
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button onClick={() => handleOpenEdit(job.id)} className="p-2 hover:bg-white/10 hover:text-cream rounded-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.90] text-slate">
                        <VscEdit size={16} />
                      </button>
                      <button onClick={() => handleDelete(job.id)} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.90] text-slate">
                        <VscTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xl">
          <div className="bg-ink border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-ink/90 backdrop-blur-md z-10">
              <h2 className="font-mono text-lg font-bold text-cream tracking-tight">
                {editingId ? "Edit Role" : "New Role"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate hover:text-cream transition-colors duration-300">
                <VscClose size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 font-mono text-sm">
              {error && <div className="p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">{error}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-slate text-xs font-medium uppercase tracking-widest">Role Title *</label>
                  <input required name="role" defaultValue={editingJob?.role} className="w-full bg-white/5 border border-white/5 rounded-lg p-3.5 text-cream outline-none transition-all duration-300 focus:bg-white/10 focus:border-white/20 focus:ring-1 focus:ring-white/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-slate text-xs font-medium uppercase tracking-widest">Company/Project Name *</label>
                  <input required name="project" defaultValue={editingJob?.project} className="w-full bg-white/5 border border-white/5 rounded-lg p-3.5 text-cream outline-none transition-all duration-300 focus:bg-white/10 focus:border-white/20 focus:ring-1 focus:ring-white/20" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-slate text-xs font-medium uppercase tracking-widest">Year *</label>
                  <input required name="year" defaultValue={editingJob?.year} className="w-full bg-white/5 border border-white/5 rounded-lg p-3.5 text-cream outline-none transition-all duration-300 focus:bg-white/10 focus:border-white/20 focus:ring-1 focus:ring-white/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-slate text-xs font-medium uppercase tracking-widest">Subtitle (e.g. Full-time) *</label>
                  <input required name="subtitle" defaultValue={editingJob?.subtitle} className="w-full bg-white/5 border border-white/5 rounded-lg p-3.5 text-cream outline-none transition-all duration-300 focus:bg-white/10 focus:border-white/20 focus:ring-1 focus:ring-white/20" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-slate text-xs font-medium uppercase tracking-widest">Description *</label>
                <textarea required name="description" rows={3} defaultValue={editingJob?.description} className="w-full bg-white/5 border border-white/5 rounded-lg p-3.5 text-cream outline-none transition-all duration-300 focus:bg-white/10 focus:border-white/20 focus:ring-1 focus:ring-white/20" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-slate text-xs font-medium uppercase tracking-widest">Tags (comma separated)</label>
                  <input name="tags" defaultValue={editingJob?.tags?.join(", ")} className="w-full bg-white/5 border border-white/5 rounded-lg p-3.5 text-cream outline-none transition-all duration-300 focus:bg-white/10 focus:border-white/20 focus:ring-1 focus:ring-white/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-slate text-xs font-medium uppercase tracking-widest">Sort Order</label>
                  <input type="number" name="sort_order" defaultValue={editingJob?.sort_order || 0} className="w-full bg-white/5 border border-white/5 rounded-lg p-3.5 text-cream outline-none transition-all duration-300 focus:bg-white/10 focus:border-white/20 focus:ring-1 focus:ring-white/20" />
                </div>
              </div>

              <div className="pt-8 flex justify-end gap-4 border-t border-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-lg text-slate hover:text-cream hover:bg-white/5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-lg bg-cream text-ink font-bold hover:bg-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
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
