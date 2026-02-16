import React, { useState } from 'react';
import { ProductInstanceData } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { DocumentMagnifyingGlassIcon } from './icons/DocumentMagnifyingGlassIcon';
import { TrashIcon } from './icons/TrashIcon'; 

interface ProductInstanceMenuProps {
  isOpen: boolean;
  instances: ProductInstanceData[];
  activeInstanceId: string | null;
  onSelectInstance: (instanceId: string) => void;
  onDeleteInstance: (instanceId: string) => void;
  onClose: () => void;
}

interface ProductInstanceMenuItemProps {
  instance: ProductInstanceData;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  index: number;
}

const ProductInstanceMenuItem: React.FC<ProductInstanceMenuItemProps> = ({ instance, isActive, onSelect, onDelete, index }) => {
  const [isVanishing, setIsVanishing] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setIsVanishing(true);
    setTimeout(() => {
        onDelete();
    }, 350); 
  };

  return (
    <li 
      className={`transition-all duration-300 animate-list-enter ${isVanishing ? 'opacity-0 -translate-x-4' : ''}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <button
        onClick={onSelect}
        className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-lg transition-all duration-200 group apple-click
          ${isActive 
            ? 'bg-white/10 text-white' 
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }
        `}
      >
        <span className="flex items-center min-w-0"> 
          {instance.isLoading || instance.isCompetitorLoading ? (
            <svg className="animate-spin flex-shrink-0 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
             <DocumentMagnifyingGlassIcon className={`w-4 h-4 mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
          )}
          <span className="truncate text-sm font-medium">
            {instance.productName || `Untitled Session`}
          </span>
        </span>
        <span className="flex items-center flex-shrink-0 ml-2">
          {isActive && !isVanishing && (
            <CheckIcon className="w-4 h-4 text-white flex-shrink-0 mr-3" />
          )}
          <div
            onClick={handleDeleteClick}
            className={`p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/10 transition-colors ${isVanishing ? 'opacity-0' : ''}`}
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </div>
        </span>
      </button>
    </li>
  );
};


const ProductInstanceMenu: React.FC<ProductInstanceMenuProps> = ({ 
  isOpen,
  instances, 
  activeInstanceId, 
  onSelectInstance,
  onDeleteInstance,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 animate-fade-in" 
        onClick={onClose} 
      />
      <div 
        className="fixed top-20 left-4 w-80 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-page-enter origin-top-left"
      >
        <div className="p-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Reports
          </h2>
        </div>
        <ul className="max-h-[60vh] overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {instances.length > 0 ? (
            instances.map((instance, index) => (
              <ProductInstanceMenuItem
                key={instance.id}
                instance={instance}
                isActive={instance.id === activeInstanceId}
                onSelect={() => onSelectInstance(instance.id)}
                onDelete={() => onDeleteInstance(instance.id)}
                index={index}
              />
            ))
          ) : (
            <li className="p-4 text-center text-gray-500 text-sm">
              No active reports.
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default ProductInstanceMenu;