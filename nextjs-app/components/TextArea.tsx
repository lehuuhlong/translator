'use client';

interface TextAreaProps {
  value: string;
  onChange: (text: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  label: string;
  id: string;
}

export function TextArea({ value, onChange, readOnly, placeholder, label, id }: TextAreaProps) {
  const charCount = value.length;

  return (
    <div className="flex flex-col gap-2 flex-1">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      <div className="flex-1 relative">
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
          className="w-full h-full min-h-[200px] p-3 border rounded-lg resize-none bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
        />
        <div className="absolute bottom-2 right-2 text-sm text-gray-500">{charCount} characters</div>
      </div>
    </div>
  );
}
