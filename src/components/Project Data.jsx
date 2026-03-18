import React, { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from '../util/firebase';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';



export default function Test() {
    const [DIS_Projects, setDIS_Projects] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const settingsRef = ref(db, "ProjectData/1754289286238");


        const unsubscribe = onValue(
            settingsRef,
            (snapshot) => {
                const DIS_data = snapshot.val();
                // console.log(settingsRef, DIS_data)
                setDIS_Projects(DIS_data);

                // Extract keys and values from nested objects
                if (DIS_data && typeof DIS_data === 'object') {
                    const rows = [];
                    let allKeys = new Set();

                    // First pass: collect all possible keys
                    Object.entries(DIS_data).forEach(([projectKey, projectObj]) => {
                        if (typeof projectObj === 'object' && projectObj !== null) {
                            Object.keys(projectObj).forEach(key => allKeys.add(key));
                        }
                    });

                    // Second pass: create rows with all extracted data
                    Object.entries(DIS_data).forEach(([projectKey, projectObj], index) => {
                        const row = {
                            id: projectKey || index,
                        };

                        if (typeof projectObj === 'object' && projectObj !== null) {
                            // Extract all key-value pairs from the nested object
                            Object.entries(projectObj).forEach(([key, value]) => {
                                row[key] = typeof value === 'object' ? JSON.stringify(value) : value;
                            });
                        }
                        rows.push(row);
                    });

                    // console.log("Transformed rows:", rows);
                    setRows(rows);

                    // Only show a few selected fields (project code and project name)
                    const desiredFieldCandidates = [
                        'Project Code ', 'Project name ', 'BIM Lead'
                    ];

                    //  const desiredFieldCandidates = [
                    //     'Project Code', 'Project name', 'Project name',
                    //     'projectCode', 'projectName', 'project_code', 'project_name',
                    //     'code', 'name'
                    // ];
                    const allKeysArray = Array.from(allKeys);
                    const matchingKeys = [];
                    // prefer exact/canonical matches from the desired list
                    desiredFieldCandidates.forEach((candidate) => {
                        const match = allKeysArray.find(k => k.toLowerCase() === candidate.toLowerCase());
                        if (match && !matchingKeys.includes(match)) matchingKeys.push(match);
                    });
                    // fallback: include any key that contains 'project'+'code' or 'project'+'name' or just 'code'/'name'
                    if (matchingKeys.length === 0) {
                        allKeysArray.forEach((k) => {
                            if (/project.*code|project.*name|code|name/i.test(k)) {
                                if (!matchingKeys.includes(k)) matchingKeys.push(k);
                            }
                        });
                    }

                    // If still empty, fall back to showing the first two keys
                    if (matchingKeys.length === 0 && allKeysArray.length > 0) {
                        matchingKeys.push(allKeysArray[0]);
                        if (allKeysArray[1]) matchingKeys.push(allKeysArray[1]);
                    }

                    const generatedColumns = matchingKeys.map((key, idx) => ({
                        field: key,
                        headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
                        width: 150,
                        editable: false, // Disable editing on first column
                        sortable: true,
                        filterable: true,
                        checkboxSelection: false, // Only allow checkbox selection on the first column
                        // flex: idx === 0 ? 2 : 1, // Make the first column wider
                        flex: 0.5, // Use fixed width for all columns to prevent excessive stretching
                    }));
                    setColumns(generatedColumns);
                } else {
                    setRows([]);
                    setColumns([]);
                }

                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("Firebase fetch error:", err);
                setError("Failed to fetch application settings. Please ensure you have the correct permissions.");
                setLoading(false);
            }
        );
        return () => {
            off(settingsRef);
        };
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, padding: 4 }}>
                <CircularProgress size={32} />
                <span>Loading...</span>
            </Box>
        );
    }

    const handleNavigation = (params) => {
        navigate(`/project/${params.id}`, { state: { row: params.row } });
        // setOpen(false);
    };



    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ marginBottom: 3, width: '40%' }}>
                <Typography variant="h3" sx={{ fontWeight: 600, marginBottom: 1, color: '#000000' }}>
                    Project Data
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff' }}>
                    Showing {rows.length} of {rows.length} projects.
                </Typography>
            </Box>

            {error && (
                <Typography variant="body1" sx={{ color: 'red', marginBottom: 2 }}>
                    {error}
                </Typography>
            )}

            {rows.length > 0 ? (
                <Paper sx={{ padding: '20px', margin: '30px', boxShadow: 1, borderRadius: 3, border: '1px solid #000000' }} elevation={24}>
                    <DataGrid

                        showToolbar
                        rows={rows}
                        columns={columns}

                        onRowDoubleClick={handleNavigation}

                        initialState={{
                            pagination: { paginationModel: { page: 0, pageSize: 25 } },
                            showToolbar: true,
                            density: 'standard',
                        }}
                        pageSizeOptions={[10, 25, 100]}
                        checkboxSelection={false}
                        disableSelectionOnClick
                        clipboardCopyCellDelimiter
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
            ) : (
                <Typography variant="body1">No projects found.</Typography>
            )}
        </Box>
    );

}