"use client";

import { useState, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  Star,
  Pencil,
  Trash2,
  X,
  GripVertical,
  Image as ImageIcon,
  Loader2,
  Eye,
  Images,
} from "lucide-react";
import {
  createProject,
  updateProject,
  deleteProject,
  toggleFeatured,
  reorderProjects,
  addProjectImage,
} from "./actions";

const CATEGORIES = [
  "Construção",
  "Elétrica",
  "Hidráulica",
  "Acabamento",
  "Pisos",
  "Serralheria",
  "Marcenaria",
  "Jardinagem",
  "Limpeza",
  "Projeto",
  "Engenharia",
  "Tecnologia",
  "Climatização",
  "Pintura",
  "Gesso e Drywall",
  "Impermeabilização",
  "Telhados e Coberturas",
  "Reformas Gerais",
];

type ProjectImage = {
  id: string;
  cloudinary_url: string;
  order_in_project: number;
};

type Project = {
  id: string;
  title: string;
  category: string;
  city_executed: string | null;
  description: string | null;
  is_featured: boolean;
  display_order: number;
  view_count: number;
  portfolio_images: ProjectImage[];
};

type FormData = {
  title: string;
  category: string;
  city_executed: string;
  description: string;
  is_featured: boolean;
};

const EMPTY_FORM: FormData = {
  title: "",
  category: "Construção",
  city_executed: "",
  description: "",
  is_featured: false,
};

type Props = {
  initialProjects: Project[];
  featuredCount: number;
  cloudName: string;
};

function SortableProjectCard({
  project,
  featuredCount,
  onEdit,
  onDelete,
  onToggleFeatured,
}: {
  project: Project;
  featuredCount: number;
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, value: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const coverImage = project.portfolio_images?.[0]?.cloudinary_url;

  const canFeature = project.is_featured || featuredCount < 3;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-card shadow-card overflow-hidden group"
    >
      {/* Cover */}
      <div className="relative aspect-video bg-azul-claro overflow-hidden">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-azul-principal/30" />
          </div>
        )}

        {/* Featured star */}
        <button
          type="button"
          onClick={() => onToggleFeatured(project.id, !project.is_featured)}
          disabled={!canFeature && !project.is_featured}
          title={
            !canFeature
              ? "Máximo de 3 projetos em destaque"
              : project.is_featured
              ? "Remover destaque"
              : "Marcar em destaque"
          }
          className={`absolute top-2 left-2 p-1.5 rounded-full transition-colors ${
            project.is_featured
              ? "bg-amber-400 text-white"
              : "bg-white/80 text-gray-400 hover:text-amber-400 hover:bg-white"
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          <Star className={`w-4 h-4 ${project.is_featured ? "fill-current" : ""}`} />
        </button>

        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4 text-cinza-texto" />
        </div>

        {/* View count */}
        {project.view_count > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            <Eye className="w-3 h-3" />
            {project.view_count}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-azul-noite truncate">{project.title}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs bg-azul-claro text-azul-principal px-2 py-0.5 rounded-full">
                {project.category}
              </span>
              {project.city_executed && (
                <span className="text-xs text-cinza-texto truncate">{project.city_executed}</span>
              )}
            </div>
          </div>
        </div>

        {project.description && (
          <p className="mt-2 text-xs text-cinza-texto line-clamp-2">{project.description}</p>
        )}

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
          <span className="text-xs text-cinza-texto">
            {project.portfolio_images?.length ?? 0} foto(s)
          </span>
          <div className="flex gap-1 ml-auto">
            <button
              type="button"
              onClick={() => onEdit(project)}
              className="p-2 text-cinza-texto hover:text-azul-principal hover:bg-azul-claro rounded-lg transition-colors"
              title="Editar"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(project.id)}
              className="p-2 text-cinza-texto hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectModal({
  open,
  onClose,
  editProject,
  featuredCount,
  cloudName,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  editProject: Project | null;
  featuredCount: number;
  cloudName: string;
  onSuccess: (project: Project) => void;
}) {
  const [form, setForm] = useState<FormData>(
    editProject
      ? {
          title: editProject.title,
          category: editProject.category,
          city_executed: editProject.city_executed ?? "",
          description: editProject.description ?? "",
          is_featured: editProject.is_featured,
        }
      : EMPTY_FORM
  );
  const [images, setImages] = useState<string[]>(
    editProject?.portfolio_images?.map((i) => i.cloudinary_url) ?? []
  );
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const canFeature = form.is_featured || (editProject?.is_featured ? featuredCount <= 3 : featuredCount < 3);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);

    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "portfolio");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const { url, error: uploadError } = await res.json();
        if (uploadError) throw new Error(uploadError);
        uploaded.push(url);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch {
      setError("Erro ao fazer upload das imagens");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit() {
    if (!form.title.trim()) {
      setError("O título é obrigatório");
      return;
    }
    setError(null);
    startTransition(async () => {
      let result: { error?: string; success?: boolean; projectId?: string };
      if (editProject) {
        result = await updateProject(editProject.id, form);
      } else {
        result = await createProject(form) as { error?: string; success?: boolean; projectId?: string };
      }

      if (result?.error) {
        setError(result.error);
        return;
      }

      // Upload images for new project
      if (!editProject && result.projectId && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          await addProjectImage(result.projectId, images[i], `portfolio_${Date.now()}_${i}`, i);
        }
      }

      onSuccess({
        id: editProject?.id ?? result.projectId ?? "",
        ...form,
        city_executed: form.city_executed || null,
        description: form.description || null,
        display_order: editProject?.display_order ?? 0,
        view_count: editProject?.view_count ?? 0,
        portfolio_images: images.map((url, i) => ({
          id: `temp_${i}`,
          cloudinary_url: url,
          order_in_project: i,
        })),
      });
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-card shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-base font-semibold text-azul-noite">
                {editProject ? "Editar projeto" : "Novo projeto"}
              </Dialog.Title>
              <Dialog.Close className="text-cinza-texto hover:text-azul-noite transition-colors">
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-azul-noite mb-1.5">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Ex: Reforma completa de apartamento"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-azul-principal focus:ring-2 focus:ring-azul-principal/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-azul-noite mb-1.5">Categoria</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-azul-principal"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-azul-noite mb-1.5">Cidade</label>
                  <input
                    type="text"
                    value={form.city_executed}
                    onChange={(e) => setForm((f) => ({ ...f, city_executed: e.target.value }))}
                    placeholder="São Paulo, SP"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-azul-principal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-azul-noite mb-1.5">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Descreva o projeto, materiais usados, desafios superados..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-azul-principal"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => {
                    if (!canFeature && e.target.checked) return;
                    setForm((f) => ({ ...f, is_featured: e.target.checked }));
                  }}
                  disabled={!canFeature && !form.is_featured}
                  className="w-4 h-4 rounded accent-azul-principal"
                />
                <span className="text-sm text-azul-noite">Projeto em destaque</span>
                {!canFeature && !form.is_featured && (
                  <span className="text-xs text-cinza-texto">(máximo de 3 atingido)</span>
                )}
              </label>

              {/* Image upload */}
              <div>
                <label className="block text-xs font-medium text-azul-noite mb-1.5">
                  Fotos do projeto
                </label>
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {images.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-4 cursor-pointer hover:border-azul-principal/50 transition-colors">
                  {uploading ? (
                    <Loader2 className="w-5 h-5 text-azul-principal animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5 text-cinza-texto" />
                  )}
                  <span className="text-sm text-cinza-texto">
                    {uploading ? "Enviando..." : "Adicionar fotos"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-azul-noite hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending || uploading}
                className="flex-1 bg-azul-principal hover:bg-azul-noite text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
              >
                {isPending ? "Salvando..." : editProject ? "Salvar alterações" : "Criar projeto"}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function PortfolioClient({ initialProjects, featuredCount: initFeaturedCount, cloudName }: Props) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const featuredCount = projects.filter((p) => p.is_featured).length;

  function openCreate() {
    setEditProject(null);
    setModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditProject(project);
    setModalOpen(true);
  }

  function handleModalSuccess(project: Project) {
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === project.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = project;
        return updated;
      }
      return [...prev, project];
    });
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    if (!confirm("Excluir este projeto? Esta ação não pode ser desfeita.")) return;
    setDeleting(id);
    startTransition(async () => {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setDeleting(null);
    });
  }

  function handleToggleFeatured(id: string, value: boolean) {
    startTransition(async () => {
      const res = await toggleFeatured(id, value);
      if (!res?.error) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_featured: value } : p))
        );
      } else {
        alert(res.error);
      }
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setProjects((prev) => {
        const oldIdx = prev.findIndex((p) => p.id === active.id);
        const newIdx = prev.findIndex((p) => p.id === over.id);
        const reordered = arrayMove(prev, oldIdx, newIdx).map((p, i) => ({
          ...p,
          display_order: i,
        }));
        reorderProjects(reordered.map((p) => ({ id: p.id, order: p.display_order })));
        return reordered;
      });
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-cinza-texto">
            {projects.length} projeto(s)
          </span>
          <span className="text-sm text-cinza-texto">·</span>
          <span className="text-sm text-cinza-texto">
            {featuredCount}/3 em destaque
          </span>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 bg-azul-principal hover:bg-azul-noite text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo projeto
        </button>
      </div>

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="bg-white rounded-card shadow-card text-center py-16">
          <Images className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-azul-noite mb-1">
            Nenhum projeto ainda
          </h3>
          <p className="text-sm text-cinza-texto mb-5">
            Adicione fotos das suas obras para atrair mais clientes.
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-azul-principal hover:bg-azul-noite text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar primeiro projeto
          </button>
        </div>
      )}

      {/* Grid */}
      {projects.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map((p) => p.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {projects.map((project) => (
                <SortableProjectCard
                  key={project.id}
                  project={project}
                  featuredCount={featuredCount}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onToggleFeatured={handleToggleFeatured}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modal */}
      {modalOpen && (
        <ProjectModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          editProject={editProject}
          featuredCount={featuredCount}
          cloudName={cloudName}
          onSuccess={handleModalSuccess}
        />
      )}
    </>
  );
}
