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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate/15">
        <div>
          <h1 className="font-mono text-xl font-bold tracking-wider uppercase text-cream">
            Manage Projects
          </h1>
          <p className="font-mono text-xs text-slate mt-1">
            Add or edit portfolio projects
          </p>
        </div>
        <button 
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2 bg-teal/10 text-teal hover:bg-teal/20 border border-teal/20 rounded-lg font-mono text-sm transition-colors"
        >
          <VscAdd size={16} />
          New Project
        </button>
      </div>

      <div className="bg-surface/30 rounded-xl border border-slate/15 overflow-hidden">
        <table className="w-full text-left font-mono text-sm">
          <thead className="bg-surface/50 border-b border-slate/15 text-slate">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium hidden md:table-cell">Description</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate/15">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate">
                  No projects found.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-surface/40 transition-colors group">
                  <td className="p-4 text-cream font-bold">{project.name}</td>
                  <td className="p-4 text-slate hidden md:table-cell truncate max-w-xs">
                    {project.description}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenEdit(project.id)} className="p-2 hover:bg-teal/10 hover:text-teal rounded transition-colors text-slate">
                        <VscEdit size={16} />
                      </button>
                      <button onClick={() => handleDelete(project.id)} className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded transition-colors text-slate">
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
          <div className="bg-surface border border-slate/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate/15 sticky top-0 bg-surface z-10">
              <h2 className="font-mono text-lg font-bold text-cream">
                {editingId ? "Edit Project" : "New Project"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate hover:text-cream transition-colors">
                <VscClose size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 font-mono text-sm">
              {error && <div className="p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">{error}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate">Name *</label>
                  <input required name="name" defaultValue={editingProject?.name} className="w-full bg-ink border border-slate/20 rounded-lg p-3 text-cream focus:border-teal outline-none transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate">Eyebrow (Subtitle) *</label>
                  <input required name="eyebrow" defaultValue={editingProject?.eyebrow} className="w-full bg-ink border border-slate/20 rounded-lg p-3 text-cream focus:border-teal outline-none transition-colors" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate">Description *</label>
                <textarea required name="description" rows={3} defaultValue={editingProject?.description} className="w-full bg-ink border border-slate/20 rounded-lg p-3 text-cream focus:border-teal outline-none transition-colors" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate">Tags (comma separated)</label>
                  <input name="tags" defaultValue={editingProject?.tags?.join(", ")} className="w-full bg-ink border border-slate/20 rounded-lg p-3 text-cream focus:border-teal outline-none transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate">Status (e.g. In Progress)</label>
                  <input name="status" defaultValue={editingProject?.status} className="w-full bg-ink border border-slate/20 rounded-lg p-3 text-cream focus:border-teal outline-none transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate">Image URL</label>
                  <input name="image" defaultValue={editingProject?.image} className="w-full bg-ink border border-slate/20 rounded-lg p-3 text-cream focus:border-teal outline-none transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate">Sort Order</label>
                  <input type="number" name="sort_order" defaultValue={editingProject?.sort_order || 0} className="w-full bg-ink border border-slate/20 rounded-lg p-3 text-cream focus:border-teal outline-none transition-colors" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-lg border border-slate/20 text-slate hover:text-cream transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-3 rounded-lg bg-teal text-ink font-bold hover:bg-teal/90 transition-colors disabled:opacity-50">
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
