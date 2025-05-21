import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../Context/UserContext';
import Header from '../Header/Header';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { Helmet } from 'react-helmet';

export default function Home() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userToken } = useContext(UserContext);

    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [updateCode, setUpdateCode] = useState('');
    const [updateDate, setUpdateDate] = useState('');
    const [updateDateOriginal, setUpdateDateOriginal] = useState('');
    const [updateNote, setUpdateNote] = useState('');

    const [showExportMenu, setShowExportMenu] = useState(false);
    const [exportFormat, setExportFormat] = useState('pdf');

    const [showSearchMenu, setShowSearchMenu] = useState(false);
    const [searchType, setSearchType] = useState('name');
    const [searchValue, setSearchValue] = useState('');

    const [showAddAdminForm, setShowAddAdminForm] = useState(false);
    const [addAdminCode, setAddAdminCode] = useState('');
    const [adminPassword, setAdminPassword] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:7000/attendance/allSheets');
                const data = await res.json();
                setUsers(data.sheet || []);
                setLoading(false);
            } catch (err) {
                setError("Failed to load data");
                console.error("Fetch error:", err);
            }
        };
        fetchData();
    }, []);

    const handleManualUpdate = async (e) => {
        // e.preventDefault();
        const parsedDate = new Date(updateDate);
        // let isoDateString = '';

        if (isNaN(parsedDate.getDate())) {
            alert('Please enter a valid date.');
            return;
        }

        // isoDateString = parsedDate.toISOString();
        const formattedDate = parsedDate.toISOString().split('T')[0]; // e.g., "2025-11-01"

        try {
            const response = await axios.patch(
                'http://localhost:7000/attendance/update',
                {
                    userCode: updateCode,
                    date: formattedDate,
                    note: updateNote,
                },
                {
                    headers: {
                        Authorization: `hamada${userToken}`
                    }
                }
            );

            const updatedRecord = response.data.record;

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id.userCode === updatedRecord.code && user.date === updatedRecord.date
                        ? { ...user, note: updatedRecord.note }
                        : user
                )
            );

            alert('Note updated successfully!');
            console.log(response);
            
            setShowUpdateForm(false);
            // setUpdateCode('');
            // setUpdateDate('');
            // setUpdateNote('');
        } catch (err) {
            console.error('Manual update failed:', err.response?.data || err.message);
            console.log(err);
            
            alert('Failed to update note.');
        }
    };


    const handleAddAdmin = async (e) => {

        if (!addAdminCode) {
            alert("Please enter a valid user code");
            return;
        }

        try {
            const response = await axios.patch(
                'http://localhost:7000/user/addAdmin',
                {
                    code: addAdminCode,
                    password: adminPassword,
                },
                {
                    headers: {
                        Authorization: `hamada${userToken}`, 
                    },
                }
            );
            console.log(response.data);


            alert('User is now admin');
            setShowAddAdminForm(false);
            setAddAdminCode('');
            setAdminPassword("");
        } catch (err) {
            console.error('Failed to make admin:', err.response?.data || err.message);
            alert(err.response?.data?.message || 'Failed to update user role');
        }
    };


    const filteredUsers = users.filter(user => {
        const value = searchValue.trim().toLowerCase();
        if (!value) return true;
        if (searchType === 'name') {
            return user.userId?.name?.toLowerCase().includes(value);
        } else if (searchType === 'code') {
            return user.userId?.code?.toString().toLowerCase().includes(value);
        }
        return true;
    });

    const formatTime = (value) => {
        if (!value || isNaN(value)) return '';
        const minutes = Math.floor(value * 24 * 60);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Attendance Sheet", 14, 10);
        const tableColumn = ["Code", "Name", "Date", "Day", "Shift", "Building", "Arrives", "Leaves", "Notes"];
        const tableRows = filteredUsers.map(user => [
            user.userId?.code || '',
            user.userId?.name || '',
            new Date(user.date).toLocaleDateString(),
            user.day || '',
            user.shiftId?.number || '',
            user.building || '',
            formatTime(user.arrivalTime),
            formatTime(user.leavingTime),
            String(user.note || ''),
        ]);
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
        });
        let filename = 'attendance';
        if (searchValue.trim()) {
            const safeFilename = searchValue.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
            filename += `_${safeFilename}`;
        }
        filename += '.pdf';
        doc.save(filename);
    };

    const exportCSV = () => {
        const headers = ["Code", "Name", "Date", "Day", "Shift", "Building", "Arrives", "Leaves", "Notes"];
        const rows = filteredUsers.map(user => [
            user.userId?.code || '',
            user.userId?.name || '',
            new Date(user.date).toLocaleDateString(),
            user.day || '',
            user.shiftId?.number || '',
            user.building || '',
            formatTime(user.arrivalTime),
            formatTime(user.leavingTime),
            user.note || '',
        ]);
        const csvContent = headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        let filename = 'attendance';
        if (searchValue.trim()) {
            const safeFilename = searchValue.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
            filename += `_${safeFilename}`;
        }
        filename += '.csv';
        saveAs(blob, filename);
    };

    const handleExportSelect = () => {
        if (exportFormat === 'pdf') exportPDF();
        else if (exportFormat === 'csv') exportCSV();
        else if (exportFormat === 'both') {
            exportPDF();
            exportCSV();
        }
        setShowExportMenu(false);
    };

    return (
        <>
            <Helmet>
                <title>WorkLog Manager - Dashboard</title>
                <meta name="description" content="Manage attendance records, search, filter, and export reports." />
                <meta property="og:title" content="WorkLog Manager - Dashboard" />
                <meta property="og:description" content="Manage attendance records, search, filter, and export reports." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://yourdomain.com/home " />
                <link rel="canonical" href="https://yourdomain.com/home " />
            </Helmet>
            <Header />
            <ProtectedRoute>
                <div style={{ backgroundColor: '#F2F2F2' }} className="container p-3 border rounded-3 mb-5">
                    {/* Buttons */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px',
                        flexWrap: 'wrap',
                        gap: '10px'
                    }}>
                        {/* Left Side Buttons */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setShowAddAdminForm(true)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#6F42C1',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Add Admin
                            </button>
                            <button
                                onClick={() => setShowUpdateForm(true)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#007BFF',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Update Form
                            </button>

                        </div>


                        {/* Right Side Buttons */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {/* Search Button */}
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <button
                                    onClick={() => setShowSearchMenu(!showSearchMenu)}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#FFC107',
                                        color: 'black',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Search
                                </button>
                                {showSearchMenu && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        backgroundColor: '#fff',
                                        border: '1px solid #ccc',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        zIndex: 10,
                                        padding: '10px',
                                        minWidth: '200px'
                                    }}>
                                        <label style={{ display: 'block', marginBottom: '8px' }}>
                                            <input
                                                type="radio"
                                                value="name"
                                                checked={searchType === 'name'}
                                                onChange={() => setSearchType('name')}
                                                style={{ marginRight: '5px' }}
                                            />
                                            Name
                                        </label>
                                        <label style={{ display: 'block', marginBottom: '8px' }}>
                                            <input
                                                type="radio"
                                                value="code"
                                                checked={searchType === 'code'}
                                                onChange={() => setSearchType('code')}
                                                style={{ marginRight: '5px' }}
                                            />
                                            Code
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={`Enter ${searchType}`}
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '6px',
                                                marginBottom: '10px',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        <button
                                            onClick={() => setSearchValue('')}
                                            style={{
                                                width: '100%',
                                                padding: '6px',
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Export Button */}
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <button
                                    onClick={() => setShowExportMenu(!showExportMenu)}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#17A2B8',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Export
                                </button>
                                {showExportMenu && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        backgroundColor: '#fff',
                                        border: '1px solid #ccc',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        zIndex: 10,
                                        padding: '10px',
                                        minWidth: '150px'
                                    }}>
                                        <label style={{ display: 'block', marginBottom: '8px' }}>
                                            <input
                                                type="radio"
                                                value="pdf"
                                                checked={exportFormat === 'pdf'}
                                                onChange={() => setExportFormat('pdf')}
                                                style={{ marginRight: '5px' }}
                                            />
                                            PDF
                                        </label>
                                        <label style={{ display: 'block', marginBottom: '8px' }}>
                                            <input
                                                type="radio"
                                                value="csv"
                                                checked={exportFormat === 'csv'}
                                                onChange={() => setExportFormat('csv')}
                                                style={{ marginRight: '5px' }}
                                            />
                                            CSV
                                        </label>
                                        <label style={{ display: 'block', marginBottom: '8px' }}>
                                            <input
                                                type="radio"
                                                value="both"
                                                checked={exportFormat === 'both'}
                                                onChange={() => setExportFormat('both')}
                                                style={{ marginRight: '5px' }}
                                            />
                                            Both
                                        </label>
                                        <button
                                            onClick={handleExportSelect}
                                            style={{
                                                width: '100%',
                                                padding: '6px',
                                                backgroundColor: '#28a745',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                marginTop: '10px'
                                            }}
                                        >
                                            Export
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Floating Add Admin Form Modal */}
                    {showAddAdminForm && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000
                        }}>
                            <div style={{
                                backgroundColor: '#fff',
                                padding: '20px',
                                borderRadius: '8px',
                                maxWidth: '500px',
                                width: '90%',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                            }}>
                                <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Make User Admin</h4>
                                <form onSubmit={handleAddAdmin}>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label>User Code: </label>
                                        <input
                                            type="text"
                                            value={addAdminCode}
                                            onChange={(e) => setAddAdminCode(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '8px' }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label>User Password: </label>
                                        <input
                                            type="text"
                                            value={adminPassword}
                                            onChange={(e) => setAdminPassword(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '8px' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddAdminForm(false)}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#6c757d',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#6F42C1',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Make Admin
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Floating Update Form Modal */}
                    {showUpdateForm && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000
                        }}>
                            <div style={{
                                backgroundColor: '#fff',
                                padding: '20px',
                                borderRadius: '8px',
                                maxWidth: '500px',
                                width: '90%',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                            }}>
                                <h4 style={{ textAlign: 'center', marginBottom: '15px' }}>Update Note</h4>
                                <form onSubmit={handleManualUpdate}>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label>Code: </label>
                                        <input
                                            type="text"
                                            value={updateCode}
                                            onChange={(e) => setUpdateCode(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '8px' }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label>Date: </label>
                                        <input
                                            type="text"
                                            value={updateDate}
                                            onChange={(e) => setUpdateDate(e.target.value)}
                                            required
                                            placeholder="e.g. 2025-11-01"
                                            style={{ width: '100%', padding: '8px' }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label>New Note: </label>
                                        <input
                                            type="text"
                                            value={updateNote}
                                            onChange={(e) => setUpdateNote(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '8px' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                        <button
                                            type="button"
                                            onClick={() => setShowUpdateForm(false)}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#6c757d',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#28A745',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Responsive Table */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ minWidth: '800px', borderCollapse: 'collapse', marginTop: '20px', width: '100%' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f2f2f2' }}>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Code</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Day</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Shift</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Building</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Arrives</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Leaves</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                                            No matching records found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user._id || user.userId}>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.userId?.code}</td>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.userId?.name}</td>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                {new Date(user.date).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.day}</td>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.shiftId?.number}</td>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.building}</td>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formatTime(user.arrivalTime)}</td>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formatTime(user.leavingTime)}</td>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.note}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Back to Top Button */}
                {filteredUsers.length > 10 && (
                    <button
                        className="back-to-top"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        aria-label="Back to top"
                    >
                        ↑
                    </button>
                )}
            </ProtectedRoute>
        </>
    );
}