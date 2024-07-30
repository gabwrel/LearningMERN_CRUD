import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001')
            .then(result => {
                console.log(result.data);
                setUsers(result.data);
            })
            .catch(err => console.log(err));
    }, []);
    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/deleteUser/${id}`)
            .then(res => {
                console.log(res);
                setUsers(users.filter(user => user._id !== id));
            })
            .catch(err => console.log(err));
    };

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-75 bg-white rounded p-3'>
                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <h2>Users</h2>
                    <Link to="/create" className='btn btn-success'>Add +</Link>
                </div>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>Profile Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Age</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    {user.profileImage ? (
                                        <img 
                                            src={user.profileImage} 
                                            alt={user.name} 
                                            className='img-thumbnail' 
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className='bg-secondary text-white d-flex align-items-center justify-content-center' style={{ width: '100px', height: '100px' }}>
                                            <span>No Image</span>
                                        </div>
                                    )}
                                </td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.age}</td>
                                <td>
                                    <Link to={`/update/${user._id}`} className='btn btn-success me-2'>Update</Link>
                                    <button className='btn btn-danger' onClick={() => handleDelete(user._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Users;
