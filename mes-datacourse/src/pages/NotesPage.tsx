import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotesStore } from '@/stores/notes';
import { allPhases } from '@/content/phases';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Tag,
  Clock,
  Edit3,
  Eye,
  Save,
} from 'lucide-react';

export const NotesPage: React.FC = () => {
  const { t } = useTranslation();
  const { notes, addNote, updateNote, deleteNote, searchNotes } = useNotesStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [isPreview, setIsPreview] = useState(false);

  // Form states for active note
  const activeNote = notes.find((n) => n.id === selectedNoteId);
  const [editTitle, setEditTitle] = useState(activeNote?.title || '');
  const [editContent, setEditContent] = useState(activeNote?.content || '');
  const [editTags, setEditTags] = useState<string[]>(activeNote?.tags || []);
  const [newTagInput, setNewTagInput] = useState('');

  // Update local form state when selected note changes
  React.useEffect(() => {
    if (activeNote) {
      setEditTitle(activeNote.title);
      setEditContent(activeNote.content);
      setEditTags(activeNote.tags);
    }
  }, [activeNote]);

  const displayedNotes = searchNotes(searchQuery);

  const handleCreateNote = () => {
    const id = addNote({
      title: 'New Analytical Note',
      content: '### Notes\n\n- Document findings here...',
      tags: ['notes'],
    });
    setSelectedNoteId(id);
    setIsPreview(false);
  };

  const handleSave = () => {
    if (!selectedNoteId) return;
    updateNote(selectedNoteId, {
      title: editTitle,
      content: editContent,
      tags: editTags,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm(t('notes.deleteConfirm'))) {
      deleteNote(id);
      if (selectedNoteId === id) {
        setSelectedNoteId(notes.find((n) => n.id !== id)?.id || null);
      }
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      if (!editTags.includes(newTagInput.trim())) {
        const updated = [...editTags, newTagInput.trim()];
        setEditTags(updated);
        if (selectedNoteId) updateNote(selectedNoteId, { tags: updated });
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updated = editTags.filter((t) => t !== tagToRemove);
    setEditTags(updated);
    if (selectedNoteId) updateNote(selectedNoteId, { tags: updated });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-navy-950 tracking-tight flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-accent-600" />
            <span>{t('notes.title')}</span>
          </h1>
          <p className="text-xs text-navy-600 mt-1">
            {t('notes.subtitle')} — Markdown-powered personal knowledge repository
          </p>
        </div>

        <button
          onClick={handleCreateNote}
          className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-colors shadow-2xs self-start"
        >
          <Plus className="w-4 h-4" />
          <span>{t('notes.newNote')}</span>
        </button>
      </div>

      {/* Main 2-Column Interface: Left List + Right Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* Left Column: Notes Search & List */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-surface-200 shadow-2xs flex flex-col overflow-hidden">
          {/* Search Box */}
          <div className="p-3 border-b border-surface-100">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-navy-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('notes.searchPlaceholder')}
                className="w-full bg-surface-50 border border-surface-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-navy-900 focus:outline-hidden focus:border-accent-500"
              />
            </div>
          </div>

          {/* Notes Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-surface-100">
            {displayedNotes.length === 0 ? (
              <div className="p-8 text-center text-xs text-navy-400">
                {t('notes.noNotes')}
              </div>
            ) : (
              displayedNotes.map((n) => {
                const isSelected = n.id === selectedNoteId;
                return (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNoteId(n.id)}
                    className={`p-3.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-navy-50/70 border-l-3 border-accent-600'
                        : 'hover:bg-surface-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-navy-950 text-xs truncate max-w-[180px]">
                        {n.title || t('notes.untitled')}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(n.id);
                        }}
                        className="text-navy-300 hover:text-rose-600 transition-colors p-1"
                        title={t('common.delete')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-2xs text-navy-500 mt-1 line-clamp-2">
                      {n.content.replace(/[#*`_]/g, '')}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-2xs text-navy-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{new Date(n.updatedAt).toLocaleDateString()}</span>
                      </span>
                      {n.tags.length > 0 && (
                        <span className="truncate max-w-[100px] text-accent-700 font-mono">
                          #{n.tags[0]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Note Editor / Preview */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-surface-200 shadow-2xs flex flex-col p-6 space-y-4">
          {activeNote ? (
            <>
              {/* Header with Title Input + Mode Toggle + Delete */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-100 pb-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => {
                    setEditTitle(e.target.value);
                    updateNote(activeNote.id, { title: e.target.value });
                  }}
                  placeholder={t('notes.untitled')}
                  className="text-lg font-black text-navy-950 focus:outline-hidden bg-transparent border-b border-transparent focus:border-surface-300 flex-1"
                />

                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-surface-100 p-0.5 rounded-lg border border-surface-200 text-xs font-semibold">
                    <button
                      onClick={() => setIsPreview(false)}
                      className={`px-2.5 py-1 rounded flex items-center space-x-1 transition-colors ${
                        !isPreview
                          ? 'bg-white text-navy-950 shadow-2xs font-bold'
                          : 'text-navy-600 hover:text-navy-900'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{t('notes.editNote')}</span>
                    </button>
                    <button
                      onClick={() => setIsPreview(true)}
                      className={`px-2.5 py-1 rounded flex items-center space-x-1 transition-colors ${
                        isPreview
                          ? 'bg-white text-navy-950 shadow-2xs font-bold'
                          : 'text-navy-600 hover:text-navy-900'
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      <span>{t('notes.previewNote')}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(activeNote.id)}
                    className="p-1.5 text-navy-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title={t('common.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tags Management */}
              <div className="flex flex-wrap items-center gap-1.5 text-2xs">
                <Tag className="w-3.5 h-3.5 text-navy-400 mr-1" />
                {editTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 bg-surface-100 text-navy-700 px-2 py-0.5 rounded-full border border-surface-200"
                  >
                    <span>#{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-600 ml-1 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder={t('notes.addTag')}
                  className="bg-transparent border-b border-surface-200 px-1 py-0.5 text-2xs text-navy-700 focus:outline-hidden focus:border-accent-500 w-28"
                />
              </div>

              {/* Editor / Markdown Preview Area */}
              <div className="flex-1 min-h-[350px]">
                {isPreview ? (
                  <div className="p-4 bg-surface-50/50 rounded-xl border border-surface-200 min-h-[350px] overflow-y-auto">
                    <MarkdownRenderer content={editContent} />
                  </div>
                ) : (
                  <textarea
                    value={editContent}
                    onChange={(e) => {
                      setEditContent(e.target.value);
                      updateNote(activeNote.id, { content: e.target.value });
                    }}
                    placeholder={t('notes.placeholder')}
                    className="w-full h-full min-h-[350px] p-4 bg-surface-50/40 rounded-xl border border-surface-200 text-xs font-mono text-navy-900 focus:outline-hidden focus:border-accent-500 resize-none leading-relaxed"
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-navy-400 space-y-3">
              <BookOpen className="w-10 h-10 opacity-40" />
              <p className="text-xs">{t('notes.noNotes')}</p>
              <button
                onClick={handleCreateNote}
                className="bg-navy-900 text-white font-bold text-xs px-4 py-2 rounded-lg"
              >
                {t('notes.newNote')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
