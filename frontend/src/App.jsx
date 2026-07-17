import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import CustomAlertDialog from './components/Common/Modals/CustomAlertDialog';
import useAlertStore from './store/alertStore';

// Override native window.alert globally
window.alert = (message) => {
  useAlertStore.getState().showAlert(message, 'Message');
};
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import GradeChange from './pages/GradeChange/GradeChange';
import Stoppages from './pages/Stoppages/Stoppages';
import EquipmentStandby from './pages/EquipmentStandby/EquipmentStandby';
import MeterReading from './pages/MeterReading/MeterReading';
import ProcessOrder from './pages/ProcessOrder/ProcessOrder';
import ProcessParameter from './pages/ProcessParameter/ProcessParameter';
import ManualUpload from './pages/ManualUpload/ManualUpload';
import Reports from './pages/Reports/Reports';
import StoppageAlert from './pages/StoppageAlert/StoppageAlert';
import UpdateBOM from './pages/UpdateBOM/UpdateBOM';
import ProcessOrderReversal from './pages/ProcessOrderReversal/ProcessOrderReversal';
import UserManagement from './pages/UserManagement/UserManagement';
import BusinessUnit from './pages/BusinessUnit/BusinessUnit';
import PlantDetails from './pages/PlantDetails/PlantDetails';
import Roles from './pages/Roles/Roles';
import RoleMenuMapping from './pages/RoleMenuMapping/RoleMenuMapping';

const theme = createTheme({
  palette: {
    primary: { main: '#1a237e' },
    secondary: { main: '#f57c00' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CustomAlertDialog />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="grade-change" element={<GradeChange />} />
            <Route path="stoppages" element={<Stoppages />} />
            <Route path="equipment-standby" element={<EquipmentStandby />} />
            <Route path="meter-reading" element={<MeterReading />} />
            <Route path="process-order" element={<ProcessOrder />} />
            <Route path="process-order/reversal" element={<ProcessOrderReversal />} />
            <Route path="process-parameter" element={<ProcessParameter />} />
            <Route path="stoppage-alert" element={<StoppageAlert />} />
            <Route path="update-bom" element={<UpdateBOM />} />
            <Route path="manual-upload" element={<ManualUpload />} />
            <Route path="reports" element={<Reports />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="admin/business-unit" element={<BusinessUnit />} />
            <Route path="admin/plant-details" element={<PlantDetails />} />
            <Route path="admin/roles" element={<Roles />} />
            <Route path="admin/role-menu-mapping" element={<RoleMenuMapping />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
