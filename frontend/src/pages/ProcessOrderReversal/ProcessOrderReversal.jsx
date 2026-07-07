import { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Grid, TextField, MenuItem, Button, Paper, Table,
  TableHead, TableBody, TableRow, TableCell, Checkbox, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Snackbar, CircularProgress,
} from '@mui/material';
import { Search, Undo } from '@mui/icons-material';
import api from '../../api/axios';

const COLUMNS = [
  { field: 'WERKS', label: 'Plant' },
  { field: 'Resource', label: 'Resource' },
  { field: 'Material', label: 'Material' },
  { field: 'PostingDate', label: 'Posting Date', render: (v) => v?.split('T')[0] },
  { field: 'Goods', label: 'Goods' },
  { field: 'Batch', label: 'Batch' },
  { field: 'Line', label: 'Line' },
  { field: 'MovementType', label: 'Mov. Type' },
  { field: 'Quantity', label: 'Quantity' },
  { field: 'UOM', label: 'UOM' },
  { field: 'SAPStatus', label: 'SAP Status', render: (v) => v ? <Chip label={v} size="small" color={v === 'S' ? 'success' : 'error'} /> : '—' },
  { field: 'CreatedBy', label: 'Created By' },
];

export default function ProcessOrderReversal() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plants, setPlants] = useState([]);
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState({ plantCode: '', resource: '', material: '', postingDate: '' });
  const [selected, setSelected] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reversalMode, setReversalMode] = useState('single'); // 'single' | 'bulk'
  const [singleRow, setSingleRow] = useState(null);
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  useEffect(() => {
    api.get('/users/plants').then(({ data }) => setPlants(data)).catch(() => {});
  }, []);

  const loadResources = async (plantCode) => {
    if (!plantCode) return;
    const { data } = await api.get('/master/resources', { params: { plantCode } });
    setResources(data);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setSelected([]);
    try {
      const { data } = await api.get('/po-reversal', { params: { ...filter, page: 1, limit: 100 } });
      setRows(data.data || []);
    } catch { setRows([]); }
    finally { setLoading(false); }
  }, [filter]);

  const toggleSelect = (id) => {
    setSelected((s) => s.includes(id) ? s.filter((i) => i !== id) : [...s, id]);
  };

  const toggleAll = () => {
    setSelected(selected.length === rows.length ? [] : rows.map((r) => r.Id));
  };

  const openSingleReverse = (row) => {
    setSingleRow(row);
    setReversalMode('single');
    setReason('');
    setConfirmOpen(true);
  };

  const openBulkReverse = () => {
    if (!selected.length) {
      setSnack({ open: true, msg: 'Select at least one record to reverse', severity: 'warning' });
      return;
    }
    setReversalMode('bulk');
    setReason('');
    setConfirmOpen(true);
  };

  const handleConfirmReverse = async () => {
    setSaving(true);
    try {
      if (reversalMode === 'single') {
        await api.post('/po-reversal/reverse', { Id: singleRow.Id, Reason: reason || 'Manual reversal' });
        setSnack({ open: true, msg: 'Record reversed successfully', severity: 'success' });
      } else {
        const { data } = await api.post('/po-reversal/bulk-reverse', { ids: selected, Reason: reason || 'Bulk reversal' });
        setSnack({ open: true, msg: data.message, severity: 'success' });
      }
      setConfirmOpen(false);
      fetchData();
    } catch (err) {
      setSnack({ open: true, msg: err.response?.data?.message || 'Reversal failed', severity: 'error' });
    } finally { setSaving(false); }
  };

  const f = (field) => (e) => setFilter((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Process Order Reversal</Typography>
        <Button
          variant="outlined" color="error" startIcon={<Undo />}
          onClick={openBulkReverse} disabled={!selected.length}
        >
          Reverse Selected ({selected.length})
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField select label="Plant" size="small" sx={{ minWidth: 150 }} value={filter.plantCode}
          onChange={(e) => { f('plantCode')(e); loadResources(e.target.value); }}>
          <MenuItem value="">All Plants</MenuItem>
          {plants.map((p) => <MenuItem key={p.PlantCode} value={p.PlantCode}>{p.PlantName || p.PlantCode}</MenuItem>)}
        </TextField>
        <TextField select label="Resource" size="small" sx={{ minWidth: 150 }} value={filter.resource} onChange={f('resource')}>
          <MenuItem value="">All Resources</MenuItem>
          {resources.map((r) => <MenuItem key={r.ResourceCode} value={r.ResourceCode}>{r.ResourceCode}</MenuItem>)}
        </TextField>
        <TextField label="Material" size="small" sx={{ minWidth: 130 }} value={filter.material} onChange={f('material')} />
        <TextField label="Posting Date" type="date" size="small" InputLabelProps={{ shrink: true }}
          value={filter.postingDate} onChange={f('postingDate')} />
        <Button variant="contained" startIcon={<Search />} onClick={fetchData}>Search</Button>
      </Box>

      {/* Grid */}
      <Paper elevation={2}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : (
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell padding="checkbox">
                  <Checkbox indeterminate={selected.length > 0 && selected.length < rows.length}
                    checked={rows.length > 0 && selected.length === rows.length} onChange={toggleAll} />
                </TableCell>
                {COLUMNS.map((c) => <TableCell key={c.field} sx={{ fontWeight: 700 }}>{c.label}</TableCell>)}
                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length + 2} align="center" sx={{ color: 'text.secondary', py: 4 }}>
                    No transferred records found. Apply filters and search.
                  </TableCell>
                </TableRow>
              ) : rows.map((row) => (
                <TableRow key={row.Id} hover selected={selected.includes(row.Id)}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(row.Id)} onChange={() => toggleSelect(row.Id)} />
                  </TableCell>
                  {COLUMNS.map((c) => (
                    <TableCell key={c.field}>
                      {c.render ? c.render(row[c.field]) : row[c.field]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button size="small" color="error" startIcon={<Undo />} onClick={() => openSingleReverse(row)}>
                      Reverse
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'error.main' }}>
          {reversalMode === 'single' ? `Reverse Record — ${singleRow?.Goods}` : `Bulk Reverse ${selected.length} Records`}
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This will mark the selected record(s) as reversed and create a reversal entry. This action cannot be undone.
          </Alert>
          {reversalMode === 'single' && singleRow && (
            <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, fontSize: 13 }}>
              <strong>Plant:</strong> {singleRow.WERKS} | <strong>Resource:</strong> {singleRow.Resource} |
              <strong> Material:</strong> {singleRow.Material} | <strong>Goods:</strong> {singleRow.Goods} |
              <strong> Qty:</strong> {singleRow.Quantity} {singleRow.UOM}
            </Box>
          )}
          <TextField
            fullWidth label="Reason for Reversal" multiline rows={2} size="small"
            value={reason} onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Incorrect quantity posted"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" startIcon={<Undo />} onClick={handleConfirmReverse} disabled={saving}>
            {saving ? 'Processing...' : 'Confirm Reversal'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
