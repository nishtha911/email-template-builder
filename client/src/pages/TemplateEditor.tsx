import React, { useState, useEffect } from 'react';
import {
  Box, AppBar, Toolbar, Typography, Button,
  Stack, Modal, IconButton, Divider, TextField,
  Snackbar, Alert, CircularProgress, Tooltip
} from '@mui/material';
import {
  TextFields, Image as ImageIcon, Visibility, Close,
  ArrowBack, DragIndicator, FileDownload, SmartButton, HorizontalRule,
  ViewModule, PermMedia,
  SmartToy, Undo, Redo, Delete as DeleteIcon
} from '@mui/icons-material';
import { Tabs, Tab } from '@mui/material';
import {
  DndContext, useDraggable, useDroppable,
  PointerSensor, useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import PropertiesSidebar from '../components/Editor/PropertiesSidebar';
import { uploadMedia } from '../api/index';
import { useNavigate, useParams } from 'react-router-dom';
import { Resizable } from 're-resizable';
import { useEditorStore, type CanvasElement } from '../store/editorStore';
import { useTemplateById, useSaveTemplate } from '../hooks/useTemplates';

interface UpdatePayload {
  content?: string;
  styles?: any;
  href?: string;
}

interface DraggableToolProps {
  type: string;
  icon: React.ReactNode;
  label: string;
  customContent?: string;
}

interface DroppableCanvasProps {
  children: React.ReactNode;
  isOver: boolean;
  isEmpty: boolean;
}

const DraggableTool: React.FC<DraggableToolProps> = ({ type, icon, label, customContent }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `tool-${type}-${customContent ? 'custom' : 'default'}`,
    data: { type, customContent }
  });

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: CSS.Translate.toString(transform),
        touchAction: 'none',
        opacity: isDragging ? 0.4 : 1,
        userSelect: 'none',
      }}
      sx={{
        p: 1.5, mb: 1.5, borderRadius: '12px',
        border: '1px solid rgba(var(--primary-rgb),0.15)',
        background: 'rgba(var(--bg-paper-rgb),0.7)',
        backdropFilter: 'blur(8px)',
        cursor: 'grab',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
        transition: 'all 0.15s',
        '&:hover': {
          background: 'rgba(var(--primary-rgb),0.06)',
          border: '1px solid rgba(var(--primary-rgb),0.3)',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(var(--primary-rgb),0.12)',
        },
      }}
    >
      <Box sx={{ color: 'var(--primary-main)' }}>{icon}</Box>
      <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-main)', letterSpacing: '0.3px' }}>
        {label}
      </Typography>
    </Box>
  );
};

const DroppableCanvas: React.FC<DroppableCanvasProps> = ({ children, isOver, isEmpty }) => {
  const { setNodeRef } = useDroppable({ id: 'canvas-droppable' });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        width: '100%', maxWidth: 640, minHeight: '85dvh', mx: 'auto',
        background: 'rgba(var(--bg-paper-rgb),0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        p: 4, borderRadius: '20px',
        boxShadow: isOver
          ? '0 0 0 3px var(--primary-main), 0 8px 40px rgba(var(--primary-rgb),0.18)'
          : '0 8px 40px rgba(var(--primary-rgb),0.1), 0 1px 4px rgba(0,0,0,0.04)',
        border: isOver ? '2px solid var(--primary-main)' : '1px solid rgba(var(--bg-paper-rgb),0.9)',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
      }}
    >
      {isEmpty && (
        <Box sx={{
          height: '60vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: 0.3, pointerEvents: 'none', gap: 1,
        }}>
          <DragIndicator sx={{ fontSize: 36, color: 'var(--primary-main)' }} />
          <Typography sx={{ fontWeight: 600, color: 'var(--primary-main)' }}>Drop elements here</Typography>
          <Typography sx={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Drag Text or Image from the left panel</Typography>
        </Box>
      )}
      {children}
    </Box>
  );
};

const TemplateEditor: React.FC = () => {
  const {
    elements, selectedId, templateTitle, templateId,
    saving, snackbar, historyStep, history,
    setSelectedId, setTemplateTitle, setTemplateId,
    setSaving, setSnackbar, closeSnackbar,
    updateElements, undo, redo, resetEditor, loadTemplate,
  } = useEditorStore();

  const [activeType, setActiveType] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isOver } = useDroppable({ id: 'canvas-droppable' });

  const { data: templateData } = useTemplateById(id);
  const saveTemplateMutation = useSaveTemplate();

  useEffect(() => {
    if (!id) {
      resetEditor();
      return;
    }
    if (templateData) {
      const els = Array.isArray(templateData.content) ? (templateData.content as CanvasElement[]) : [];
      loadTemplate(templateData.id, templateData.name, els);
    }
  }, [id, templateData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) redo(); else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyStep, history]);

  const moveElement = (elementId: string, direction: 'up' | 'down') => {
    updateElements((prev) => {
      const index = prev.findIndex(el => el.id === elementId);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;
      const newElements = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const temp = newElements[index];
      newElements[index] = newElements[targetIndex];
      newElements[targetIndex] = temp;
      return newElements;
    });
  };

  const handleAiSend = () => {
    if (!aiPrompt.trim()) return;
    const userMessage = { role: "user" as const, text: aiPrompt };
    setAiMessages((prev) => [...prev, userMessage]);
    setTimeout(() => {
      const aiResponse = {
        role: "ai" as const,
        text: "Here is a generated email section. You can drag it into the canvas.",
      };
      setAiMessages((prev) => [...prev, aiResponse]);
    }, 800);
    setAiPrompt("");
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveType(event.active.data.current?.type as string ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveType(null);
    if (!over || over.id !== 'canvas-droppable') return;
    const type = active.data.current?.type as 'text' | 'image' | 'button' | 'divider';
    const customContent = active.data.current?.customContent as string | undefined;
    if (!type) return;

    const newElement: CanvasElement = {
      id: `el-${Date.now()}`,
      type,
      content:
        type === 'text' ? 'Placeholder Text'
          : type === 'image' ? (customContent || 'https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg')
          : type === 'button' ? 'Click Me'
          : '',
      styles:
        type === 'text' ? { fontSize: 18, textAlign: 'left', color: '#333333', fontFamily: 'Arial', fontWeight: '400', fontStyle: 'normal', textDecoration: 'none' }
          : type === 'image' ? { borderRadius: 0, width: '100%', display: 'block', marginLeft: '0', marginRight: 'auto' }
          : type === 'button' ? { fontSize: 16, textAlign: 'center', color: '#ffffff', backgroundColor: '#4f46e5', padding: '10px 20px', borderRadius: 4, display: 'inline-block', fontWeight: 'bold' }
          : { borderTop: '2px solid #dddddd', width: '100%', margin: '15px 0' }
    };

    updateElements((prev) => [...prev, newElement]);
    setSelectedId(newElement.id);
  };

  const handleSave = () => {
    if (elements.length === 0) {
      setSnackbar({ open: true, message: 'Add at least one element before saving.', severity: 'warning' });
      return;
    }
    const payload = { name: templateTitle, content: elements, ...(templateId && { id: templateId }) };
    setSaving(true);
    saveTemplateMutation.mutate(payload, {
      onSuccess: (res) => {
        const saved = res.data.template;
        setTemplateId(saved.id);
        setSnackbar({ open: true, message: templateId ? 'Template updated.' : 'Template saved.', severity: 'success' });
      },
      onError: (err: unknown) => {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        setSnackbar({ open: true, message: msg || 'Failed to save template.', severity: 'error' });
      },
      onSettled: () => setSaving(false),
    });
  };

  const handleExportHTML = () => {
    let htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;margin:0;padding:20px;background:#f5f5f5;}</style></head><body><div style="max-width:600px;margin:0 auto;background:#fff;padding:20px;">`;
    elements.forEach(el => {
      const styles = Object.entries(el.styles)
        .map(([k, v]) => `${k.replace(/[A-Z]/g, m => "-" + m.toLowerCase())}:${v}`)
        .join(';');
      if (el.type === 'image') {
        htmlContent += `<img src="${el.content}" style="${styles};width:100%;max-width:100%;display:block;" />`;
      } else if (el.type === 'divider') {
        htmlContent += `<hr style="${styles}" />`;
      } else if (el.type === 'button') {
        const contentHtml = el.href
          ? `<a href="${el.href}" target="_blank" style="text-decoration:none;display:inline-block;${styles}">${renderPreviewContent(el.content)}</a>`
          : `<span style="display:inline-block;${styles}">${renderPreviewContent(el.content)}</span>`;
        htmlContent += `<div style="text-align:${el.styles.textAlign || 'center'};">${contentHtml}</div>`;
      } else {
        htmlContent += `<div style="${styles}">${renderPreviewContent(el.content)}</div>`;
      }
    });
    htmlContent += `</div></body></html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${templateTitle.replace(/\s+/g, '_')}.html`;
    link.click();
    URL.revokeObjectURL(url);
    setSnackbar({ open: true, message: 'Template exported as HTML.', severity: 'success' });
  };

  const renderPreviewContent = (content: string) =>
    content.replace(/\{\{(\w+)\}\}/g, (_: string, key: string) => `<span style="color:var(--primary-main);font-weight:700;">[${key}]</span>`);

  const selectedElement = elements.find((e) => e.id === selectedId);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(145deg, var(--bg-gradient-1) 0%, var(--bg-gradient-2) 60%, var(--bg-gradient-3) 100%)' }}>

        <AppBar position="static" elevation={0} sx={{
          background: 'rgba(var(--bg-paper-rgb),0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(var(--primary-rgb),0.1)',
          color: 'black',
        }}>
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: '60px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Tooltip title="Back to templates">
                <IconButton size="small" onClick={() => navigate('/templates')} sx={{ color: 'var(--primary-main)' }}>
                  <ArrowBack fontSize="small" />
                </IconButton>
              </Tooltip>
              <Box sx={{
                width: 28, height: 28, borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--primary-main), var(--primary-light))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="3" />
                  <path d="m22 7-10 7L2 7" />
                </svg>
              </Box>
              <TextField
                variant="standard"
                value={templateTitle}
                onChange={(e) => setTemplateTitle(e.target.value)}
                slotProps={{
                  input: {
                    disableUnderline: true,
                    sx: { fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }
                  }
                }}
              />
            </Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Tooltip title="Undo (Ctrl+Z)">
                <span>
                  <IconButton size="small" onClick={undo} disabled={historyStep === 0} sx={{ color: historyStep === 0 ? 'inherit' : 'var(--primary-main)' }}>
                    <Undo fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Redo (Ctrl+Y)">
                <span>
                  <IconButton size="small" onClick={redo} disabled={historyStep === history.length - 1} sx={{ color: historyStep === history.length - 1 ? 'inherit' : 'var(--primary-main)' }}>
                    <Redo fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(var(--primary-rgb),0.2)', my: 1 }} />
              <Button
                startIcon={<Visibility sx={{ fontSize: 17 }} />}
                onClick={() => setIsPreviewOpen(true)}
                sx={{
                  color: 'var(--primary-main)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'none',
                  borderRadius: '10px', px: 2,
                  border: '1px solid rgba(var(--primary-rgb),0.2)',
                  '&:hover': { background: 'rgba(var(--primary-rgb),0.06)' },
                }}
              >
                Preview
              </Button>
              <Button
                startIcon={<FileDownload sx={{ fontSize: 17 }} />}
                onClick={handleExportHTML}
                sx={{
                  color: 'var(--primary-main)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'none',
                  borderRadius: '10px', px: 2,
                  border: '1px solid rgba(var(--primary-rgb),0.2)',
                  '&:hover': { background: 'rgba(var(--primary-rgb),0.06)' },
                }}
              >
                Export
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                sx={{
                  background: 'linear-gradient(135deg, var(--primary-main), var(--primary-light-alt))',
                  fontWeight: 700, fontSize: '0.85rem', textTransform: 'none',
                  borderRadius: '10px', px: 2.5, minWidth: 90,
                  boxShadow: '0 4px 14px rgba(var(--primary-rgb),0.3)',
                  '&:hover': { boxShadow: '0 6px 18px rgba(var(--primary-rgb),0.4)' },
                  '&.Mui-disabled': { background: '#d4a8d2', color: 'var(--bg-paper-solid)' },
                }}
              >
                {saving ? <CircularProgress size={18} sx={{ color: 'var(--bg-paper-solid)' }} /> : 'Save'}
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          <Box sx={{
            width: 280, p: 0, pt: 0,
            background: 'rgba(var(--bg-paper-rgb),0.5)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0,
          }}>
            <Tabs
              value={activeTab}
              onChange={(_e, v) => setActiveTab(v)}
              variant="fullWidth"
              sx={{
                width: '100%',
                mb: 2,
                minHeight: 40,
                '& .MuiTab-root': {
                  minHeight: 40,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  color: 'var(--text-secondary)',
                  transition: 'color 0.2s ease, transform 0.2s ease',
                  '&.Mui-selected': {
                    color: 'var(--primary-main)',
                  },
                  '&:hover': {
                    color: 'var(--primary-main)',
                    transform: 'scale(1.05)',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'var(--primary-main)',
                  height: 3,
                  borderRadius: 2,
                },
              }}
            >
              <Tab
                aria-label="Elements" 
                icon={<ViewModule fontSize="small" />} 
                iconPosition="start" 
              />
              <Tab 
                aria-label="Media" 
                icon={<PermMedia fontSize="small" />}
                iconPosition="start" 
              />
              <Tab 
                aria-label="AI Assistant" 
                icon={<SmartToy fontSize="small" />} 
                iconPosition="start" 
              />
            </Tabs>


            <Box sx={{ width: '100%', px: 1.5, display: activeTab === 0 ? 'block' : 'none' }}>
              <DraggableTool type="text" icon={<TextFields fontSize="small" />} label="Text" />
              <DraggableTool type="image" icon={<ImageIcon fontSize="small" />} label="Image" />
              <DraggableTool type="button" icon={<SmartButton fontSize="small" />} label="Button" />
              <DraggableTool type="divider" icon={<HorizontalRule fontSize="small" />} label="Divider" />
            </Box>

            <Box sx={{ width: '100%', px: 1.5, display: activeTab === 1 ? 'block' : 'none', textAlign: 'center' }}>
               <Typography sx={{ fontSize: '0.7rem', color: 'var(--text-secondary)', mb: 2 }}>
                 Upload and manage your assets here.
               </Typography>
               <input
                 type="file"
                 accept="image/*"
                 id="upload-image-input"
                 style={{ display: 'none' }}
                 onChange={async (e) => {
                   if (e.target.files && e.target.files[0]) {
                     const formData = new FormData();
                     formData.append('image', e.target.files[0]);
                     try {
                        const res = await uploadMedia(formData);
                        setUploadedImages(prev => [...prev, res.data.imageUrl]);
                     } catch (err) {
                        setSnackbar({ open: true, message: 'Upload failed', severity: 'error' });
                     }
                   }
                 }}
               />
               <label htmlFor="upload-image-input">
                 <Button component="span" variant="outlined" size="small" sx={{ width: '100%', fontSize: '0.7rem', mb: 2 }}>Upload Image</Button>
               </label>
               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                 {uploadedImages.map((src, i) => (
                   <Box key={i} sx={{ width: '45%' }}>
                     <DraggableTool type="image" icon={<img src={src} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} alt="" />} label="Image" customContent={src} />
                   </Box>
                 ))}
               </Box>
            </Box>

            <Box
              sx={{
                height: "100%",
                display: activeTab === 2 ? "flex" : "none", p : 2,
                flexDirection: "column",
                flexWrap : "wrap"
              }}
            >
              {/* Chat Area */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  px: 1,
                  pb: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {aiMessages.length === 0 && (
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                      textAlign: "center",
                      mt: 2,
                    }}
                  >
                    Ask AI to generate email content, sections, or ideas.
                  </Typography>
                )}

                {aiMessages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                      maxWidth: "85%",
                      p: 1,
                      borderRadius: "10px",
                      fontSize: "0.78rem",
                      background:
                        msg.role === "user"
                          ? "rgba(var(--primary-rgb),0.12)"
                          : "rgba(var(--bg-paper-rgb),0.7)",
                      border:
                        msg.role === "user"
                          ? "1px solid rgba(var(--primary-rgb),0.3)"
                          : "1px solid rgba(var(--primary-rgb),0.15)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {msg.text}
                  </Box>
                ))}
              </Box>

              {/* Input Row */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  pt: 1,
                  borderTop: "1px solid rgba(var(--primary-rgb),0.15)",
                }}
              >
                <TextField
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask AI to generate email..."
                  size="small"
                  fullWidth
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAiSend();
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      fontSize: "0.8rem",
                      background: "rgba(var(--bg-paper-rgb),0.7)",
                      backdropFilter: "blur(6px)",
                    },
                  }}
                />

                <IconButton
                  onClick={handleAiSend}
                  sx={{
                    background:
                      "linear-gradient(135deg,var(--primary-main),var(--primary-light))",
                    color: "white",
                    width: 36,
                    height: 36,
                    "&:hover": {
                      opacity: 0.9,
                    },
                  }}
                >
                  <SmartToy fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}
          >
            <DroppableCanvas isOver={isOver} isEmpty={elements.length === 0}>
              {elements.map((el) => (
                <Box
                  key={el.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedId(el.id); }}
                  sx={{
                    mb: 2, p: 1, cursor: 'pointer', borderRadius: '8px', position: 'relative',
                    outline: selectedId === el.id ? '2px solid var(--primary-main)' : '2px solid transparent',
                    outlineOffset: '2px',
                    transition: 'outline 0.15s',
                    '&:hover': { outline: selectedId === el.id ? '2px solid var(--primary-main)' : '2px solid rgba(var(--primary-rgb),0.3)' },
                  }}
                >
                  {el.type === 'text' && <Typography sx={el.styles as object}>{el.content}</Typography>}
                  {el.type === 'image' && (
                    <Resizable
                      size={{ width: (el.styles.width as string | number) || '100%', height: (el.styles.height as string | number) || 'auto' }}
                      onResizeStop={(_e, _direction, ref, _d) => {
                        updateElements((prev) =>
                          prev.map((item) =>
                            item.id === el.id
                              ? { ...item, styles: { ...item.styles, width: ref.style.width, height: ref.style.height } }
                              : item
                          )
                        );
                      }}
                      enable={{
                        right: selectedId === el.id,
                        bottom: selectedId === el.id,
                        bottomRight: selectedId === el.id,
                      }}
                      style={{ overflow: 'hidden', display: 'flex', position: 'relative' }}
                    >
                      <img src={el.content} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: `${el.styles.borderRadius ?? 0}px` }} alt="" />
                    </Resizable>
                  )}
                  {el.type === 'button' && (
                    <Box sx={{ textAlign: el.styles.textAlign || 'center' }}>
                      {el.href ? (
                        <a href={el.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <Box component="span" sx={{ ...el.styles as object }}>{el.content}</Box>
                        </a>
                      ) : (
                        <Box component="span" sx={{ ...el.styles as object }}>{el.content}</Box>
                      )}
                    </Box>
                  )}
                  {el.type === 'divider' && <Box component="hr" sx={el.styles as object} />}
                  
                  {selectedId === el.id && (
                    <Box sx={{
                      position: 'absolute', top: -46, right: 0, 
                      background: 'rgba(var(--bg-paper-rgb),0.98)', 
                      backdropFilter: 'blur(12px)',
                      borderRadius: '10px', p: 0.5,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                      border: '1px solid rgba(var(--primary-rgb),0.25)',
                      display: 'flex', alignItems: 'center', gap: 0.5, zIndex: 10,
                    }}>
                      {el.type === 'button' && (
                        <TextField
                          size="small"
                          placeholder="Link URL"
                          value={el.href || ''}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            updateElements((prev) =>
                              prev.map((item) =>
                                item.id === el.id ? { ...item, href: e.target.value } : item
                              )
                            );
                          }}
                          sx={{
                            width: 130,
                            ml: 0.5,
                            mr: 0.5,
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.5, px: 1 }
                          }}
                        />
                      )}
                      {(el.type === 'text' || el.type === 'button') && (
                        <>
                          <Tooltip title="Decrease Font Size">
                            <IconButton size="small" onClick={(e) => {
                              e.stopPropagation();
                              const currentSize = (el.styles as any).fontSize || 16;
                              updateElements(prev => prev.map(item => item.id === el.id ? { ...item, styles: { ...item.styles, fontSize: Math.max(8, currentSize - 2) } } : item));
                            }} sx={{ width: 28, height: 28, color: 'var(--text-primary)' }}>
                              <Typography sx={{ fontWeight: 800 }}>-</Typography>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Increase Font Size">
                            <IconButton size="small" onClick={(e) => {
                              e.stopPropagation();
                              const currentSize = (el.styles as any).fontSize || 16;
                              updateElements(prev => prev.map(item => item.id === el.id ? { ...item, styles: { ...item.styles, fontSize: Math.min(72, currentSize + 2) } } : item));
                            }} sx={{ width: 28, height: 28, color: 'var(--text-primary)' }}>
                              <Typography sx={{ fontWeight: 800 }}>+</Typography>
                            </IconButton>
                          </Tooltip>
                          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: 'var(--border-subtle)' }} />
                        </>
                      )}
                      <Tooltip title="Move Up">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); moveElement(el.id, 'up'); }} sx={{ width: 28, height: 28 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Move Down">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); moveElement(el.id, 'down'); }} sx={{ width: 28, height: 28 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Duplicate">
                        <IconButton size="small" onClick={(e) => { 
                          e.stopPropagation(); 
                          const newEl = { ...el, id: `el-${Date.now()}` };
                          updateElements(prev => {
                            const idx = prev.findIndex(item => item.id === el.id);
                            const copy = [...prev];
                            copy.splice(idx + 1, 0, newEl);
                            return copy;
                          });
                          setSelectedId(newEl.id);
                        }} sx={{ width: 28, height: 28 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); updateElements(prev => prev.filter(item => item.id !== el.id)); setSelectedId(null); }} sx={{ width: 28, height: 28, color: '#d32f2f' }}>
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
              ))}
            </DroppableCanvas>
          </Box>
          {
            selectedId && (
              <Box sx={{
                width: 300, flexShrink: 0,
                borderLeft: '1px solid rgba(var(--primary-rgb),0.1)',
                background: 'rgba(var(--bg-paper-rgb),0.55)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                overflowY: 'auto',
              }}>
                <PropertiesSidebar
                  selectedElement={selectedElement}
                  onUpdate={(upd: UpdatePayload) =>
                    updateElements((els) =>
                      els.map((e) =>
                        e.id === selectedId
                          ? { ...e, ...upd, styles: { ...e.styles, ...upd.styles } }
                          : e
                      )
                    )
                  }
                  onDelete={() => {
                    updateElements((els) => els.filter((e) => e.id !== selectedId));
                    setSelectedId(null);
                  }}
                />
              </Box>
            )
          }
        </Box>
      </Box>

      <DragOverlay dropAnimation={null}>
        {activeType && (
          <Box sx={{
            p: 1.5, width: 150, borderRadius: '12px',
            background: 'rgba(var(--bg-paper-rgb),0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(var(--primary-rgb),0.3)',
            boxShadow: '0 8px 32px rgba(var(--primary-rgb),0.2)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
            cursor: 'grabbing',
          }}>
            <Box sx={{ color: 'var(--primary-main)' }}>
              {activeType === 'text' ? <TextFields fontSize="small" /> : <ImageIcon fontSize="small" />}
            </Box>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-main)' }}>
              {activeType.toUpperCase()}
            </Typography>
          </Box>
        )}
      </DragOverlay>

      <Modal open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 580, maxHeight: '85vh', overflow: 'auto',
          background: 'rgba(var(--bg-paper-rgb),0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          p: 4, borderRadius: '20px',
          border: '1px solid rgba(var(--bg-paper-rgb),0.9)',
          boxShadow: '0 24px 80px rgba(var(--primary-rgb),0.2)',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>Preview</Typography>
              <Typography sx={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{templateTitle}</Typography>
            </Box>
            <IconButton onClick={() => setIsPreviewOpen(false)} size="small" sx={{ color: 'var(--primary-main)' }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2.5, borderColor: 'rgba(var(--primary-rgb),0.1)' }} />
          <Box>
            {elements.length === 0 && (
              <Typography sx={{ textAlign: 'center', color: 'var(--text-secondary)', py: 4, fontSize: '0.88rem' }}>
                No elements to preview.
              </Typography>
            )}
            {elements.map((el) => (
              <Box key={el.id} sx={{ mb: 2 }}>
                {el.type === 'text' && (
                  <div style={el.styles as React.CSSProperties} dangerouslySetInnerHTML={{ __html: renderPreviewContent(el.content) }} />
                )}
                {el.type === 'image' && (
                  <img src={el.content} style={{ width: '100%', borderRadius: `${el.styles.borderRadius ?? 0}px` }} alt="" />
                )}
                {el.type === 'button' && (
                  <div style={{ textAlign: (el.styles as any).textAlign || 'center' }}>
                    <span style={el.styles as React.CSSProperties} dangerouslySetInnerHTML={{ __html: renderPreviewContent(el.content) }} />
                  </div>
                )}
                {el.type === 'divider' && <hr style={el.styles as React.CSSProperties} />}
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open} autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={closeSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DndContext>
  );
};

export default TemplateEditor;