import React, { createContext, useState, useContext } from 'react';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
    const [activeMenu, setActiveMenu] = useState('inicio');

    return (
        <MenuContext.Provider value={{ activeMenu, setActiveMenu }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
};