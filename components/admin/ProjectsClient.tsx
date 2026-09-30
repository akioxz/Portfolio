"use client";

import { useState } from "react";
import { VscAdd, VscEdit, VscTrash, VscClose } from "react-icons/vsc";
import { createProject, updateProject, deleteProject } from "@/app/admin/actions";

export default function ProjectsClient({ initialProjects }: { initialProjects: any[] }) {
  const [projects] = useState(initialProjects);
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
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
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
        await updateProject(editingId, formData);
      } else {
        await createProject(formData);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editingProject = editingId ? projects.find(p => p.id === editingId) : null;

  return (
    <>
      <div className="flex items-center justify-between pb-6 mb-2">
        <h1 className="font-mono text-xl font-bold tracking-tighter text-cream">
          Projects
        </h1>
        <button 
          onClick={handleOpenNew}
          className="flex items-center gap-1.5 font-mono text-xs text-cream/40 hover:text-cream transition-colors duration-300"
        >
          <VscAdd size={14} />
          Add
        </button>
      </div>

      <div>
        {projects.length === 0 ? (
          <p className="py-16 text-center font-mono text-sm text-cream/20">
            No projects yet.
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between py-4 border-b border-cream/5 group"
            >
              <div className="min-w-0">
                <span className="font-mono text-sm font-bold text-cream">
                  {project.name}
                </span>
                <p className="font-mono text-xs text-cream/20 truncate max-w-xs mt-0.5">
                  {project.description}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0 ml-4">
                <button onClick={() => handleOpenEdit(project.id)} className="p-1.5 text-cream/20 hover:text-cream transition-colors duration-300">
                  <VscEdit size={14} />
                </button>
                <button onClick={() => handleDelete(project.id)} className="p-1.5 text-cream/20 hover:text-red-400 transition-colors duration-300">
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
              <h2 className="font-mono text-sm font-bold text-cream tracking-tight">
                {editingId ? "Edit Project" : "New Project"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-cream/20 hover:text-cream transition-colors duration-300">
                <VscClose size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 font-mono text-sm">
              {error && <div className="p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">{error}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-cream/30 text-xs font-medium uppercase tracking-widest">Name *</label>
                  <input required name="name" defaultValue={editingProject?.name} className="w-full bg-transparent border-b border-cream/10 py-2.5 text-cream outline-none transition-all duration-300 focus:border-cream/30 placeholder:text-cream/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-cream/30 text-xs font-medium uppercase tracking-widest">Eyebrow (Subtitle) *</label>
                  <input required name="eyebrow" defaultValue={editingProject?.eyebrow} className="w-full bg-transparent border-b border-cream/10 py-2.5 text-cream outline-none transition-all duration-300 focus:border-cream/30 placeholder:text-cream/10" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-cream/30 text-xs font-medium uppercase tracking-widest">Description *</label>
                <textarea required name="description" rows={3} defaultValue={editingProject?.description} className="w-full bg-transparent border-b border-cream/10 py-2.5 text-cream outline-none transition-all duration-300 focus:border-cream/30 placeholder:text-cream/10 resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-cream/30 text-xs font-medium uppercase tracking-widest">Tags (comma separated)</label>
                  <input name="tags" defaultValue={editingProject?.tags?.join(", ")} className="w-full bg-transparent border-b border-cream/10 py-2.5 text-cream outline-none transition-all duration-300 focus:border-cream/30 placeholder:text-cream/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-cream/30 text-xs font-medium uppercase tracking-widest">Status (e.g. In Progress)</label>
                  <input name="status" defaultValue={editingProject?.status} className="w-full bg-transparent border-b border-cream/10 py-2.5 text-cream outline-none transition-all duration-300 focus:border-cream/30 placeholder:text-cream/10" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-cream/30 text-xs font-medium uppercase tracking-widest">Image URL</label>
                  <input name="image" defaultValue={editingProject?.image} className="w-full bg-transparent border-b border-cream/10 py-2.5 text-cream outline-none transition-all duration-300 focus:border-cream/30 placeholder:text-cream/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-cream/30 text-xs font-medium uppercase tracking-widest">Sort Order</label>
                  <input type="number" name="sort_order" defaultValue={editingProject?.sort_order || 0} className="w-full bg-transparent border-b border-cream/10 py-2.5 text-cream outline-none transition-all duration-300 focus:border-cream/30 placeholder:text-cream/10" />
                </div>
              </div>

              <div className="pt-8 flex justify-end gap-4 border-t border-cream/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 font-mono text-xs text-cream/40 hover:text-cream transition-colors duration-300">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 rounded-lg bg-cream text-ink font-bold hover:hover:bg-white transition-all duration-300 active:scale-[0.98] disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
