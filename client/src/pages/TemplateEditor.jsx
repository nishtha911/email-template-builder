import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const TemplateEditor = () => {
    const { user } = useAuth();
    const [elements, setElements] = useState([]); 
    const [selectedId, setSelectedId] = useState(null);

    // Mock function
    const addBlock = (type) => {
        const newBlock = {
            id: Date.now(),
            type,
            content: type === 'text' ? 'New Text Block' : 'Click to Upload Image',
            styles: { color: '#333', textAlign: 'left', padding: '10px' }
        };
        setElements([...elements, newBlock]);
    };

    return (
        <div className="container-fluid vh-100 p-0 d-flex flex-column">
            {/* Top Toolbar */}
            <div className="bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold" style={{ color: 'var(--primary-theme)' }}>
                    Email Builder <span className="text-muted fw-normal">| {user?.name}</span>
                </h5>
                <button className="btn text-white px-4 fw-bold" style={{ backgroundColor: 'var(--primary-theme)', borderRadius: '8px' }}>
                    Save Template
                </button>
            </div>

            <div className="d-flex flex-grow-1 overflow-hidden">
                {/* 1. Sidebar (Component Library) */}
                <div className="bg-light border-end p-4" style={{ width: '300px' }}>
                    <h6 className="fw-bold mb-4 text-secondary small">BLOCKS</h6>
                    <div className="d-grid gap-3">
                        {['Text', 'Image', 'Button', 'Spacer'].map(block => (
                            <div 
                                key={block}
                                className="p-3 bg-white border rounded shadow-sm text-center cursor-pointer"
                                style={{ cursor: 'pointer', borderStyle: 'dashed' }}
                                onClick={() => addBlock(block.toLowerCase())}
                            >
                                <span className="small fw-bold">{block}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Canvas (Drop Zone) */}
                <div className="flex-grow-1 p-5 overflow-auto" style={{ backgroundColor: '#e9ecef' }}>
                    <div 
                        className="bg-white mx-auto shadow-sm shadow-lg" 
                        style={{ width: '600px', minHeight: '800px', borderRadius: '4px' }}
                    >
                        {elements.length === 0 ? (
                            <div className="text-center p-5 text-muted mt-5">
                                <p>Click a block in the sidebar to add it to your email</p>
                            </div>
                        ) : (
                            elements.map((el) => (
                                <div 
                                    key={el.id} 
                                    className={`p-2 border-bottom position-relative ${selectedId === el.id ? 'border-primary' : ''}`}
                                    onClick={() => setSelectedId(el.id)}
                                    style={el.styles}
                                >
                                    {el.type === 'text' && <p className="mb-0">{el.content}</p>}
                                    {el.type === 'button' && <button className="btn btn-primary">Button</button>}
                                    {el.type === 'image' && <div className="bg-light p-4 text-center">🖼️ Image Placeholder</div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 3. Settings (Contextual Control) */}
                <div className="bg-white border-start p-4" style={{ width: '300px' }}>
                    <h6 className="fw-bold mb-4 text-secondary small">SETTINGS</h6>
                    {selectedId ? (
                        <p className="small text-muted">Editing Block: {selectedId}</p>
                    ) : (
                        <p className="small text-muted italic">Select a block on the canvas to edit its properties.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TemplateEditor;