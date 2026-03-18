import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../util/firebase';

// Helper to find a field in an object with various possible keys
const getField = (obj, ...keys) => {
    if (!obj) return undefined;
    for (const k of keys) {
        if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== undefined) {
            return obj[k];
        }
    }
    return undefined;
};

export default function ProjectNameList() {
    const [projectNames, setProjectNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const projectsRef = ref(db, "ProjectData/1754289286238");

        const unsubscribe = onValue(
            projectsRef,
            (snapshot) => {
                setLoading(false);
                try {
                    const projectsData = snapshot.val();
                    if (projectsData && typeof projectsData === 'object') {
                        const names = Object.values(projectsData)
                            .map(project => getField(project, 'Project name ', 'Project Name', 'projectName', 'project name', 'name'))
                            .filter(name => name); // Filter out any undefined/null names

                        if (names.length > 0) {
                            setProjectNames(names);
                            setError(null);
                        } else {
                            setProjectNames([]);
                            setError('No projects with names found.');
                        }
                    } else {
                        setProjectNames([]);
                        setError('No projects found.');
                    }
                } catch (e) {
                    console.error("Error processing project data:", e);
                    setError("Failed to process project data.");
                }
            },
            (err) => {
                console.error("Firebase fetch error:", err);
                setError("Failed to fetch project data. Please check your permissions.");
                setLoading(false);
            }
        );

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading project names...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Project List</h1>
            {projectNames.length > 0 ? (
                <ul>
                    {projectNames.map((name, index) => (
                        <li key={index}>{name}</li>
                    ))}
                </ul>
            ) : (
                <p>No project names to display.</p>
            )}
        </div>
    );
}