import React from 'react';
import {
  Box, Typography, Slider, TextField, ToggleButtonGroup, ToggleButton,
  Divider, Stack, Select, MenuItem, FormControl,
  IconButton
} from '@mui/material';
import {
  FormatAlignLeft, FormatAlignCenter, FormatAlignRight,
  FormatBold, FormatItalic, FormatUnderlined, Delete as DeleteIcon,
  TextFields, Image as ImageIcon, SmartButton, HorizontalRule
} from '@mui/icons-material';

const FONT_FAMILIES = ['Arial', 'Georgia', 'Helvetica', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana'];
const FONT_WEIGHTS = ['400', '500', '600', '700', '800'];

interface ElementStyles {
  fontSize?: number;
  textAlign?: string;
  color?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  borderRadius?: number;
  width?: string;
  display?: string;
  marginLeft?: string;
  marginRight?: string;
  [key: string]: unknown;
}

interface ElementData {
  id: string;
  type: 'text' | 'image' | 'button' | 'divider';
  content: string;
  styles: ElementStyles;
}

interface UpdatePayload {
  content?: string;
  styles?: Partial<ElementStyles>;
}

interface SectionLabelProps {
  children: React.ReactNode;
}

interface ControlBlockProps {
  children: React.ReactNode;
}

interface TextControlsProps {
  element: ElementData;
  onUpdate: (payload: UpdatePayload) => void;
}

interface ImageControlsProps {
  element: ElementData;
  onUpdate: (payload: UpdatePayload) => void;
}

interface PropertiesSidebarProps {
  selectedElement: ElementData | undefined;
  onUpdate: (payload: UpdatePayload) => void;
  onDelete: () => void;
}

const sxField: any = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px', fontSize: '0.85rem',
    background: 'rgba(var(--bg-paper-rgb),0.7)',
    '& fieldset': { borderColor: 'rgba(var(--primary-rgb),0.15)' },
    '&:hover fieldset': { borderColor: 'rgba(var(--primary-rgb),0.3)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--primary-main)' },
  },
};

const SectionLabel: React.FC<SectionLabelProps> = ({ children }) => (
  <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--primary-main)', letterSpacing: '0.8px', textTransform: 'uppercase', mb: 0.8 }}>
    {children}
  </Typography>
);

const ControlBlock: React.FC<ControlBlockProps> = ({ children }) => (
  <Box sx={{ background: 'rgba(var(--bg-paper-rgb),0.6)', border: '1px solid rgba(var(--primary-rgb),0.08)', borderRadius: '12px', p: 1.8 }}>
    {children}
  </Box>
);

const TextControls: React.FC<TextControlsProps> = ({ element, onUpdate }) => {
  const s = element.styles;

  const toggleStyle = (prop: string, onVal: string, offVal: string) => {
    onUpdate({ styles: { [prop]: s[prop] === onVal ? offVal : onVal } });
  };

  return (
    <>
      <ControlBlock>
        <SectionLabel>Content</SectionLabel>
        <TextField
          fullWidth multiline rows={3} size="small" variant="outlined"
          value={element.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          sx={sxField}
        />
      </ControlBlock>

      <ControlBlock>
        <SectionLabel>Font Family</SectionLabel>
        <FormControl fullWidth size="small">
          <Select
            value={s.fontFamily || 'Arial'}
            onChange={(e) => onUpdate({ styles: { fontFamily: e.target.value } })}
            sx={{ borderRadius: '8px', fontSize: '0.85rem', background: 'rgba(var(--bg-paper-rgb),0.7)', '& fieldset': { borderColor: 'rgba(var(--primary-rgb),0.15)' } }}
          >
            {FONT_FAMILIES.map((f) => (
              <MenuItem key={f} value={f} style={{ fontFamily: f, fontSize: '0.85rem' }}>{f}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </ControlBlock>

      <ControlBlock>
        <SectionLabel>Font Size — {s.fontSize}px</SectionLabel>
        <Slider value={s.fontSize ?? 18} min={12} max={80}
          onChange={(_e, val) => onUpdate({ styles: { fontSize: val as number } })}
          sx={{ color: 'var(--primary-main)', '& .MuiSlider-thumb': { width: 14, height: 14 } }} />
      </ControlBlock>

      <ControlBlock>
        <SectionLabel>Font Weight</SectionLabel>
        <FormControl fullWidth size="small">
          <Select
            value={s.fontWeight || '400'}
            onChange={(e) => onUpdate({ styles: { fontWeight: e.target.value } })}
            sx={{ borderRadius: '8px', fontSize: '0.85rem', background: 'rgba(var(--bg-paper-rgb),0.7)', '& fieldset': { borderColor: 'rgba(var(--primary-rgb),0.15)' } }}
          >
            {FONT_WEIGHTS.map((w) => (
              <MenuItem key={w} value={w} style={{ fontWeight: parseInt(w), fontSize: '0.85rem' }}>{w}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </ControlBlock>

      <ControlBlock>
        <SectionLabel>Text Color</SectionLabel>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <input
            type="color" value={(s.color as string) || '#333333'}
            onChange={(e) => onUpdate({ styles: { color: e.target.value } })}
            style={{ width: 36, height: 34, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 2, background: 'none' }}
          />
          <TextField
            size="small" variant="outlined"
            value={(s.color as string) || '#333333'}
            onChange={(e) => onUpdate({ styles: { color: e.target.value } })}
            sx={{ flexGrow: 1, ...sxField }}
          />
        </Box>
      </ControlBlock>

      <ControlBlock>
        <SectionLabel>Background Color</SectionLabel>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <input
            type="color" value={(s.backgroundColor as string) || '#ffffff'}
            onChange={(e) => onUpdate({ styles: { backgroundColor: e.target.value } })}
            style={{ width: 36, height: 34, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 2, background: 'none' }}
          />
          <TextField
            size="small" variant="outlined"
            value={(s.backgroundColor as string) || '#ffffff'}
            onChange={(e) => onUpdate({ styles: { backgroundColor: e.target.value } })}
            sx={{ flexGrow: 1, ...sxField }}
          />
        </Box>
      </ControlBlock>

      <ControlBlock>
        <SectionLabel>Style & Alignment</SectionLabel>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <ToggleButtonGroup size="small">
            <ToggleButton value="bold" selected={s.fontWeight === '700' || s.fontWeight === '800'}
              onChange={() => toggleStyle('fontWeight', '700', '400')}
              sx={{ borderRadius: '8px !important', '&.Mui-selected': { background: 'rgba(var(--primary-rgb),0.12)', color: 'var(--primary-main)' } }}>
              <FormatBold fontSize="small" />
            </ToggleButton>
            <ToggleButton value="italic" selected={s.fontStyle === 'italic'}
              onChange={() => toggleStyle('fontStyle', 'italic', 'normal')}
              sx={{ '&.Mui-selected': { background: 'rgba(var(--primary-rgb),0.12)', color: 'var(--primary-main)' } }}>
              <FormatItalic fontSize="small" />
            </ToggleButton>
            <ToggleButton value="underline" selected={s.textDecoration === 'underline'}
              onChange={() => toggleStyle('textDecoration', 'underline', 'none')}
              sx={{ '&.Mui-selected': { background: 'rgba(var(--primary-rgb),0.12)', color: 'var(--primary-main)' } }}>
              <FormatUnderlined fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup fullWidth exclusive size="small"
            value={s.textAlign}
            onChange={(_e, val) => val && onUpdate({ styles: { textAlign: val } })}>
            <ToggleButton value="left" sx={{ '&.Mui-selected': { background: 'rgba(var(--primary-rgb),0.12)', color: 'var(--primary-main)' } }}><FormatAlignLeft fontSize="small" /></ToggleButton>
            <ToggleButton value="center" sx={{ '&.Mui-selected': { background: 'rgba(var(--primary-rgb),0.12)', color: 'var(--primary-main)' } }}><FormatAlignCenter fontSize="small" /></ToggleButton>
            <ToggleButton value="right" sx={{ '&.Mui-selected': { background: 'rgba(var(--primary-rgb),0.12)', color: 'var(--primary-main)' } }}><FormatAlignRight fontSize="small" /></ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </ControlBlock>
    </>
  );
};

const DividerControls: React.FC<ImageControlsProps> = ({ element, onUpdate }) => {
  const s = element.styles;
  return (
    <>
      <ControlBlock>
        <SectionLabel>Color</SectionLabel>
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <input
            type="color" value={(s.borderTopColor as string) || '#dddddd'}
            onChange={(e) => onUpdate({ styles: { borderTop: `2px solid ${e.target.value}`, borderTopColor: e.target.value } })}
            style={{ width: 36, height: 34, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 2, background: 'none' }}
          />
          <TextField
            size="small" variant="outlined"
            value={(s.borderTopColor as string) || '#dddddd'}
            onChange={(e) => onUpdate({ styles: { borderTop: `2px solid ${e.target.value}`, borderTopColor: e.target.value } })}
            sx={{ flexGrow: 1, ...sxField }}
          />
        </Box>
      </ControlBlock>
      <ControlBlock>
        <SectionLabel>Margin (Top/Bottom) — {parseInt(s.margin?.toString() || '15') || 15}px</SectionLabel>
        <Slider value={parseInt(s.margin?.toString() || '15') || 15} min={0} max={60}
          onChange={(_e, val) => onUpdate({ styles: { margin: `${val}px 0` } })}
          sx={{ color: 'var(--primary-main)', '& .MuiSlider-thumb': { width: 14, height: 14 } }} />
      </ControlBlock>
    </>
  );
};

const ImageControls: React.FC<ImageControlsProps> = ({ element, onUpdate }) => {
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
          sx={sxField}
        />
      </ControlBlock>

      <ControlBlock>
        <SectionLabel>Corner Radius — {s.borderRadius}px</SectionLabel>
        <Slider value={s.borderRadius ?? 0} min={0} max={100}
          onChange={(_e, val) => onUpdate({ styles: { borderRadius: val as number } })}
          sx={{ color: 'var(--primary-main)', '& .MuiSlider-thumb': { width: 14, height: 14 } }} />
      </ControlBlock>

      <ControlBlock>
        <SectionLabel>Width — {parseInt(s.width ?? '100') || 100}%</SectionLabel>
        <Slider value={parseInt(s.width ?? '100') || 100} min={20} max={100}
          onChange={(_e, val) => onUpdate({ styles: { width: `${val}%` } })}
          sx={{ color: 'var(--primary-main)', '& .MuiSlider-thumb': { width: 14, height: 14 } }} />
      </ControlBlock>

      <ControlBlock>
        <SectionLabel>Alignment</SectionLabel>
        <ToggleButtonGroup fullWidth exclusive size="small" value={alignVal}
          onChange={(_e, val) => {
            if (!val) return;
            if (val === 'center') onUpdate({ styles: { display: 'block', marginLeft: 'auto', marginRight: 'auto' } });
            if (val === 'left') onUpdate({ styles: { display: 'block', marginLeft: '0', marginRight: 'auto' } });
            if (val === 'right') onUpdate({ styles: { display: 'block', marginLeft: 'auto', marginRight: '0' } });
          }}>
          <ToggleButton value="left" sx={{ '&.Mui-selected': { background: 'rgba(var(--primary-rgb),0.12)', color: 'var(--primary-main)' } }}><FormatAlignLeft fontSize="small" /></ToggleButton>
          <ToggleButton value="center" sx={{ '&.Mui-selected': { background: 'rgba(var(--primary-rgb),0.12)', color: 'var(--primary-main)' } }}><FormatAlignCenter fontSize="small" /></ToggleButton>
          <ToggleButton value="right" sx={{ '&.Mui-selected': { background: 'rgba(var(--primary-rgb),0.12)', color: 'var(--primary-main)' } }}><FormatAlignRight fontSize="small" /></ToggleButton>
        </ToggleButtonGroup>
      </ControlBlock>
    </>
  );
};

const PropertiesSidebar: React.FC<PropertiesSidebarProps> = ({ selectedElement, onUpdate, onDelete }) => {
  if (!selectedElement) {
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.4 }}>
        <Box sx={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(var(--primary-rgb),0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
          <TextFields sx={{ color: 'var(--primary-main)', fontSize: 22 }} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#444', textAlign: 'center' }}>
          Select an element
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', mt: 0.5 }}>
          Click any element on the canvas to edit its properties.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, overflowY: 'auto', height: '100%', boxSizing: 'border-box'}}>
      <Stack display={'flex'} direction={'row'} justifyContent={'space-between'} mb={1} >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
          <Box sx={{
            width: 30, height: 30, borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(var(--primary-rgb),0.15), rgba(var(--primary-rgb),0.08))',
            border: '1px solid rgba(var(--primary-rgb),0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {selectedElement.type === 'text' && <TextFields sx={{ fontSize: 15, color: 'var(--primary-main)' }} />}
            {selectedElement.type === 'image' && <ImageIcon sx={{ fontSize: 15, color: 'var(--primary-main)' }} />}
            {selectedElement.type === 'button' && <SmartButton sx={{ fontSize: 15, color: 'var(--primary-main)' }} />}
            {selectedElement.type === 'divider' && <HorizontalRule sx={{ fontSize: 15, color: 'var(--primary-main)' }} />}
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1 }}>
              {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Properties
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Edit element below
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onDelete}
          sx={{
            alignSelf: 'flex-start',
            color: '#d32f2f',
            transition: 'transform 0.2s ease, color 0.2s ease',
            '&:hover': {
              color: '#b71c1c',
              transform: 'scale(1.1)',
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>

      <Divider sx={{ mb: 2, borderColor: 'rgba(var(--primary-rgb),0.08)' }} />

      <Stack spacing={1}>
        {(selectedElement.type === 'text' || selectedElement.type === 'button') && <TextControls element={selectedElement} onUpdate={onUpdate} />}
        {selectedElement.type === 'image' && <ImageControls element={selectedElement} onUpdate={onUpdate} />}
        {selectedElement.type === 'divider' && <DividerControls element={selectedElement} onUpdate={onUpdate} />}

      </Stack>
    </Box>
  );
};

export default PropertiesSidebar;