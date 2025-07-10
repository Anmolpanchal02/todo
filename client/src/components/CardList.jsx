import React from 'react';
import Card from './Card';

const CardList = ({ data, reference, handleDelete, handleUpdate }) => {
    return (
        <div
            ref={reference}
            className='fixed top-0 left-0 z-[3] w-full h-full flex flex-wrap gap-5 md:gap-10 p-3 md:p-5 justify-center md:justify-start overflow-x-hidden overflow-y-hidden'
        >
            
            {data.map((item) => (
                <Card
                    key={item._id}
                    data={item}
                    reference={reference}
                    onDelete={() => handleDelete(item._id)}
                    onSave={handleUpdate}
                />
            ))}
        </div>
    );
};

export default CardList;