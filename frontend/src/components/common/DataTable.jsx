import {
  Paper, Table, TableHead, TableBody, TableRow, TableCell,
  TablePagination, Box, CircularProgress, Typography,
} from '@mui/material';

export default function DataTable({ columns, rows, loading, page, rowsPerPage, onPageChange, total }) {
  return (
    <Paper elevation={2}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.field} sx={{ fontWeight: 700, bgcolor: '#f5f5f5', ...col.headerSx }}>
                    {col.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      No records found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, i) => (
                  <TableRow key={i} hover>
                    {columns.map((col) => (
                      <TableCell key={col.field} sx={col.cellSx}>
                        {col.renderCell ? col.renderCell(row) : row[col.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {total !== undefined && (
            <TablePagination
              component="div"
              count={total || -1}
              page={page}
              onPageChange={onPageChange}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[50]}
            />
          )}
        </>
      )}
    </Paper>
  );
}
