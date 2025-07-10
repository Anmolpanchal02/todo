import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';

// Make sure to accept 'isAddingDocument' as a prop here
const UploadForm = ({ newDoc, setNewDoc, previewURL, setPreviewURL, handleAddCard, onClose, isAddingDocument }) => {
  const [isDragging, setIsDragging] = useState(false);

  // Handles file selection via input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDoc({ ...newDoc, file: file }); // Update file in newDoc state
      const url = URL.createObjectURL(file);
      setPreviewURL(url); // Set preview URL
    } else {
      setNewDoc({ ...newDoc, file: null });
      setPreviewURL(null);
    }
  };

  // Handles drag over event for visual feedback
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handles drag leave event for visual feedback
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Handles file drop event
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setNewDoc({ ...newDoc, file: file });
      const url = URL.createObjectURL(file);
      setPreviewURL(url);
    } else {
      setNewDoc({ ...newDoc, file: null });
      setPreviewURL(null);
    }
  };

  // When "Add Document" is clicked, call the handleAddCard prop
  // This function will now prepare FormData and pass it to the prop
  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('title', newDoc.title);
    formData.append('desc', newDoc.desc);
    if (newDoc.file) {
      formData.append('file', newDoc.file); // Append the actual file
    }
    // Call the handleAddCard prop, passing the FormData
    handleAddCard(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>

      {/* Form Container */}
      <div className="relative bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-sm mx-auto">
        {/* Header */}
        <div className="relative p-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-gray-100" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Add Document</h2>
                <p className="text-xs text-gray-500">Upload your files</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center group"
              >
                <X className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
              </button>
            )}
          </div>
        </div>

        {/* Form Content */}
        <div className="px-4 pb-4 space-y-4">
          {/* Title Input */}
          <div className="space-y-1">
            <label htmlFor="docTitle" className="block text-xs font-medium text-gray-700">
              Document Title
            </label>
            <input
              id="docTitle"
              type="text"
              placeholder="Enter title"
              value={newDoc.title}
              onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 text-sm"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-1">
            <label htmlFor="docDesc" className="block text-xs font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="docDesc"
              placeholder="Brief description"
              value={newDoc.desc}
              onChange={(e) => setNewDoc({ ...newDoc, desc: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 resize-none text-sm"
            />
          </div>

          {/* File Upload Area */}
          <div className="space-y-1">
            <label htmlFor="docFile" className="block text-xs font-medium text-gray-700">
              Upload File
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-4 transition-all ${
                isDragging
                   ? 'border-blue-400 bg-blue-50/50'
                   : 'border-gray-300 bg-gray-50/50 hover:border-gray-400'
              }`}
            >
              <input
                id="docFile"
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*" // Added common document types
              />
              <div className="text-center">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-600">
                  <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, or image files
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          {previewURL && (
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Preview
              </label>
              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={previewURL}
                  alt="Document preview"
                  className="w-full h-32 object-cover"
                />
                <div className="absolute top-1 right-1">
                  <button
                    onClick={() => {
                      setPreviewURL(null);
                      setNewDoc({ ...newDoc, file: null });
                    }}
                    className="w-5 h-5 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              // Removed the JavaScript comment from inside the disabled prop
              disabled={!newDoc.title.trim() || isAddingDocument}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm"
            >
              {isAddingDocument ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                  <span>Adding...</span>
                </div>
              ) : (
                'Add Document'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;