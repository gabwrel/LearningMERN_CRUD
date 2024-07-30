import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

function UpdateUser() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [profileImage, setProfileImage] = useState(null); // State for the new image file
    const [currentImage, setCurrentImage] = useState(''); // State for the current image URL
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/getUser/${id}`)
            .then(result => {
                setName(result.data.name);
                setEmail(result.data.email);
                setAge(result.data.age);
                setCurrentImage(result.data.profileImage || ''); // Set current image URL
            })
            .catch(err => console.log(err));
    }, [id]);

    const handleImageChange = (e) => {
        setProfileImage(e.target.files[0]); // Get the selected file
    };

    const handleRemoveImage = () => {
        const formData = new FormData();
        formData.append('removeImage', 'true'); // Indicate that the current image should be removed

        axios.put(`http://localhost:3001/updateUser/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Set the content type to multipart/form-data
            }
        })
        .then(result => {
            setCurrentImage(''); // Clear the current image URL
        })
        .catch(err => console.log(err));
    };

    const updateUser = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('age', age);
        
        if (profileImage) {
            formData.append('profileImage', profileImage); // Append the new image file
        }
        
        axios.put(`http://localhost:3001/updateUser/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Set the content type to multipart/form-data
            }
        })
        .then(result => {
            // After a successful update, set the new image URL (if available)
            if (result.data.profileImage) {
                setCurrentImage(result.data.profileImage);
            }
            console.log(result);
            navigate('/'); // Redirect to home or the updated user list
        })
        .catch(err => console.log(err));
    };

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-75 bg-white rounded p-3'>
                <form onSubmit={updateUser}>
                    <h2>Update User</h2>
                    <div className="mb-2">
                        <label htmlFor="name">Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            placeholder='Enter Name' 
                            className='form-control' 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder='Enter Email' 
                            className='form-control' 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="age">Age</label>
                        <input 
                            type="text" 
                            id="age" 
                            placeholder='Enter Age' 
                            className='form-control' 
                            value={age} 
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="profileImage">Profile Image</label>
                        {currentImage && (
                            <div className="mb-2">
                                <img 
                                    src={currentImage} 
                                    alt="Current" 
                                    className='img-thumbnail' 
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                                <div className="mt-2">
                                    <button 
                                        type='button' 
                                        className='btn btn-danger' 
                                        onClick={handleRemoveImage}
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            </div>
                        )}
                        <input 
                            type="file" 
                            id="profileImage" 
                            className='form-control' 
                            onChange={handleImageChange}
                        />
                    </div>
                    <button className='btn btn-success' type='submit'>Update</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateUser;
