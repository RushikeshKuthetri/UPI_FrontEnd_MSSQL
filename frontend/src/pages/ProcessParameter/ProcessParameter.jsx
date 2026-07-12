import { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Alert, Snackbar,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import api from '../../api/axios';
import DataTable from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';

const COLUMNS = [
  { field: 'WERKS', headerName: 'Plant' },
  { field: 'Resource', headerName: 'Resource' },
  { field: 'PARANAME', headerName: 'Parameter' },
  { field: 'MKMNR', headerName: 'MKMNR' },
  { field: 'Value', headerName: 'Value' },
  { field: 'UOM', headerName: 'UOM' },
  { field: 'Line', headerName: 'Line' },
  { field: 'PostingDate', headerName: 'Posting Date', renderCell: (r) => r.PostingDate?.split('T')[0] },
  { field: 'PostingTime', headerName: 'Posting Time' },
  { field: 'CreatedBy', headerName: 'Created By' },
];

const EMPTY_FORM = { WERKS: '', PlantName: '', Resource: '', MKMNR: '', UOM: '', PARANAME: '', Value: '', PostingDate: '', PostingTime: '', Line: '' };

export default function ProcessParameter() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ plantCode: '', startDate: '', endDate: '' });
  const [plants, setPlants] = useState([]);
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [isUploadEnabled, setIsUploadEnabled] = useState(false);

  useEffect(() => {
    if (filters.plantCode && filters.postingDate) {
      api.get(`/manual-upload/check?moduleName=ProcessParameter&plantCode=${filters.plantCode}&date=${filters.postingDate}`)
        .then(({ data }) => setIsUploadEnabled(data.enabled))
        .catch(() => setIsUploadEnabled(false));
    } else {
      setIsUploadEnabled(false);
    }
  }, [filters.plantCode, filters.postingDate]);

  useEffect(() => {
    api.get('/users/plants').then(({ data }) => setPlants(data)).catch(() => {});
    fetchData();
  }, []);

  const fetchData = useCallback(async (p = 0) => {
    setLoading(true);
    try {
      const { data } = await api.get('/process-parameter/list', { params: { page: p + 1, limit: 50, ...filters } });
      setRows(data.data || []);
    } catch { setRows([]); }
    finally { setLoading(false); }
  }, [filters]);

  const handleSearch = () => { setPage(0); fetchData(0); };
  const handleUpload = async (file) => {
    const fd = new FormData(); fd.append('file', file);
    try {
      const { data } = await api.post('/process-parameter/upload', fd);
      setSnack({ open: true, msg: data.message, severity: 'success' }); fetchData(page);
    } catch (err) { setSnack({ open: true, msg: err.response?.data?.message || 'Upload failed', severity: 'error' }); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/process-parameter/manual', form);
      setSnack({ open: true, msg: 'Process parameter saved', severity: 'success' });
      setDialogOpen(false); setForm(EMPTY_FORM); fetchData(page);
    } catch (err) { setSnack({ open: true, msg: err.response?.data?.message || 'Save failed', severity: 'error' }); }
    finally { setSaving(false); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Process Parameter</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>New Entry</Button>
      </Box>
      <FilterBar filters={filters} onChange={setFilters} onSearch={handleSearch} onUpload={isUploadEnabled ? handleUpload : null} plants={plants} />
      <DataTable columns={COLUMNS} rows={rows} loading={loading} page={page} rowsPerPage={50}
        onPageChange={(_, p) => { setPage(p); fetchData(p); }} />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Process Parameter Entry</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {[
              { label: 'Plant (WERKS)', field: 'WERKS' },
              { label: 'Plant Name', field: 'PlantName' },
              { label: 'Resource', field: 'Resource' },
              { label: 'MKMNR', field: 'MKMNR' },
              { label: 'Parameter Name', field: 'PARANAME' },
              { label: 'Value', field: 'Value', type: 'number' },
              { label: 'UOM', field: 'UOM' },
              { label: 'Line', field: 'Line' },
              { label: 'Posting Date', field: 'PostingDate', type: 'date' },
              { label: 'Posting Time', field: 'PostingTime', type: 'time' },
            ].map(({ label, field, type = 'text' }) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField fullWidth label={label} type={type} size="small"
                  InputLabelProps={type !== 'text' ? { shrink: true } : undefined}
                  value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
