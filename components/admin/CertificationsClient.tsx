"use client";

import { useState } from "react";
import { VscAdd, VscEdit, VscTrash, VscClose } from "react-icons/vsc";
import { createCertification, updateCertification, deleteCertification } from "@/app/admin/actions";

export default function CertificationsClient({ initialCertifications }: { initialCertifications: any[] }) {
  const [certifications] = useState(initialCertifications);
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
    if (!confirm("Are you sure you want to delete this certification?")) return;
    try {
      await deleteCertification(id);
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
      issuer: formData.get("issuer") as string,
      date: formData.get("date") as string,
      link: formData.get("link") as string,
      icon: formData.get("icon") as string,
      sort_order: parseInt(formData.get("sort_order") as string) || 0,
    };

    try {
      if (editingId) {
        await updateCertification(editingId, data);
      } else {
        await createCertification(data);
      }
      setIsModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editingCert = editingId ? certifications.find((c) => c.id === editingId) : null;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-mono text-xl font-bold tracking-tighter text-cream">
          Certifications
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
        {certifications.length === 0 ? (
          <p className="text-center text-cream/20 font-mono text-sm py-16">
            No certifications yet.
          </p>
        ) : (
          certifications.map((cert) => (
            <div
              key={cert.id}
              className="flex py-4 border-b border-cream/5 group"
            >
              <div className="min-w-0">
                <span className="font-mono text-sm font-bold text-cream">
                  {cert.name}
                </span>
                <span className="font-mono text-xs text-cream/20 ml-3">
                  {cert.issuer}
                </span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0 ml-4">
                <button
                  onClick={() => handleOpenEdit(cert.id)}
                  className="p-1.5 text-cream/20 hover:text-cream transition-colors duration-300"
                >
                  <VscEdit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="p-1.5 text-cream/20 hover:text-red-400 transition-colors duration-300"
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
          <div className="bg-ink border border-cream/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between p-6 border-b border-cream/5 sticky top-0 bg-surface/90 backdrop-blur-md z-10">
              <h2 className="font-mono text-sm font-bold text-cream tracking-tight">
                {editingId ? "Edit Certification" : "New Certification"}
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
                  <input required name="name" defaultValue={editingCert?.name} className="w-full bg-transparent border-b border-cream/10 px-0 py-2.5 text-cream outline-none transition-colors duration-300 focus:border-cream/30 placeholder:text-cream/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-cream/30 text-xs font-medium uppercase tracking-widest">Issuer *</label>
                  <input required name="issuer" defaultValue={editingCert?.issuer} className="w-full bg-transparent border-b border-cream/10 px-0 py-2.5 text-cream outline-none transition-colors duration-300 focus:border-cream/30 placeholder:text-cream/10" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-cream/30 text-xs font-medium uppercase tracking-widest">Date *</label>
                  <input required name="date" defaultValue={editingCert?.date} className="w-full bg-transparent border-b border-cream/10 px-0 py-2.5 text-cream outline-none transition-colors duration-300 focus:border-cream/30 placeholder:text-cream/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-cream/30 text-xs font-medium uppercase tracking-widest">Link (Optional)</label>
                  <input name="link" defaultValue={editingCert?.link} className="w-full bg-transparent border-b border-cream/10 px-0 py-2.5 text-cream outline-none transition-colors duration-300 focus:border-cream/30 placeholder:text-cream/10" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-cream/30 text-xs font-medium uppercase tracking-widest">Icon (Optional)</label>
                  <input name="icon" defaultValue={editingCert?.icon} className="w-full bg-transparent border-b border-cream/10 px-0 py-2.5 text-cream outline-none transition-colors duration-300 focus:border-cream/30 placeholder:text-cream/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-cream/30 text-xs font-medium uppercase tracking-widest">Sort Order</label>
                  <input type="number" name="sort_order" defaultValue={editingCert?.sort_order || 0} className="w-full bg-transparent border-b border-cream/10 px-0 py-2.5 text-cream outline-none transition-colors duration-300 focus:border-cream/30 placeholder:text-cream/10" />
                </div>
              </div>

              <div className="pt-8 flex justify-end gap-4 border-t border-cream/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-lg text-cream/30 hover:text-cream transition-colors duration-300">
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
