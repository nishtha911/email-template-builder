import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useAuth } from '../context/AuthContext';
import { saveTemplate, fetchTemplateById } from '../api';
import { compileToHTML } from './../../../server/src/utils/compiler';
import PropertiesSidebar from '../components/Editor/Sidebar'; 
import { Box, Button, TextField, Typography, AppBar, Toolbar } from '@mui/material';

// --- Sub-Component: Droppable Canvas ---
const CanvasDropZone = ({ elements, selectedId, onSelect }) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-zone' });

  return (
    <Box 
      ref={setNodeRef}
      sx={{
        width: '100%', maxWidth: '600px', minHeight: '800px', mx: 'auto',
        bgcolor: isOver ? '#fff5fd' : 'white', boxShadow: 3, p: 2,
        outline: isOver ? '2px dashed #963991' : 'none', transition: '0.2s'
      }}
    >
      {elements.map((el) => (
        <Box 
          key={el.id} 
          onClick={(e) => { e.stopPropagation(); onSelect(el.id); }}
          sx={{ 
            p: 2, borderBottom: '1px solid #eee', cursor: 'pointer',
            outline: selectedId === el.id ? '2px solid #963991' : 'none',
            ...el.styles 
          }}
        >
          {el.type === 'text' && <Typography sx={{ fontSize: el.styles.fontSize, textAlign: el.styles.textAlign }}>{el.content}</Typography>}
          {el.type === 'button' && (
             <Box sx={{ textAlign: el.styles.textAlign || 'center' }}>
                <Button variant="contained" sx={{ bgcolor: '#963991' }}>{el.content}</Button>
             </Box>
          )}
          {el.type === 'image' && <Box component="img" src={el.content || 'https://via.placeholder.com/150'} sx={{ width: '100%', borderRadius: el.styles.borderRadius }} />}
        </Box>
      ))}
    </Box>
  );
};

// --- Main Component ---
const TemplateEditor = () => {
  const { id } = useParams();
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [templateName, setTemplateName] = useState("New Template");

  const handleUpdateElement = (updates) => {
    setElements(prev => prev.map(el => el.id === selectedId ? { ...el, ...updates } : el));
  };

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (over && over.id === 'canvas-zone') {
      const type = active.data.current.type;
      const newEl = {
        id: `el-${Date.now()}`, type,
        content: type === 'text' ? 'New Text' : (type === 'button' ? 'Click Me' : ''),
        styles: { fontSize: 16, textAlign: 'left', borderRadius: 0 }
      };
      setElements([...elements, newEl]);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#f4f4f4' }}>
        <AppBar position="static" sx={{ bgcolor: 'white', color: 'black', boxShadow: 1 }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <TextField size="small" value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
            <Box>
              <Button onClick={() => window.open().document.write(compileToHTML(elements))}>Preview</Button>
              <Button variant="contained" sx={{ ml: 2, bgcolor: '#963991' }} onClick={() => saveTemplate({ id, name: templateName, content: elements })}>Save</Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          {/* Elements Sidebar */}
          <Box sx={{ width: 250, bgcolor: 'white', p: 2, borderRight: '1px solid #ddd' }}>
            <Typography variant="overline">Elements</Typography>
            {/* Add DraggableBlock components here as per previous code */}
          </Box>

          {/* Canvas */}
          <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
            <CanvasDropZone elements={elements} selectedId={selectedId} onSelect={setSelectedId} />
          </Box>

          {/* Context-Aware Properties */}
          <PropertiesSidebar 
            selectedElement={elements.find(el => el.id === selectedId)} 
            onUpdate={handleUpdateElement} 
            onDelete={() => { setElements(elements.filter(el => el.id !== selectedId)); setSelectedId(null); }}
          />
        </Box>
      </Box>
    </DndContext>
  );
};

export default TemplateEditor;