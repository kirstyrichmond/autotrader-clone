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
    autoComplete?: string;
}

const Input: React.FC<InputProps> = ({ name, label, type = "text", placeholder, value, onChange, meta, description, autoComplete }) => {
    return (
        <div className="mb-2">
            <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
                { description && <p className="text-sm text-gray-600 mb-2">{ description }</p> }
                <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={value ?? ""}
                    onChange={(e) => onChange(e)}
                    autoComplete={autoComplete}
                    className={meta && meta.touched && !meta.valid ? "input-error" : "input-normal"}
                />
            </div>
            { meta && meta.touched && !meta.valid && <div id="form-error" className="error-message">{ meta.error }</div> }
        </div>
    );
};

export default Input;
