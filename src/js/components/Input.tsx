import { FormMeta } from '@/types/types';
import React from 'react';

interface InputProps {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    value: string | number | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    meta: FormMeta;
    description?: string;
}

const Input: React.FC<InputProps> = ({ name, label, type = "text", placeholder, value, onChange, meta, description }) => {
    return (
        <div className="mb-2">
            <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
                { description && <p className="text-sm text-gray-600">{ description }</p> }
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value ?? ""}
                    onChange={(e) => onChange(e)}
                    // className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    // className={ `${ meta.touched && !meta.valid && "text-[#fc8181]" } disabled:cursor-not-allowed 
                                // p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full` }
                />
            </div>
            { meta && meta.touched && !meta.valid && <div id="form-error" className="text-red-500 text-sm">{ meta.error }</div> }
        </div>
    );
};

export default Input;