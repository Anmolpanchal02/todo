import React, { useState } from 'react';
import { FaRegFileAlt, FaEdit } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { Eye, X } from 'lucide-react'; // Eye icon for preview, X for closing modal

// Preview Modal Component
const PreviewModal = ({ fileURL, onClose }) => {
  if (!fileURL) return null;

  // Function to determine if the file is an image
  const isImageFile = (url) => {
    const lowerUrl = url.toLowerCase();
    return lowerUrl.match(/\.(jpeg|jpg|gif|png|webp|bmp|tiff|svg)$/i); // Added more common image formats
  };

  const isImage = isImageFile(fileURL);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 ">
      <div className="relative bg-zinc-900 rounded-lg shadow-xl max-w-3xl  flex flex-col w-[80vw]   lg:w-[20vw] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-3 bg-zinc-800 border-b border-zinc-700">
          <h3 className="text-white text-lg font-semibold">Image Preview</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            title="Close Preview"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content - Image Viewer */}
        <div className="flex-grow flex items-center justify-center bg-zinc-900 w-[80vw]  lg:w-[20vw]  mx-auto  p-4">
          {isImage ? (
           
            <div className="bg-zinc-800 p-2 rounded-lg flex items-center justify-center max-w-full max-h-full overflow-auto"> {/* <-- overflow-auto जोड़ा गया */}
              <img src={fileURL} alt="Image Preview" className="w-[80vw]  lg:w-[20vw] object-contain overflow-scroll rounded" />
            </div>
          ) : (
            <div className="text-white text-center p-4">
              <p className="mb-2">Only image files can be previewed directly.</p>
              <p>If this is an image, it might be an unsupported format or the URL is incorrect.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const Card = ({ data, reference, onDelete, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(data.title);
    const [editDesc, setEditDesc] = useState(data.desc);
    const [showPreviewModal, setShowPreviewModal] = useState(false); // State for preview modal

    const handleSave = () => {
        onSave(data._id, { title: editTitle, desc: editDesc });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(data.title);
        setEditDesc(data.desc);
        setIsEditing(false);
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
                                className='bg-transparent border-b border-zinc-700 text-white outline-none max-w-[120px] truncate focus:border-green-500'
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
                            className='w-full bg-transparent text-white border border-zinc-700 p-1 text-sm rounded resize-none h-20 focus:border-green-500'
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
                                className='w-6 h-6 ml-auto bg-zinc-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center z-10 transition-colors'
                                title='Delete'
                            >
                                <IoClose size={14} />
                            </button>
                        )}
                    </span>
                </div>
            </div>

            {/* Footer: Save/Cancel or Preview */}
            {isEditing ? (
                <div className='w-full flex justify-between p-3 gap-2 bg-zinc-700 rounded-b-[45px]'>
                    <button
                        onClick={handleSave}
                        className='bg-green-500 px-3 py-1 text-sm text-white rounded hover:bg-green-600 transition-colors flex-grow'
                    >
                        Save
                    </button>
                    <button
                        onClick={handleCancel}
                        className='bg-red-500 px-3 py-1 text-sm text-white rounded hover:bg-red-600 transition-colors flex-grow'
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                data.tag.isOpen &&
                data.fileURL && (
                    <div className='w-full bg-green-600 rounded-b-[45px] flex items-center justify-center py-3 px-6'>
                        <div className="flex items-center justify-center w-full">
                            {/* Preview Button */}
                            <button
                                onClick={() => setShowPreviewModal(true)}
                                className='text-white font-bold text-sm hover:underline flex gap-2 items-center hover:text-green-200 transition-colors'
                                title="Preview"
                            >
                                <Eye size={16} /> Preview
                            </button>
                        </div>
                    </div>
                )
            )}

            {/* Preview Modal */}
            {showPreviewModal && data.fileURL && (
                <PreviewModal fileURL={data.fileURL} onClose={() => setShowPreviewModal(false)} />
            )}
        </motion.div>
    );
};

export default Card;
