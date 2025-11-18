
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div className="relative">
      <input
        id={id}
        className="block w-full px-4 pt-6 pb-2 bg-surface-variant/60 dark:bg-surface-variant/30 border-b-2 border-on-surface-variant rounded-t-lg peer focus:outline-none focus:border-primary"
        placeholder=" " 
        {...props}
      />
       <label 
        htmlFor={id} 
        className="absolute text-sm text-on-surface-variant duration-300 transform -translate-y-3.5 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5"
      >
        {label}
      </label>
    </div>
  );
};

export default Input;