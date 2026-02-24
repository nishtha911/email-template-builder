import { Box, Typography, TextField, Slider, ToggleButtonGroup, ToggleButton, Divider, Button } from '@mui/material';
import { FormatAlignLeft, FormatAlignCenter, FormatAlignRight, DeleteOutline } from '@mui/icons-material';

const PropertiesSidebar = ({ selectedElement, onUpdate, onDelete }) => {
  if (!selectedElement) {
    return <Box sx={{ width: 300, p: 3, textAlign: 'center' }}><Typography variant="body2" color="textSecondary">Select an element to edit properties</Typography></Box>;
  }

  return (
    <Box sx={{ width: 300, bgcolor: 'white', borderLeft: '1px solid #ddd', p: 3, overflowY: 'auto' }}>
      <Typography variant="h6" sx={{ fontSize: '0.9rem', fontWeight: 'bold', mb: 2 }}>
        PROPERTY SETTINGS ({selectedElement.type.toUpperCase()})
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* COMMON: Content Editor */}
      <TextField
        fullWidth label={selectedElement.type === 'image' ? "Image URL" : "Content"}
        multiline={selectedElement.type === 'text'} rows={3}
        value={selectedElement.content}
        onChange={(e) => onUpdate({ content: e.target.value })}
        sx={{ mb: 3 }}
      />

      {/* TEXT SPECIFIC: Alignment & Font Size */}
      {selectedElement.type === 'text' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" display="block" gutterBottom>Text Alignment</Typography>
          <ToggleButtonGroup
            value={selectedElement.styles.textAlign} exclusive size="small"
            onChange={(e, val) => val && onUpdate({ styles: { ...selectedElement.styles, textAlign: val } })}
          >
            <ToggleButton value="left"><FormatAlignLeft /></ToggleButton>
            <ToggleButton value="center"><FormatAlignCenter /></ToggleButton>
            <ToggleButton value="right"><FormatAlignRight /></ToggleButton>
          </ToggleButtonGroup>

          <Typography variant="caption" display="block" sx={{ mt: 3 }}>Font Size ({selectedElement.styles.fontSize}px)</Typography>
          <Slider 
            value={selectedElement.styles.fontSize} min={12} max={48} 
            onChange={(e, val) => onUpdate({ styles: { ...selectedElement.styles, fontSize: val } })} 
          />
        </Box>
      )}

      {/* IMAGE SPECIFIC: Border Radius */}
      {selectedElement.type === 'image' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" display="block">Corner Rounding (Border Radius)</Typography>
          <Slider 
            value={selectedElement.styles.borderRadius || 0} min={0} max={100} 
            onChange={(e, val) => onUpdate({ styles: { ...selectedElement.styles, borderRadius: val } })} 
          />
        </Box>
      )}

      <Button fullWidth variant="outlined" color="error" startIcon={<DeleteOutline />} onClick={onDelete} sx={{ mt: 4 }}>
        Delete Element
      </Button>
    </Box>
  );
};

export default PropertiesSidebar;