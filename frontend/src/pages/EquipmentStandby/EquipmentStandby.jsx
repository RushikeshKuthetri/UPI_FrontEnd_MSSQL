import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Alert, Snackbar, Chip, MenuItem, Table, TableHead, TableBody,
  TableRow, TableCell, Paper, CircularProgress, IconButton, Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Search, FileUpload, Send, EventNote } from '@mui/icons-material';
import api from '../../api/axios';

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export default function EquipmentStandby() {
  const yest = getYesterday();
  const fileRef = useRef();

  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ plantCode: '', postingDate: yest, line: '' });

  const apiParams = (f) => {
    const src = f || filters;
    return { ...src, startDate: src.postingDate, endDate: src.postingDate };
  };
  const [plants, setPlants]   = useState([]);
  const [lines, setLines]     = useState([]);
  const [snack, setSnack]     = useState({ open: false, msg: '', severity: 'success' });

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving]     = useState(false);

  const [openEventsOpen, setOpenEventsOpen]       = useState(false);
  const [openEventsRows, setOpenEventsRows]       = useState([]);
  const [openEventsLoading, setOpenEventsLoading] = useState(false);

  const [newEntryOpen, setNewEntryOpen] = useState(false);
  const [newForm, setNewForm] = useState({
    PlantCode: '', ResourceCode: '', EquipmentNo: '',
    PostingDate: yest, StartTime: '', StopTime: '', Line: '', Duration: '',
  });

  useEffect(() => {
    api.get('/users/plants').then(({ data }) => setPlants(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (filters.plantCode) {
      api.get('/equipment-standby/lines', { params: { plantCode: filters.plantCode } })
        .then(({ data }) => setLines(data))
        .catch(() => setLines([]));
    } else {
      setLines([]);
      setFilters((f) => ({ ...f, line: '' }));
    }
  }, [filters.plantCode]);

  const fetchData = useCallback(async (f) => {
    setLoading(true);
    try {
      const { data } = await api.get('/equipment-standby/list', { params: apiParams(f) });
      setRows(data.data || []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleSearch = () => fetchData(filters);

  const handleEdit = (row) => {
    setEditForm({
      WERKS:       row.WERKS,
      ARBPL:       row.ARBPL,
      PostingDate: (row.PostingDate || '').split('T')[0],
      StartTime:   row.StartTime,
      EQUNR:       row.EQUNR || '',
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await api.put('/equipment-standby/update', editForm);
      showSnack('Record updated successfully', 'success');
      setEditOpen(false);
      fetchData();
    } catch (err) {
      showSnack(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSendToSAP = async () => {
    try {
      await api.post('/equipment-standby/send-to-sap', apiParams());
      showSnack('Equipment standby sent to SAP successfully', 'success');
      fetchData();
    } catch (err) {
      showSnack(err.response?.data?.message || 'Send to SAP failed', 'error');
    }
  };

  const handleOpenEvents = async () => {
    setOpenEventsOpen(true);
    setOpenEventsLoading(true);
    try {
      const { data } = await api.get('/equipment-standby/open-events', { params: apiParams() });
      setOpenEventsRows(data || []);
    } catch {
      setOpenEventsRows([]);
    } finally {
      setOpenEventsLoading(false);
    }
  };

  const handleUpload = async (file) => {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { data } = await api.post('/equipment-standby/upload', fd);
      showSnack(data.message, 'success');
      fetchData();
    } catch (err) {
      showSnack(err.response?.data?.message || 'Upload failed', 'error');
    }
  };

  const handleSaveNewEntry = async () => {
    setSaving(true);
    try {
      await api.post('/equipment-standby/manual', newForm);
      showSnack('Equipment standby saved successfully', 'success');
      setNewEntryOpen(false);
      fetchData();
    } catch (err) {
      showSnack(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showSnack = (msg, severity = 'success') => setSnack({ open: true, msg, severity });

  const TH = ({ children }) => (
    <TableCell sx={{ fontWeight: 700, bgcolor: '#fe8f12', color: '#fff', whiteSpace: 'nowrap' }}>
      {children}
    </TableCell>
  );

  return (
    <Box>
      {/* ── Page Header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Equipment Standby</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button size="small" variant="text" sx={{ textDecoration: 'underline' }}
            component="a"
            href={`${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api$/, '')}/templates/Upload_Stoppage.xlsx`}
            download="EquipmentStandby_Upload_Template.xlsx">
            Excel Upload Template
          </Button>
          <Button size="small" variant="outlined" startIcon={<FileUpload />}
            onClick={() => fileRef.current.click()}>
            Upload Excel
          </Button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls" hidden
            onChange={(e) => { if (e.target.files[0]) handleUpload(e.target.files[0]); e.target.value = ''; }} />
          <Button size="small" variant="contained" onClick={() => setNewEntryOpen(true)}>
            New Entry
          </Button>
        </Box>
      </Box>

      {/* ── Filters ── */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField label="Date" type="date" size="small" sx={{ minWidth: 150 }}
            InputLabelProps={{ shrink: true }}
            value={filters.postingDate}
            onChange={(e) => setFilters((f) => ({ ...f, postingDate: e.target.value }))} />
          <TextField select label="Plant" size="small" sx={{ minWidth: 180 }}
            value={filters.plantCode}
            onChange={(e) => setFilters((f) => ({ ...f, plantCode: e.target.value, line: '' }))}>
            <MenuItem value="">All Plants</MenuItem>
            {plants.map((p) => (
              <MenuItem key={p.PlantCode} value={p.PlantCode}>{p.PlantName || p.PlantCode}</MenuItem>
            ))}
          </TextField>
          <TextField select label="Line" size="small" sx={{ minWidth: 130 }}
            value={filters.line}
            onChange={(e) => setFilters((f) => ({ ...f, line: e.target.value }))}>
            <MenuItem value="">All Lines</MenuItem>
            {lines.map((l) => (
              <MenuItem key={l.UnitCode} value={l.UnitCode}>{l.Descr || l.UnitCode}</MenuItem>
            ))}
          </TextField>
          <Button variant="contained" startIcon={<Search />} onClick={handleSearch}>
            Search
          </Button>
        </Box>
      </Paper>

      {/* ── Action Buttons ── */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" color="error" startIcon={<Send />}
          onClick={handleSendToSAP} sx={{ fontWeight: 700 }}>
          SEND TO SAP
        </Button>
        <Button variant="outlined" color="info" startIcon={<EventNote />}
          onClick={handleOpenEvents} sx={{ fontWeight: 700 }}>
          OPEN EVENTS
        </Button>
      </Box>

      {/* ── Main Table ── */}
      <Paper elevation={2} sx={{ mb: 3, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : (
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TH>Resource</TH>
                <TH>Equipment No</TH>
                <TH>Start Time</TH>
                <TH>Stop Time</TH>
                <TH>Duration</TH>
                <TH>Line</TH>
                <TH>Action</TH>
                <TH>SAP Status</TH>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      No records found. Select filters and click Search.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : rows.map((row, i) => (
                <TableRow key={i} hover>
                  <TableCell>{row.ARBPL}</TableCell>
                  <TableCell>{row.EQUNR}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.StartTime}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.StopTime}</TableCell>
                  <TableCell>{row.Duration}</TableCell>
                  <TableCell>{row.Line}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton size="small" color="warning" onClick={() => handleEdit(row)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {row.SAPStatus
                      ? <Chip label="Uploaded" size="small" color="success" />
                      : <Chip label="Pending" size="small" variant="outlined" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* ── Edit Dialog ── */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Equipment Standby</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Resource" size="small" value={editForm.ARBPL || ''} disabled />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Start Time" size="small" value={editForm.StartTime || ''} disabled />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Equipment No (EQUNR)" size="small"
                value={editForm.EQUNR || ''}
                onChange={(e) => setEditForm((f) => ({ ...f, EQUNR: e.target.value }))} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── New Entry Dialog ── */}
      <Dialog open={newEntryOpen} onClose={() => setNewEntryOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Equipment Standby Entry</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {[
              { label: 'Plant Code',   field: 'PlantCode' },
              { label: 'Resource',     field: 'ResourceCode' },
              { label: 'Equipment No', field: 'EquipmentNo' },
              { label: 'Line',         field: 'Line' },
              { label: 'Posting Date', field: 'PostingDate', type: 'date' },
              { label: 'Start Time',   field: 'StartTime',   type: 'time' },
              { label: 'Stop Time',    field: 'StopTime',    type: 'time' },
              { label: 'Duration',     field: 'Duration' },
            ].map(({ label, field, type = 'text' }) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField fullWidth label={label} type={type} size="small"
                  InputLabelProps={type !== 'text' ? { shrink: true } : undefined}
                  value={newForm[field] || ''}
                  onChange={(e) => setNewForm((f) => ({ ...f, [field]: e.target.value }))} />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewEntryOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveNewEntry} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Open Events Dialog ── */}
      <Dialog open={openEventsOpen} onClose={() => setOpenEventsOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Open Events (Equipment Still Running)</DialogTitle>
        <DialogContent>
          {openEventsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Resource', 'Equipment No', 'Start Time', 'Stop Time', 'Duration', 'Line'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, bgcolor: '#fe8f12', color: '#fff' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {openEventsRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No open events found</TableCell>
                  </TableRow>
                ) : openEventsRows.map((r, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{r.ARBPL}</TableCell>
                    <TableCell>{r.EQUNR}</TableCell>
                    <TableCell>{r.StartTime}</TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell>{r.Duration}</TableCell>
                    <TableCell>{r.Line}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEventsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ── */}
      <Snackbar open={snack.open} autoHideDuration={5000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
