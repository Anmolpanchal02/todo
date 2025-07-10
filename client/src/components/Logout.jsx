import React from 'react';
import { HiOutlineLogout } from "react-icons/hi";


const Logout = ({ onLogout }) => {
    return (
        <button
            onClick={onLogout}
            className=' fixed z-[5] top-8 right-8 bg-black text-white px-2 py-2 rounded-full shadow-md hover:bg-red-600 transition-colors'
        >
            <HiOutlineLogout title='Logout' />
        </button>
    );
};

export default Logout;