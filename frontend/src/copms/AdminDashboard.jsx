// AdminDashboard.jsx
// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Form, Table } from 'react-bootstrap';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [newUser, setNewUser] = useState({ username: '', email: '', phone: '', role: 'student', password: '' });
    const [editingUser, setEditingUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAccess = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            const decoded = jwtDecode(token);
            if (decoded.role !== 'admin') {
                navigate('/');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
            } catch (err) {
                setError('שגיאה בטעינת המשתמשים');
            }
        };

        checkAccess();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const addUser = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:5000/api/add-user', newUser, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers([...users, response.data]);
            setNewUser({ username: '', email: '', phone: '', role: 'student', password: '' });
        } catch (err) {
            setError('שגיאה בהוספת המשתמש');
        }
    };

    const editUser = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`http://localhost:5000/api/users/${id}`, editingUser, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.map((user) => (user._id === id ? response.data : user)));
            setEditingUser(null);
        } catch (err) {
            setError('שגיאה בעריכת המשתמש');
        }
    };

    const deleteUser = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(users.filter((user) => user._id !== id));
        } catch (err) {
            setError('שגיאה במחיקת המשתמש');
        }
    };

    const navigateToFiles = () => {
        navigate('/admin/files');
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">ניהול משתמשים</h2>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                    <button className="btn btn-link" onClick={() => window.location.reload()}>
                        נסה שוב
                    </button>
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <Button variant="primary" onClick={handleLogout}>התנתקות</Button>
                <Button variant="secondary" onClick={navigateToFiles}>ניהול קבצים</Button>
            </div>

            <Card className="mb-5 shadow">
                <Card.Body>
                    <Card.Title className="text-center">הוסף משתמש חדש</Card.Title>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="שם משתמש"
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder="אימייל"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="טלפון"
                                value={newUser.phone}
                                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="סיסמה"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                        </Form.Group>
                        <Button variant="success" onClick={addUser} className="w-100">הוסף</Button>
                    </Form>
                </Card.Body>
            </Card>

            <h3 className="mb-3">רשימת משתמשים</h3>
            <Table striped bordered hover responsive className="shadow">
                <thead className="table-dark">
                    <tr>
                        <th>שם משתמש</th>
                        <th>אימייל</th>
                        <th>טלפון</th>
                        <th>תפקיד</th>
                        <th>פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center">
                                אין משתמשים להצגה
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    {editingUser && editingUser._id === user._id ? (
                                        <Form.Control
                                            type="text"
                                            value={editingUser.username}
                                            onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                                        />
                                    ) : (
                                        user.username
                                    )}
                                </td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.role}</td>
                                <td>
                                    {editingUser && editingUser._id === user._id ? (
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() => editUser(user._id)}
                                        >
                                            שמור
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() => setEditingUser(user)}
                                        >
                                            ערוך
                                        </Button>
                                    )}
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="ms-2"
                                        onClick={() => deleteUser(user._id)}
                                    >
                                        מחק
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default AdminDashboard;
