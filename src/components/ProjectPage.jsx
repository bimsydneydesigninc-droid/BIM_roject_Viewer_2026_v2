import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ref, get, set } from 'firebase/database';
import { db } from '../util/firebase';
import ButtonAppBar from './ButtonAppBar';
import { Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Icon from '@mui/icons-material/ArrowBackIosNew';
import TextField from '@mui/material/TextField';
import SaveAsIcon from '@mui/icons-material/SaveAs';

export default function ProjectPage() {
  const { state } = useLocation();
  const { id } = useParams();
  const [project, setProject] = useState(state?.row ?? null);
  const [loading, setLoading] = useState(!state?.row);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!project && id) {
      setLoading(true);
      const projectRef = ref(db, `ProjectData/1754289286238/${id}`);
      get(projectRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            // snapshot.val() is the object of fields for this project
            setProject(snapshot.val());
            setError(null);
          } else {
            setError('Project not found');
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, project]);

  const getField = (obj, ...keys) => {

    if (!obj) return undefined;

    for (const k of keys) {
      if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== undefined) return obj[k];
    }
    return undefined;
  };

  const columns = [
    { field: 'field', headerName: 'Field', width: 400 },
    {
      field: 'value', headerName: 'Value', width: 400,
      renderCell: (params) =>
        editingId === params.id ? (
          <TextField value={params.value} onChange={(e) => {
            const newValue = e.target.value;
            setProject(prev => ({
              ...prev, [params.id]: newValue
            }));
          }}
            onBlur={() => setEditingId(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { setEditingId(null); }
            }}
            autoFocus size="small" fullWidth
          />
        ) : (
          <div onClick={() => setEditingId(params.id)} style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
            {params.value}
          </div>
        )
    },
  ];

  const rows = project ? Object.entries(project).map(([key, value]) => ({
    id: key,
    field: key,
    value: typeof value === 'object' ? JSON.stringify(value) : String(value),
  })) : [];

  const handleSave = () => {
    if (project && id) {
      console.log('Saving project:', project);
      const projectRef = ref(db, `ProjectData/1754289286238/${id}`);
      set(projectRef, project)
        .then(() => {
          console.log('Project updated successfully!');
          // alert('Project updated successfully!');
        })
        .catch(err => {
          console.error('Error updating project:', err);
          alert('Error updating project: ' + err.message);
        });
    }
  };

  if (loading) return <div>Loading project…</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <ButtonAppBar />

      <Box sx={{ padding: 3, width: '40%', margin: '30px', boxShadow: 4, borderRadius: 3, border: '1px solid #000000' }}>
        {/* <Button onClick={() => window.history.back()} variant="outlined" sx={{
          backgroundColor: '#000000', color: '#f0f0f0', borderRadius: '8px',
          boxShadow: 8,
          '&:hover': {
            backgroundColor: '#838a87',
            boxShadow: 10
          }
        }} size="small"
          startIcon={<Icon />}>Back</Button> */}

        <Box sx={{ marginBottom: 1, padding: 2, backgroundColor: '#838a87', borderRadius: 2, border: '1px solid #000000' }}>

          <Typography variant="h4" sx={{ fontWeight: 600, marginBottom: 1, color: '#000000' }}>
            Project
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: 300, marginBottom: 1 }}>
            Code: {getField(project, 'Project Code ', 'projectCode', 'project_code', 'code') ?? '—not found—'}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 300, marginBottom: 1, color: '#f0f0f0' }}>

            Name: {getField(project, 'Project Name ', 'projectName', 'project name', 'Project name') ?? '—not found—'}
          </Typography>

          <Typography variant="body2" sx={{ color: '#000000' }}>
            Showing {rows.length} of {rows.length} items.
          </Typography>

        </Box>
      </Box>

      <Paper style={{ padding: '20px', margin: '30px', boxShadow: 1, borderRadius: 15, border: '1px solid #000000' }} elevation={24}>

        <Button onClick={handleSave} variant="outlined" sx={{
          backgroundColor: '#000000', color: '#f0f0f0', borderRadius: '8px',
          boxShadow: 8,
          '&:hover': {
            backgroundColor: '#838a87',
            boxShadow: 10
          }
        }} size="small"
          startIcon={<SaveAsIcon />}>Save Changes</Button>

        <DataGrid

          showToolbar
          rows={rows}
          columns={columns}
          pageSize={100}
          rowsPerPageOptions={[5, 10, 20]}
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#838a87',  // Blue background
              color: 'white',             // White text
              fontWeight: 1000,            // Bolder font
              fontSize: '20px',           // Larger font
              textTransform: 'uppercase', // Uppercase text
              borderBottom: '8px solid #000000', // Darker border
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '2px solid #e2e2e2',
            },
          }}
        />
      </Paper>
    </div>
  );
}