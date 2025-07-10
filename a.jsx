import React, { useState } from 'react';
import { FaRegFileAlt, FaEdit } from 'react-icons/fa';
import { LuDownload } from 'react-icons/lu';
import { IoClose } from 'react-icons/io5';
import { motion } from 'framer-motion';

// Receive onSave prop
const Card = ({ data, reference, onDelete, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(data.title);
    const [editDesc, setEditDesc] = useState(data.desc);

    // Handles saving the edited title and description
    const handleSave = () => {
        // Send updates to the parent component via onSave prop
        onSave(data._id, { title: editTitle, desc: editDesc });
        setIsEditing(false); // Exit editing mode
    };

    // Handles canceling the edit, reverting to original values
    const handleCancel = () => {
        setEditTitle(data.title); // Revert title
        setEditDesc(data.desc);   // Revert description
        setIsEditing(false);      // Exit editing mode
    };

    return (
        <motion.div
            drag
            dragConstraints={reference}
            whileDrag={{ scale: 1.05 }}
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 100, bounceDamping: 30 }}
            className='relative flex-shrink-0 w-60 sm:w-64 md:w-72 lg:w-60 h-72 bg-zinc-900/90 rounded-[45px] text-white overflow-hidden flex flex-col'
        >
            {/* Title & Edit */}
            <div className='px-6 pt-5 flex-grow'>
                <div className='flex items-center justify-between text-lg font-bold'>
                    <div className='flex items-center gap-2 overflow-hidden'>
                        <FaRegFileAlt />
                        {isEditing ? (
                            <input
                                type='text'
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className='bg-transparent border-b border-zinc-700 text-white outline-none max-w-[120px] truncate focus:border-green-500' // Added focus style
                            />
                        ) : (
                            <span className='truncate max-w-[120px] text-base sm:text-lg md:text-xl'>{data.title}</span>
                        )}
                    </div>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} title='Edit'>
                            <FaEdit className='text-white hover:text-zinc-300 transition-colors' size={14} />
                        </button>
                    )}
                </div>

                {/* Description */}
                <div className='text-sm mt-3 break-words whitespace-pre-wrap'>
                    {isEditing ? (
                        <textarea
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className='w-full bg-transparent text-white border border-zinc-700 p-1 text-sm rounded resize-none h-20 focus:border-green-500' // Added focus style
                        />
                    ) : (
                        <p className='leading-tight font-semibold'>{data.desc}</p>
                    )}
                </div>
            </div>

            {/* File size + Delete Icon */}
            <div className='px-6 pb-2'>
                <div className='flex items-center gap-4 justify-between'>
                    <span className='text-sm font-semibold text-white flex items-center gap-2'>
                        {data.filesize}
                        {!isEditing && (
                            <button
                                onClick={onDelete}
                                className='w-6 h-6 ml-auto bg-zinc-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center z-10 transition-colors' // Changed ml-30 to ml-auto and added transition
                                title='Delete'
                            >
                                <IoClose size={14} />
                            </button>
                        )}
                    </span>
                </div>
            </div>

            {/* Footer: Save/Cancel or Download */}
            {isEditing ? (
                <div className='w-full flex justify-between p-3 gap-2 bg-zinc-700 rounded-b-[45px]'>
                    <button
                        onClick={handleSave}
                        className='bg-green-500 px-3 py-1 text-sm text-white rounded hover:bg-green-600 transition-colors flex-grow' // Added flex-grow
                    >
                        Save
                    </button>
                    <button
                        onClick={handleCancel}
                        className='bg-red-500 px-3 py-1 text-sm text-white rounded hover:bg-red-600 transition-colors flex-grow' // Added flex-grow
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                data.tag.isOpen &&
                data.fileURL && (
                    <div className='w-full bg-green-600 rounded-b-[45px] flex items-center justify-center py-3'>
                        <a
                            href={data.fileURL}
                            download
                            className='text-white font-bold text-sm hover:underline flex gap-2 items-center'
                        >
                            <LuDownload size={16} /> {data.tag.textTitle}
                        </a>
                    </div>
                )
            )}
        </motion.div>
    );
};

export default Card;