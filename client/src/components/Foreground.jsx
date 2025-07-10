import React, { useRef, useState, useEffect } from 'react';
import { IoMdAdd } from 'react-icons/io';
import axios from 'axios';
import Login from './Login';
import Logout from './Logout';
import UploadForm from './UploadForm';
import CardList from './CardList';

const Foreground = () => {
    const [alertMsg, setAlertMsg] = useState('');
    const [alertType, setAlertType] = useState(''); // 'success' or 'error'

    const ref = useRef(null);
    const [data, setData] = useState([]); // State to hold all cards
    const [previewURL, setPreviewURL] = useState(null); // For file preview in UploadForm
    const [newDoc, setNewDoc] = useState({ title: '', desc: '', file: null });
    const [showForm, setShowForm] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAddingDocument, setIsAddingDocument] = useState(false); // <-- NEW: Loading state for add document

    // Fetch cards for the logged-in user
    useEffect(() => {
        if (!token) {
            setData([]);
            return;
        }
        axios.get('https://docs-mini-8kkm.onrender.com/api/cards', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setData(res.data);
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setAlertType('error');
                setAlertMsg('❌ Failed to load documents. Please log in again.');
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    setToken(null);
                }
            });
    }, [token]);

    // Handler for adding a new card (now accepts FormData)
    const handleAddCard = async (formData) => { // <-- Accepts FormData
        if (!token) {
            setAlertType('error');
            setAlertMsg("❌ You must be logged in to add documents.");
            setShowAuthModal(true);
            return;
        }
        // Basic validation for title/desc (file is optional)
        if (!formData.get('title') || !formData.get('desc')) {
            setAlertType('error');
            setAlertMsg("❌ Title and description cannot be empty.");
            return;
        }

        setIsAddingDocument(true); // <-- Set loading to true BEFORE API call

        try {
            // --- TEMPORARY DELAY FOR TESTING LOADER VISIBILITY ---
            // Remove this line after you confirm the loader works
            await new Promise(resolve => setTimeout(resolve, 1500));
            // --- END TEMPORARY DELAY ---

            const res = await axios.post('https://docs-mini-8kkm.onrender.com/api/cards', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setData(prev => [res.data, ...prev]);
            setShowForm(false);
            setNewDoc({ title: '', desc: '', file: null }); // Reset form fields
            setPreviewURL(null); // Clear file preview
            setAlertType('success');
            setAlertMsg('✅ Document added successfully!');
        } catch (err) {
            console.error('Add card error:', err);
            setAlertType('error');
            setAlertMsg("❌ Failed to add document. You might not be logged in or a server error occurred.");
            if (err.response && err.response.status === 401) {
                setShowAuthModal(true);
            }
        } finally {
            setIsAddingDocument(false); // <-- Set loading to false AFTER API call (success or failure)
        }
    };

    const handleAuthSuccess = (receivedToken, wasLogin) => {
        setToken(receivedToken);
        localStorage.setItem('token', receivedToken);
        setShowAuthModal(false);
        setShowForm(true); // Form is shown after successful auth
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setData([]);
        setAlertType('success');
        setAlertMsg("👋 You have been logged out!");
    };

    const handleDelete = async (id) => {
        if (!token) {
            setAlertType('error');
            setAlertMsg("❌ You must be logged in to delete documents.");
            setShowAuthModal(true);
            return;
        }
        try {
            await axios.delete(`https://docs-mini-8kkm.onrender.com/api/cards/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(prev => prev.filter(item => item._id !== id));
            setAlertType('success');
            setAlertMsg('🗑️ Document deleted successfully!');
        } catch (err) {
            console.error('Delete error:', err);
            setAlertType('error');
            setAlertMsg('❌ Failed to delete document. You might not have permission.');
        }
    };

    const handleUpdateCard = async (id, updatedFields) => {
        if (!token) {
            setAlertType('error');
            setAlertMsg("❌ You must be logged in to update documents.");
            setShowAuthModal(true);
            return;
        }
        try {
            const res = await axios.patch(`https://docs-mini-8kkm.onrender.com/api/cards/${id}`, updatedFields, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(prev => prev.map(card => (card._id === id ? res.data : card)));
            setAlertType('success');
            setAlertMsg('✏️ Document updated successfully!');
        } catch (err) {
            console.error('Update error:', err);
            setAlertType('error');
            setAlertMsg('❌ Failed to update document. You might not have permission or a server error occurred.');
        }
    };

    useEffect(() => {
        if (alertMsg) {
            const timer = setTimeout(() => setAlertMsg(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [alertMsg]);

    return (
        <div ref={ref} className='relative w-full h-screen overflow-hidden'>
            {alertMsg && (
                <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-3 rounded shadow-md text-white ${alertType === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {alertMsg}
                    <button onClick={() => setAlertMsg('')} className='ml-3 text-white font-bold'>×</button>
                </div>
            )}

            <button
                onClick={() => {
                    // console.log('Plus button clicked. Current token:', token, 'Current showForm:', showForm); // Debugging line (can be removed)
                    if (!token) {
                        setAlertType('error');
                        setAlertMsg("❌ Please log in to add documents.");
                        setShowAuthModal(true);
                    } else {
                        setShowForm(!showForm); // This toggles showForm
                    }
                }}
                className='fixed z-[5] bottom-10 right-10 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors'
            >
                <IoMdAdd size={24} />
            </button>

            {token && <Logout onLogout={handleLogout} />}

            {showAuthModal && (
                <Login
                    onClose={() => setShowAuthModal(false)}
                    onAuthSuccess={handleAuthSuccess}
                />
            )}

            {showForm && (
                <UploadForm
                    newDoc={newDoc}
                    setNewDoc={setNewDoc}
                    previewURL={previewURL}
                    setPreviewURL={setPreviewURL}
                    handleAddCard={handleAddCard}
                    onClose={() => setShowForm(false)}
                    isAddingDocument={isAddingDocument} // <-- Pass loading state to UploadForm
                />
            )}

            <CardList data={data} reference={ref} handleDelete={handleDelete} handleUpdate={handleUpdateCard} />
        </div>
    );
};

export default Foreground;
