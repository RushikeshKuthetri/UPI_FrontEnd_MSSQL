import { Box, TextField, Button, MenuItem } from '@mui/material';
import { Search, FileUpload } from '@mui/icons-material';
import { useRef } from 'react';

export default function FilterBar({ filters, onChange, onSearch, onUpload, plants = [] }) {
  const fileRef = useRef();

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      {plants.length > 0 && (
        <TextField
          select label="Plant" size="small" sx={{ minWidth: 140 }}
          value={filters.plantCode || ''}
          onChange={(e) => onChange({ ...filters, plantCode: e.target.value })}
        >
          <MenuItem value="">All Plants</MenuItem>
          {plants.map((p) => (
            <MenuItem key={p.PlantCode} value={p.PlantCode}>{p.PlantName || p.PlantCode}</MenuItem>
          ))}
        </TextField>
      )}
      <TextField
        label="From Date" type="date" size="small" sx={{ minWidth: 150 }}
        InputLabelProps={{ shrink: true }}
        value={filters.startDate || ''}
        onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
      />
      <TextField
        label="To Date" type="date" size="small" sx={{ minWidth: 150 }}
        InputLabelProps={{ shrink: true }}
        value={filters.endDate || ''}
        onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
      />
      <Button variant="contained" startIcon={<Search />} onClick={onSearch} size="medium">
        Search
      </Button>
      {onUpload && (
        <>
          <Button
            variant="outlined" startIcon={<FileUpload />} size="medium"
            onClick={() => fileRef.current.click()}
          >
            Upload Excel
          </Button>
          <input
            ref={fileRef} type="file" accept=".xlsx,.xls" hidden
            onChange={(e) => { onUpload(e.target.files[0]); e.target.value = ''; }}
          />
        </>
      )}
    </Box>
  );
}
