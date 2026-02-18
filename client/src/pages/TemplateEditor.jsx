import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useAuth } from '../context/AuthContext';
import { saveTemplate, fetchTemplateById } from '../api';
import { compileToHTML } from '../../../server/src/utils/compiler'; 

const DraggableBlock = ({ type, label }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: { type }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999,
    opacity: isDragging ? 0.6 : 1,
    cursor: 'grab'
  } : { cursor: 'grab' };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className="p-3 bg-white border rounded shadow-sm text-center mb-3 border-secondary-subtle"
    >
      <span className="small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>{label}</span>
    </div>
  );
};

const CanvasDropZone = ({ elements, selectedId, onSelect }) => {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-zone' });

  const canvasStyle = {
    width: '100%',
    maxWidth: '600px',
    minHeight: '800px',
    borderRadius: '4px',
    backgroundColor: isOver ? '#fff5fd' : 'white',
    transition: 'background-color 0.2s ease',
    outline: isOver ? '2px dashed var(--primary-theme)' : 'none'
  };

  return (
    <div 
      ref={setNodeRef}
      className="bg-white mx-auto shadow-lg" 
      style={canvasStyle}
    >
      {elements.length === 0 ? (
        <div className="text-center p-5 text-muted mt-5">
          <i className="bi bi-plus-circle fs-1 mb-3 d-block"></i>
          <p className="fw-light">Drag elements from the left sidebar and drop them here.</p>
        </div>
      ) : (
        elements.map((el) => (
          <div 
            key={el.id} 
            className={`p-3 border-bottom position-relative ${selectedId === el.id ? 'border-primary border-2' : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(el.id);
            }}
            style={{ ...el.styles, cursor: 'pointer' }}
          >
            {el.type === 'text' && <p className="mb-0">{el.content}</p>}
            {el.type === 'button' && (
                <div className="text-center">
                    <button className="btn text-white px-4 py-2" style={{ backgroundColor: 'var(--primary-theme)', pointerEvents: 'none' }}>
                        {el.content || 'Action Button'}
                    </button>
                </div>
            )}
            {el.type === 'image' && (
                <div className="bg-light p-5 text-center border border-dashed rounded text-muted">
                    <small>🖼️ Image Placeholder</small>
                </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const TemplateEditor = () => {
  const { id } = useParams(); 
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [templateName, setTemplateName] = useState("New Template");
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const loadTemplate = async () => {
        setIsPageLoading(true);
        try {
          const { data } = await fetchTemplateById(id);
          setTemplateName(data.name);
          setElements(typeof data.content === 'string' ? JSON.parse(data.content) : data.content); 
        } catch (err) {
          console.error(err);
          alert("Failed to load template");
        } finally {
          setIsPageLoading(false);
        }
      };
      loadTemplate();
    }
  }, [id]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && over.id === 'canvas-zone') {
      const type = active.data.current.type;
      const newBlock = {
        id: `block-${Date.now()}`,
        type,
        content: type === 'text' ? 'Click to edit this text content.' : (type === 'button' ? 'Click Here' : ''),
        styles: { padding: '20px', backgroundColor: 'transparent' }
      };
      setElements([...elements, newBlock]);
    }
  };

  const handleSave = async () => {
    if (elements.length === 0) return alert("Canvas is empty!");

    try {
      const payload = {
        id: id || null, 
        name: templateName,
        content: elements 
      };
      await saveTemplate(payload);
      alert(id ? "Template updated!" : "Template saved successfully!");
      navigate('/templates'); 
    } catch (err) {
      console.error(err);
      alert("Error saving template.");
    }
  };

  const handlePreview = () => {
      const htmlContent = compileToHTML(elements);
      const win = window.open("", "Canvas Preview", "width=800,height=600");
      win.document.write(htmlContent);
      win.document.close();
  };

  if (isPageLoading) return <div className="text-center mt-5 p-5 font-poppins">Loading Template...</div>;

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="container-fluid vh-100 p-0 d-flex flex-column" style={{ backgroundColor: '#f4f4f4', fontFamily: 'Poppins' }}>
        
        {/* Navigation Bar */}
        <nav className="bg-white border-bottom p-3 d-flex justify-content-between align-items-center shadow-sm z-3">
          <div className="d-flex align-items-center">
            <h5 className="mb-0 fw-bold me-4" style={{ color: 'var(--primary-theme)' }}>
                Email Builder
            </h5>
            <input 
                type="text" 
                className="form-control form-control-sm border-0 bg-light px-3" 
                style={{ width: '250px', borderRadius: '20px' }}
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template Name"
            />
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="me-2 small text-muted d-none d-md-inline text-uppercase" style={{fontSize: '0.75rem', fontWeight: '600'}}>User: {user?.name}</span>
            <button 
                onClick={handlePreview}
                className="btn btn-outline-secondary px-3 fw-bold" 
                style={{ borderRadius: '8px' }}
            >
              PREVIEW
            </button>
            <button 
                onClick={handleSave}
                className="btn text-white px-4 fw-bold shadow-sm" 
                style={{ backgroundColor: 'var(--primary-theme)', borderRadius: '8px' }}
            >
              {id ? "UPDATE" : "SAVE"}
            </button>
          </div>
        </nav>

        <div className="d-flex flex-grow-1 overflow-hidden">
          
          {/* Elements Sidebar */}
          <aside className="bg-white border-end p-4 shadow-sm" style={{ width: '260px' }}>
            <h6 className="fw-bold mb-4 text-secondary small" style={{ letterSpacing: '1.5px' }}>ELEMENTS</h6>
            <DraggableBlock type="text" label="Text Block" />
            <DraggableBlock type="image" label="Image Area" />
            <DraggableBlock type="button" label="Call to Action" />
          </aside>

          {/* Canvas Area */}
          <main className="flex-grow-1 p-5 overflow-auto custom-scrollbar bg-secondary-subtle">
            <CanvasDropZone 
              elements={elements} 
              selectedId={selectedId} 
              onSelect={setSelectedId} 
            />
          </main>

          {/* Properties Sidebar */}
          <aside className="bg-white border-start p-4 shadow-sm" style={{ width: '300px' }}>
            <h6 className="fw-bold mb-4 text-secondary small" style={{ letterSpacing: '1.5px' }}>PROPERTIES</h6>
            {selectedId ? (
               <div>
                 <div className="alert alert-light border small text-muted py-2 mb-4">
                    Block Type: {elements.find(e => e.id === selectedId)?.type.toUpperCase()}
                 </div>
                 
                 <div className="mb-4">
                    <label className="form-label small fw-bold text-secondary">Content Editor</label>
                    <textarea 
                        className="form-control form-control-sm"
                        rows="4"
                        value={elements.find(e => e.id === selectedId)?.content || ""}
                        onChange={(e) => {
                            const newElements = elements.map(el => 
                                el.id === selectedId ? { ...el, content: e.target.value } : el
                            );
                            setElements(newElements);
                        }}
                    ></textarea>
                 </div>

                 <button 
                    className="btn btn-sm btn-outline-danger w-100 mt-4"
                    onClick={() => {
                        setElements(elements.filter(e => e.id !== selectedId));
                        setSelectedId(null);
                    }}
                 >
                    Remove Block
                 </button>
               </div>
            ) : (
              <div className="text-center mt-5 text-muted px-3">
                <p className="small italic">Select a component on the canvas to edit its properties and content.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </DndContext>
  );
};

export default TemplateEditor;