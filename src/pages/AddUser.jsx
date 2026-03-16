import React from 'react';
import ButtonAppBar from '../components/ButtonAppBar';
import { Box, Typography, Paper, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function AddUser() {
    const navigate = useNavigate();

    return (
        <>
        {/* hola */}
            <ButtonAppBar />
            <Box sx={{ padding: 3 }}>
                <Typography variant="h4" sx={{ marginBottom: 2, textAlign: 'center' }}>
                    Create a New User
                </Typography>
                <Paper sx={{ padding: 4, maxWidth: 600, margin: 'auto', boxShadow: 4, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        User Details
                    </Typography>
                    <Box component="form" noValidate autoComplete="off">
                        <TextField
                            required
                            id="name"
                            label="Full Name"
                            fullWidth
                            sx={{ mb: 3 }}
                            placeholder="Enter user's full name"
                        />
                        <TextField
                            id="position"
                            label="Position"
                            fullWidth
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            id="department"
                            label="Department"
                            fullWidth
                            sx={{ mb: 3 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/users')}
                                sx={{ mr: 2 }}
                            >
                                Cancel
                            </Button>
                              <Button
                                variant="outlined"
                                onClick={() => navigate('/users')}
                                sx={{ mr: 2 }}
                            >
                                Add new field
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => { /* Logic to save user will go here */ alert('Save functionality to be implemented!'); }}
                            >
                                Save User 2
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </>
    );
}