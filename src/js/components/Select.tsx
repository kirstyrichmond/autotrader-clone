import { FormMeta } from '@/types/types';
import React from 'react';

interface SelectProps {
    options: { value: string; label: string }[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    label: string;
    name: string;
    value: string;
    meta: FormMeta;
}

const Select: React.FC<SelectProps> = ({ name, label, options, onChange, value, meta }) => {
    return (
        <div className="mb-2">
            <div className="relative inline-block w-full mb-2">
                <label className="text-sm font-medium text-gray-700">{ label }</label>
                <select
                    className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
                    id={value}
                    value={value}
                    name={name}
                    onChange={(e) => onChange(e)}
                >
                    <option value="" disabled>--Please choose an option--</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-11 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
            </div>
            { meta && meta.touched && !meta.valid && <div id="form-error" className="text-red-500 text-sm">{ meta.error }</div> }
        </div>
    );
};

export default Select;