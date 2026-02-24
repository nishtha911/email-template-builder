import { useState } from 'react';
import {
  Box, AppBar, Toolbar, Typography, Button, Paper,
  Stack, Modal, IconButton, Divider, TextField,
  Snackbar, Alert, CircularProgress, Tooltip
} from '@mui/material';
import {
  TextFields, Image as ImageIcon, Visibility, Close,
  ArrowBack, DragIndicator
} from '@mui/icons-material';
import {
  DndContext, useDraggable, useDroppable,
  PointerSensor, useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import PropertiesSidebar from '../components/Editor/PropertiesSidebar';
import { saveTemplate } from '../api/index';
import { useNavigate } from 'react-router-dom';

const DraggableTool = ({ type, icon, label }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `tool-${type}`,
    data: { type }
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
        border: '1px solid rgba(150,57,145,0.15)',
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(8px)',
        cursor: 'grab',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
        transition: 'all 0.15s',
        '&:hover': {
          background: 'rgba(150,57,145,0.06)',
          border: '1px solid rgba(150,57,145,0.3)',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(150,57,145,0.12)',
        },
      }}
    >
      <Box sx={{ color: '#963991' }}>{icon}</Box>
      <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#963991', letterSpacing: '0.3px' }}>
        {label}
      </Typography>
    </Box>
  );
};

const DroppableCanvas = ({ children, isOver, isEmpty }) => {
  const { setNodeRef } = useDroppable({ id: 'canvas-droppable' });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        width: '100%', maxWidth: 640, minHeight: '80vh', mx: 'auto',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        p: 4, borderRadius: '20px',
        boxShadow: isOver
          ? '0 0 0 3px #963991, 0 8px 40px rgba(150,57,145,0.18)'
          : '0 8px 40px rgba(150,57,145,0.1), 0 1px 4px rgba(0,0,0,0.04)',
        border: isOver ? '2px solid #963991' : '1px solid rgba(255,255,255,0.9)',
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
          <DragIndicator sx={{ fontSize: 36, color: '#963991' }} />
          <Typography sx={{ fontWeight: 600, color: '#963991' }}>Drop elements here</Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#888' }}>Drag Text or Image from the left panel</Typography>
        </Box>
      )}
      {children}
    </Box>
  );
};

const TemplateEditor = () => {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [templateTitle, setTemplateTitle] = useState('New Template');
  const [templateId, setTemplateId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const { isOver } = useDroppable({ id: 'canvas-droppable' });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event) => {
    setActiveType(event.active.data.current?.type);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveType(null);
    if (!over || over.id !== 'canvas-droppable') return;
    const type = active.data.current?.type;
    if (!type) return;

    const newElement = {
      id: `el-${Date.now()}`,
      type,
      content:
        type === 'text'
          ? 'Placeholder Text'
          : 'https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg',
      styles:
        type === 'text'
          ? { fontSize: 18, textAlign: 'left', color: '#333333', fontFamily: 'Arial', fontWeight: '400', fontStyle: 'normal', textDecoration: 'none' }
          : { borderRadius: 0, width: '100%', display: 'block', marginLeft: '0', marginRight: 'auto' }
    };

    setElements((prev) => [...prev, newElement]);
    setSelectedId(newElement.id);
  };

  const handleSave = async () => {
    if (elements.length === 0) {
      setSnackbar({ open: true, message: 'Add at least one element before saving.', severity: 'warning' });
      return;
    }
    setSaving(true);
    try {
      const payload = { name: templateTitle, content: elements, ...(templateId && { id: templateId }) };
      const res = await saveTemplate(payload);
      const saved = res.data.template;
      setTemplateId(saved.id);
      setSnackbar({ open: true, message: templateId ? 'Template updated.' : 'Template saved.', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to save template.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const renderPreviewContent = (content) =>
    content.replace(/{{(\w+)}}/g, (_, key) => `<span style="color:#963991;font-weight:700;">[${key}]</span>`);

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(145deg, #faf5ff 0%, #fdf4ff 60%, #f3e8ff 100%)' }}>

        <AppBar position="static" elevation={0} sx={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(150,57,145,0.1)',
          color: 'black',
        }}>
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: '60px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Tooltip title="Back to templates">
                <IconButton size="small" onClick={() => navigate('/templates')} sx={{ color: '#963991' }}>
                  <ArrowBack fontSize="small" />
                </IconButton>
              </Tooltip>
              <Box sx={{
                width: 28, height: 28, borderRadius: '8px',
                background: 'linear-gradient(135deg, #963991, #c060bb)',
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
                InputProps={{
                  disableUnderline: true,
                  sx: { fontWeight: 800, fontSize: '0.95rem', color: '#1a1a2e' }
                }}
              />
            </Box>
            <Stack direction="row" spacing={1.5}>
              <Button
                startIcon={<Visibility sx={{ fontSize: 17 }} />}
                onClick={() => setIsPreviewOpen(true)}
                sx={{
                  color: '#963991', fontWeight: 600, fontSize: '0.85rem', textTransform: 'none',
                  borderRadius: '10px', px: 2,
                  border: '1px solid rgba(150,57,145,0.2)',
                  '&:hover': { background: 'rgba(150,57,145,0.06)' },
                }}
              >
                Preview
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                sx={{
                  background: 'linear-gradient(135deg, #963991, #b84db3)',
                  fontWeight: 700, fontSize: '0.85rem', textTransform: 'none',
                  borderRadius: '10px', px: 2.5, minWidth: 90,
                  boxShadow: '0 4px 14px rgba(150,57,145,0.3)',
                  '&:hover': { boxShadow: '0 6px 18px rgba(150,57,145,0.4)' },
                  '&:disabled': { background: '#d4a8d2', color: 'white' },
                }}
              >
                {saving ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Save'}
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          <Box sx={{
            width: 110, p: 1.5, pt: 2,
            borderRight: '1px solid rgba(150,57,145,0.1)',
            background: 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0,
          }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#bbb', letterSpacing: '1px', mb: 1.5, textTransform: 'uppercase' }}>
              Elements
            </Typography>
            <DraggableTool type="text" icon={<TextFields fontSize="small" />} label="Text" />
            <DraggableTool type="image" icon={<ImageIcon fontSize="small" />} label="Image" />
          </Box>

          <Box
            sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}
            onClick={() => setSelectedId(null)}
          >
            <DroppableCanvas isOver={isOver} isEmpty={elements.length === 0}>
              {elements.map((el) => (
                <Box
                  key={el.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedId(el.id); }}
                  sx={{
                    mb: 2, p: 1, cursor: 'pointer', borderRadius: '8px',
                    outline: selectedId === el.id ? '2px solid #963991' : '2px solid transparent',
                    outlineOffset: '2px',
                    transition: 'outline 0.15s',
                    '&:hover': { outline: selectedId === el.id ? '2px solid #963991' : '2px solid rgba(150,57,145,0.3)' },
                  }}
                >
                  {el.type === 'text' && <Typography sx={el.styles}>{el.content}</Typography>}
                  {el.type === 'image' && (
                    <Box component="img" src={el.content} sx={{ width: '100%', borderRadius: `${el.styles.borderRadius}px` }} />
                  )}
                </Box>
              ))}
            </DroppableCanvas>
          </Box>

          <Box sx={{
            width: 300, flexShrink: 0,
            borderLeft: '1px solid rgba(150,57,145,0.1)',
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            overflowY: 'auto',
          }}>
            <PropertiesSidebar
              selectedElement={elements.find((e) => e.id === selectedId)}
              onUpdate={(upd) =>
                setElements((els) =>
                  els.map((e) =>
                    e.id === selectedId
                      ? { ...e, ...upd, styles: { ...e.styles, ...upd.styles } }
                      : e
                  )
                )
              }
              onDelete={() => {
                setElements((els) => els.filter((e) => e.id !== selectedId));
                setSelectedId(null);
              }}
            />
          </Box>
        </Box>
      </Box>

      <DragOverlay dropAnimation={null}>
        {activeType && (
          <Box sx={{
            p: 1.5, width: 90, borderRadius: '12px',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(150,57,145,0.3)',
            boxShadow: '0 8px 32px rgba(150,57,145,0.2)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
            cursor: 'grabbing',
          }}>
            <Box sx={{ color: '#963991' }}>
              {activeType === 'text' ? <TextFields fontSize="small" /> : <ImageIcon fontSize="small" />}
            </Box>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#963991' }}>
              {activeType.toUpperCase()}
            </Typography>
          </Box>
        )}
      </DragOverlay>

      <Modal open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 580, maxHeight: '85vh', overflow: 'auto',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          p: 4, borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 24px 80px rgba(150,57,145,0.2)',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a2e' }}>Preview</Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#aaa' }}>{templateTitle}</Typography>
            </Box>
            <IconButton onClick={() => setIsPreviewOpen(false)} size="small" sx={{ color: '#963991' }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2.5, borderColor: 'rgba(150,57,145,0.1)' }} />
          <Box>
            {elements.length === 0 && (
              <Typography sx={{ textAlign: 'center', color: '#aaa', py: 4, fontSize: '0.88rem' }}>
                No elements to preview.
              </Typography>
            )}
            {elements.map((el) => (
              <Box key={el.id} sx={{ mb: 2 }}>
                {el.type === 'text' && (
                  <div style={el.styles} dangerouslySetInnerHTML={{ __html: renderPreviewContent(el.content) }} />
                )}
                {el.type === 'image' && (
                  <img src={el.content} style={{ width: '100%', borderRadius: el.styles.borderRadius }} alt="" />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DndContext>
  );
};

export default TemplateEditor;