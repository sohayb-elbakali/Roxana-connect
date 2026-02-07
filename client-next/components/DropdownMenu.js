'use client';

import { useState, useRef, useEffect } from 'react';

const DropdownMenu = ({ items, triggerClassName = '', menuClassName = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${triggerClassName}`}
        aria-label="More options"
      >
        <i className="fas fa-ellipsis-v text-gray-500"></i>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[5]"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-[10] ${menuClassName}`}>
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                disabled={item.disabled}
                className={`w-full flex items-center px-4 py-2.5 text-sm font-medium transition-colors ${
                  item.danger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-gray-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {item.icon && <i className={`${item.icon} w-5 mr-3 text-sm`}></i>}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DropdownMenu;
