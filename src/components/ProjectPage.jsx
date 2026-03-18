import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ref, get, set, onValue } from 'firebase/database';
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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function ProjectPage() {
  const { state } = useLocation();
  const { id } = useParams();
  const [project, setProject] = useState(state?.row ?? null);
  const [loading, setLoading] = useState(!state?.row);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [projectNames, setProjectNames] = useState([]);

  useEffect(() => {
    const projectsRef = ref(db, "ProjectData/1754289286238");
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data && typeof data === 'object') {
        // Helper to extract name safely inside effect
        const getVal = (obj, ...keys) => {
          if (!obj) return undefined;
          for (const k of keys) {
            if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== undefined) return obj[k];
          }
          return undefined;
        };

        const codes = Object.values(data)
          .map(p => getVal(p,'Project Code  ', 'projectCode', 'project_code', 'code'))
          .filter(n => n);
        const names = Object.values(data)
          .map(p => getVal(p,'Project Name ', 'Project Name', 'projectName', 'project name', 'name'))
          .filter(n => n);
        setProjectNames(codes.concat(...names));
        // console.log("Project names loaded:", codes.concat(names));
      }
    });
    return () => unsubscribe();
  }, []);


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

  const renderTree = (nodes, parentId = 'root') => {
    if (!nodes || typeof nodes !== 'object') return null;

    return Object.entries(nodes).map(([key, value]) => {
      const nodeId = `${parentId}-${key}`;
      const isObject = typeof value === 'object' && value !== null;
      const label = isObject ? key : `${key}: ${String(value)}`;

      return (
        <TreeItem key={nodeId} nodeId={nodeId} label={label}>
          {isObject ? renderTree(value, nodeId) : null}
        </TreeItem>
      );
    });
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


  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <div>
      <ButtonAppBar />
      <Box sx={{  backgroundColor: '#fafafa' }}>
        <Box sx={{  width: '80%', margin: '2px'}}>
          {/* <Typography variant="h5" sx={{ fontWeight: 100, marginBottom: 1, color: '#000000' }}>
            Select a Project
          </Typography> */}
         
        </Box>
        <FormControl fullWidth  sx={{  width: '40%', margin: '10px', boxShadow: 4,  }}>
          <InputLabel id="demo-simple-select-label">DI Project List</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleChange}
            MenuProps={MenuProps}
          >
            {projectNames.map((name, index) => (
              <MenuItem key={index} value={name}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>



      <Box sx={{ minHeight: 180, flexGrow: 1, maxWidth: 300 }}>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {project ? renderTree(project) : <TreeItem nodeId="no-data" label="No Project Selected" />}
      </TreeView>
    </Box>

      <Box sx={{ padding: 1, width: '40%', margin: '30px', boxShadow: 4, borderRadius: 3, border: '1px solid #000000' }}>
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