import { FormMeta } from '@/types/types';
import React from 'react';

interface TextAreaProps {
    name: string;
    label: string;
    placeholder?: string;
    value: string | null;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    meta: FormMeta;
    description?: string;
    rows?: number;
    className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ 
    name, 
    label, 
    placeholder, 
    value, 
    onChange, 
    meta, 
    description, 
    rows = 4,
    className 
}) => {
    return (
        <div className="mb-2">
            <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
                { description && <p className="text-sm text-gray-600 mb-2">{ description }</p> }
                <textarea
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    value={value ?? ""}
                    onChange={(e) => onChange(e)}
                    rows={rows}
                    className={`${className || ''} ${meta && meta.touched && !meta.valid ? "input-error" : "input-normal"}`}
                />
            </div>
            { meta && meta.touched && !meta.valid && <div id="form-error" className="error-message">{ meta.error }</div> }
        </div>
    );
};

export default TextArea;