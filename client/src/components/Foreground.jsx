import React, { useRef, useState, useEffect } from 'react';
import Card from './Card';
import { IoMdAdd } from 'react-icons/io';
import axios from 'axios';

const Foreground = () => {
    const ref = useRef(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [data, setData] = useState([]);
    const [newDoc, setNewDoc] = useState({
        title: '',
        desc: '',
        file: null,
    });
    const [showForm, setShowForm] = useState(false);

    // ✅ Load from localStorage on mount
    useEffect(() => {
        axios.get('http://localhost:5000/api/cards')
            .then(res => setData(res.data))
            .catch(err => console.error('Fetch error:', err));
    }, []);

    // ✅ Save to localStorage on every change
    useEffect(() => {
        localStorage.setItem('docData', JSON.stringify(data));
    }, [data]);

    const handleAdd = async () => {
        if (!newDoc.title || !newDoc.desc) return;

        let fileSize = null;
        let fileURL = null;

        if (newDoc.file) {
            fileSize = `${(newDoc.file.size / (1024 * 1024)).toFixed(2)}mb`;
            fileURL = URL.createObjectURL(newDoc.file); // still used locally for download
        }

        const newData = {
            title: newDoc.title,
            desc: newDoc.desc,
            filesize: fileSize || 'N/A',
            fileURL,
            tag: {
                isOpen: !!fileURL,
                textTitle: fileURL ? 'Download' : '',
                tagColor: 'green',
            },
        };

        try {
            const res = await axios.post('http://localhost:5000/api/cards', newData);
            setData(prev => [...prev, res.data]);
            setNewDoc({ title: '', desc: '', file: null });
            setShowForm(false);
            setPreviewURL(null);
        } catch (err) {
            console.error('Add error:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/cards/${id}`);
            setData(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            console.error('Delete error:', err);
        }
    };



    return (
        <>
            {/* Add Button */}
            <button
                onClick={() => setShowForm(!showForm)}
                className='fixed z-[5] bottom-10 right-10 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700'
            >
                <IoMdAdd size={24} />
            </button>

            {/* Upload Form */}
            {showForm && (
                <div className='fixed z-[5] bottom-24 right-10 bg-white p-5 rounded-lg shadow-xl w-80 space-y-3'>
                    <input
                        type='text'
                        placeholder='Title'
                        value={newDoc.title}
                        onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                        className='w-full p-2 border rounded'
                    />
                    <input
                        type='text'
                        placeholder='Description'
                        value={newDoc.desc}
                        onChange={(e) => setNewDoc({ ...newDoc, desc: e.target.value })}
                        className='w-full p-2 border rounded'
                    />
                    <input
                        type='file'
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setNewDoc({ ...newDoc, file });
                            if (file && file.type.startsWith('image/')) {
                                setPreviewURL(URL.createObjectURL(file));
                            } else {
                                setPreviewURL(null);
                            }
                        }}
                        className='w-full p-2 border rounded'
                    />
                    {previewURL && (
                        <img
                            src={previewURL}
                            alt='Preview'
                            className='w-full h-40 object-cover rounded border'
                        />
                    )}
                    <button
                        onClick={handleAdd}
                        className='bg-zinc-800 text-white px-4 py-2 rounded w-full hover:bg-zinc-700'
                    >
                        Add Document
                    </button>
                </div>
            )}

            {/* Cards */}
            <div ref={ref} className='fixed top-0 left-0 z-[3] w-full h-full flex gap-10 flex-wrap p-5'>
                {data.map((item) => (
                    <Card
                        key={item._id}
                        data={item}
                        reference={ref}
                        onDelete={() => handleDelete(item._id)} // use _id here
                    />
                ))}

            </div>
        </>
    );
};

export default Foreground;
