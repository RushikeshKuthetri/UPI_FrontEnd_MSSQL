import React, { useEffect, useState, useMemo } from 'react';
import Table1 from '../../components/Common/Table/Table';
import SearchInput from '../../components/Common/Form/Inputs/SearchInput';
import SubmitButton from '../../components/Common/Form/Buttons/SubmitButton';
import EditUserModal from '../../components/Common/Modals/EditUserModal';
import { SquarePen, UserCheck, UserX } from 'lucide-react';
import api from '../../api/axios';

const EMPTY_USER = {
  userName: '',
  firstName: '',
  lastName: '',
  mobileNumber: '',
  email: '',
  isActive: true,
  role: [],
  plant: []
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: '', type: 'success' });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, r, p] = await Promise.all([
        api.get('/users'),
        api.get('/users/roles'),
        api.get('/users/plants'),
      ]);
      setUsers(u.data);
      setRoles(r.data.map(ro => ({ label: ro.RoleName, value: String(ro.RoleId) })));
      setPlants(p.data.map(pl => ({ label: `${pl.PlantCode} – ${pl.PlantName}`, value: pl.PlantCode })));
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setSelectedUser(EMPTY_USER);
  };

  const openEdit = async (user) => {
    try {
      const { data } = await api.get(`/users/${user.UserId}`);
      setSelectedUser({
        UserId: user.UserId,
        userName: data.UserName,
        firstName: data.FirstName || '',
        lastName: data.LastName || '',
        email: data.EmailId || '',
        mobileNumber: data.MobileNumber || '',
        isActive: data.IsActive,
        role: data.Roles ? data.Roles.split(',').map((r) => {
          const found = roles.find((ro) => ro.label.trim() === r.trim());
          return found ? found : null;
        }).filter(Boolean) : [],
        plant: data.Plants ? data.Plants.split(',').filter(Boolean).map(p => {
          const found = plants.find(pl => pl.value === p.trim());
          return found ? found : { label: p, value: p };
        }) : [],
      });
    } catch (error) {
      console.error('Failed to fetch user details', error);
    }
  };

  const handleSave = async (formData) => {
    try {
      const payload = {
        UserName: formData.userName,
        FirstName: formData.firstName,
        LastName: formData.lastName,
        EmailId: formData.email,
        MobileNumber: formData.mobileNumber,
        IsActive: formData.isActive,
        roleIds: formData.role.map(r => r.value),
        plantCodes: formData.plant.map(p => p.value),
      };

      if (formData.UserId) {
        await api.put(`/users/${formData.UserId}`, payload);
        alert('User updated successfully');
      } else {
        await api.post('/users', payload);
        alert('User created successfully');
      }
      setSelectedUser(null);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleToggle = async (user) => {
    try {
      await api.patch(`/users/${user.UserId}/toggle`);
      fetchAll();
    } catch {
      alert('Toggle failed');
    }
  };

  const filtered = useMemo(() => {
    return users.filter((u) =>
      u.UserName?.toLowerCase().includes(search.toLowerCase()) ||
      u.EmailId?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const columns = [
    { key: 'UserName', label: 'Username' },
    { key: 'EmailId', label: 'Email' },
    {
      key: 'Roles',
      label: 'Roles',
      render: (val) => (
        <div className="flex gap-1 flex-wrap">
          {val?.split(',').filter(Boolean).map((r, i) => (
            <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200">
              {r.trim()}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'Plants',
      label: 'Plants',
      render: (val) => {
        const pArr = val?.split(',').filter(Boolean) || [];
        return (
          <div className="flex gap-1 flex-wrap items-center">
            {pArr.slice(0, 3).map((p, i) => (
              <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200">
                {p.trim()}
              </span>
            ))}
            {pArr.length > 3 && (
              <span className="text-xs text-gray-500">+{pArr.length - 3} more</span>
            )}
          </div>
        );
      }
    },
    {
      key: 'IsActive',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-0.5 rounded-full text-[12px] font-medium border ${value ? 'bg-green-100 text-green-600 border-green-200' : 'bg-red-100 text-red-500 border-red-200'
          }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const renderActions = (row) => (
    <div className="flex gap-3 justify-center items-center">
      <button
        className="text-orange-500 hover:text-orange-700 transition"
        title="Edit User"
        onClick={() => openEdit(row)}
      >
        <SquarePen size={18} />
      </button>
      <button
        className={`transition ${row.IsActive ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}`}
        title={row.IsActive ? 'Deactivate' : 'Activate'}
        onClick={() => handleToggle(row)}
      >
        {row.IsActive ? <UserX size={18} /> : <UserCheck size={18} />}
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-medium font-poppins text-[var(--title)]">
          User Management
        </h2>
        <div className="flex items-center gap-4">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
          />
          <div onClick={openCreate}>
            <SubmitButton text="New User" />
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--form-border)] p-4 flex flex-col gap-4 overflow-hidden">
        <div className="overflow-auto">
          <Table1
            columns={columns}
            data={filtered}
            renderActions={renderActions}
            showPagination={true}
          />
        </div>
      </div>

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          rolesList={roles}
          plantsList={plants}
          onClose={() => setSelectedUser(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
