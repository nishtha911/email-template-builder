import {
  Box, Typography, Slider, TextField, ToggleButtonGroup, ToggleButton,
  Divider, Stack, Button, Select, MenuItem, FormControl
} from '@mui/material';
import {
  FormatAlignLeft, FormatAlignCenter, FormatAlignRight,
  FormatBold, FormatItalic, FormatUnderlined, DeleteOutline,
  TextFields, Image as ImageIcon
} from '@mui/icons-material';

const FONT_FAMILIES = ['Arial', 'Georgia', 'Helvetica', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana'];
const FONT_WEIGHTS = ['400', '500', '600', '700', '800'];

const SectionLabel = ({ children }) => (
  <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#963991', letterSpacing: '0.8px', textTransform: 'uppercase', mb: 0.8 }}>
    {children}
  </Typography>
);

const ControlBlock = ({ children }) => (
  <Box sx={{
    background: 'rgba(255,255,255,0.6)',
    border: '1px solid rgba(150,57,145,0.08)',
    borderRadius: '12px', p: 1.8,
  }}>
    {children}
  </Box>
);

const TextControls = ({ element, onUpdate }) => {
  const s = element.styles;

  const toggleStyle = (prop, onVal, offVal) => {
    onUpdate({ styles: { [prop]: s[prop] === onVal ? offVal : onVal } });
  };

  return (
    <>
      <ControlBlock>
        <SectionLabel>Content</SectionLabel>
        <TextField
          fullWidth multiline rows={3} size="small"
          variant="outlined"
          value={element.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px', fontSize: '0.85rem',
              background: 'rgba(255,255,255,0.7)',
              '& fieldset': { borderColor: 'rgba(150,57,145,0.15)' },
              '&:hover fieldset': { borderColor: 'rgba(150,57,145,0.3)' },
              '&.Mui-focused fieldset': { borderColor: '#963991' },
            },
          }}
        />
      </ControlBlock>

      <ControlBlock>
        <SectionLabel>Font Family</SectionLabel>
        <FormControl fullWidth size="small">
          <Select
            value={s.fontFamily || 'Arial'}
            onChange={(e) => onUpdate({ styles: { fontFamily: e.target.value } })}
            sx={{ borderRadius: '8px', fontSize: '0.85rem', background: 'rgba(255,255,255,0.7)', '& fieldset': { borderColor: 'rgba(150,57,145,0.15)' } }}
          >
            {FONT_FAMILIES.map((f) => (
              <MenuItem key={f} value={f} style={{ fontFamily: f, fontSize: '0.85rem' }}>{f}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </ControlBlock>

      <ControlBlock>
        <SectionLabel>Font Size — {s.fontSize}px</SectionLabel>
        <Slider value={s.fontSize} min={12} max={80} onChange={(e, val) => onUpdate({ styles: { fontSize: val } })}
          sx={{ color: '#963991', '& .MuiSlider-thumb': { width: 14, height: 14 } }} />
      </ControlBlock>

      <ControlBlock>
        <SectionLabel>Font Weight</SectionLabel>
        <FormControl fullWidth size="small">
          <Select
            value={s.fontWeight || '400'}
            onChange={(e) => onUpdate({ styles: { fontWeight: e.target.value } })}
            sx={{ borderRadius: '8px', fontSize: '0.85rem', background: 'rgba(255,255,255,0.7)', '& fieldset': { borderColor: 'rgba(150,57,145,0.15)' } }}
          >
            {FONT_WEIGHTS.map((w) => (
              <MenuItem key={w} value={w} style={{ fontWeight: w, fontSize: '0.85rem' }}>{w}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </ControlBlock>

      <ControlBlock>
        <SectionLabel>Text Color</SectionLabel>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <input
            type="color" value={s.color || '#333333'}
            onChange={(e) => onUpdate({ styles: { color: e.target.value } })}
            style={{ width: 36, height: 34, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 2, background: 'none' }}
          />
          <TextField
            size="small" variant="outlined"
            value={s.color || '#333333'}
            onChange={(e) => onUpdate({ styles: { color: e.target.value } })}
            sx={{
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px', fontSize: '0.85rem', background: 'rgba(255,255,255,0.7)',
                '& fieldset': { borderColor: 'rgba(150,57,145,0.15)' },
                '&.Mui-focused fieldset': { borderColor: '#963991' },
              },
            }}
          />
        </Box>
      </ControlBlock>

      <ControlBlock>
        <SectionLabel>Style & Alignment</SectionLabel>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <ToggleButtonGroup size="small">
            <ToggleButton value="bold" selected={s.fontWeight === '700' || s.fontWeight === '800'}
              onChange={() => toggleStyle('fontWeight', '700', '400')}
              sx={{ borderRadius: '8px !important', '&.Mui-selected': { background: 'rgba(150,57,145,0.12)', color: '#963991' } }}>
              <FormatBold fontSize="small" />
            </ToggleButton>
            <ToggleButton value="italic" selected={s.fontStyle === 'italic'}
              onChange={() => toggleStyle('fontStyle', 'italic', 'normal')}
              sx={{ '&.Mui-selected': { background: 'rgba(150,57,145,0.12)', color: '#963991' } }}>
              <FormatItalic fontSize="small" />
            </ToggleButton>
            <ToggleButton value="underline" selected={s.textDecoration === 'underline'}
              onChange={() => toggleStyle('textDecoration', 'underline', 'none')}
              sx={{ '&.Mui-selected': { background: 'rgba(150,57,145,0.12)', color: '#963991' } }}>
              <FormatUnderlined fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup fullWidth exclusive size="small"
            value={s.textAlign}
            onChange={(e, val) => val && onUpdate({ styles: { textAlign: val } })}>
            <ToggleButton value="left" sx={{ '&.Mui-selected': { background: 'rgba(150,57,145,0.12)', color: '#963991' } }}><FormatAlignLeft fontSize="small" /></ToggleButton>
            <ToggleButton value="center" sx={{ '&.Mui-selected': { background: 'rgba(150,57,145,0.12)', color: '#963991' } }}><FormatAlignCenter fontSize="small" /></ToggleButton>
            <ToggleButton value="right" sx={{ '&.Mui-selected': { background: 'rgba(150,57,145,0.12)', color: '#963991' } }}><FormatAlignRight fontSize="small" /></ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </ControlBlock>
    </>
  );
};

const ImageControls = ({ element, onUpdate }) => {
  const s = element.styles;
  const alignVal = s.marginLeft === 'auto' && s.marginRight === 'auto' ? 'center'
    : s.marginLeft === 'auto' ? 'right' : 'left';

  return (
    <>
      <ControlBlock>
        <SectionLabel>Image URL</SectionLabel>
        <TextField
          fullWidth size="small" variant="outlined"
          value={element.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="https://..."
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px', fontSize: '0.82rem', background: 'rgba(255,255,255,0.7)',
              '& fieldset': { borderColor: 'rgba(150,57,145,0.15)' },
              '&.Mui-focused fieldset': { borderColor: '#963991' },
            },
          }}
        />
      </ControlBlock>

      <ControlBlock>
        <SectionLabel>Corner Radius — {s.borderRadius}px</SectionLabel>
        <Slider value={s.borderRadius} min={0} max={100}
          onChange={(e, val) => onUpdate({ styles: { borderRadius: val } })}
          sx={{ color: '#963991', '& .MuiSlider-thumb': { width: 14, height: 14 } }} />
      </ControlBlock>

      <ControlBlock>
        <SectionLabel>Width — {parseInt(s.width) || 100}%</SectionLabel>
        <Slider value={parseInt(s.width) || 100} min={20} max={100}
          onChange={(e, val) => onUpdate({ styles: { width: `${val}%` } })}
          sx={{ color: '#963991', '& .MuiSlider-thumb': { width: 14, height: 14 } }} />
      </ControlBlock>

      <ControlBlock>
        <SectionLabel>Alignment</SectionLabel>
        <ToggleButtonGroup fullWidth exclusive size="small" value={alignVal}
          onChange={(e, val) => {
            if (!val) return;
            if (val === 'center') onUpdate({ styles: { display: 'block', marginLeft: 'auto', marginRight: 'auto' } });
            if (val === 'left') onUpdate({ styles: { display: 'block', marginLeft: '0', marginRight: 'auto' } });
            if (val === 'right') onUpdate({ styles: { display: 'block', marginLeft: 'auto', marginRight: '0' } });
          }}>
          <ToggleButton value="left" sx={{ '&.Mui-selected': { background: 'rgba(150,57,145,0.12)', color: '#963991' } }}><FormatAlignLeft fontSize="small" /></ToggleButton>
          <ToggleButton value="center" sx={{ '&.Mui-selected': { background: 'rgba(150,57,145,0.12)', color: '#963991' } }}><FormatAlignCenter fontSize="small" /></ToggleButton>
          <ToggleButton value="right" sx={{ '&.Mui-selected': { background: 'rgba(150,57,145,0.12)', color: '#963991' } }}><FormatAlignRight fontSize="small" /></ToggleButton>
        </ToggleButtonGroup>
      </ControlBlock>
    </>
  );
};

const PropertiesSidebar = ({ selectedElement, onUpdate, onDelete }) => {
  if (!selectedElement) {
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.4 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(150,57,145,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
          <TextFields sx={{ color: '#963991', fontSize: 22 }} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#444', textAlign: 'center' }}>
          Select an element
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#aaa', textAlign: 'center', mt: 0.5 }}>
          Click any element on the canvas to edit its properties.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box sx={{
          width: 30, height: 30, borderRadius: '8px',
          background: 'linear-gradient(135deg, rgba(150,57,145,0.15), rgba(150,57,145,0.08))',
          border: '1px solid rgba(150,57,145,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {selectedElement.type === 'text'
            ? <TextFields sx={{ fontSize: 15, color: '#963991' }} />
            : <ImageIcon sx={{ fontSize: 15, color: '#963991' }} />}
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#1a1a2e', lineHeight: 1 }}>
            {selectedElement.type === 'text' ? 'Text' : 'Image'} Properties
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: '#aaa' }}>
            Edit element below
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2, borderColor: 'rgba(150,57,145,0.08)' }} />

      <Stack spacing={1.5}>
        {selectedElement.type === 'text' && <TextControls element={selectedElement} onUpdate={onUpdate} />}
        {selectedElement.type === 'image' && <ImageControls element={selectedElement} onUpdate={onUpdate} />}

        <Button
          fullWidth variant="outlined"
          startIcon={<DeleteOutline fontSize="small" />}
          onClick={onDelete}
          sx={{
            fontWeight: 700, fontSize: '0.82rem', textTransform: 'none',
            borderRadius: '10px', borderColor: 'rgba(211,47,47,0.3)',
            color: '#d32f2f', mt: 1,
            '&:hover': { background: 'rgba(211,47,47,0.06)', borderColor: '#d32f2f' },
          }}
        >
          Delete Element
        </Button>
      </Stack>
    </Box>
  );
};

export default PropertiesSidebar;