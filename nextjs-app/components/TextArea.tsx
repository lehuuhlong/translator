'use client';

interface TextAreaProps {
  value: string;
  onChange: (text: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  id: string;
}

export function TextArea({ value, onChange, readOnly, placeholder, id }: TextAreaProps) {
  const charCount = value.length;
  const showCount = !readOnly;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative">
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
          maxLength={5000}
          className="w-full h-[200px] px-4 pr-16 py-4 resize-none bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 dark:text-white text-2xl placeholder:text-gray-400 dark:placeholder:text-gray-600"
        />
        {showCount && (
          <div className="absolute bottom-4 right-4">
            <span className="text-sm text-gray-400">{charCount} / 5000</span>
          </div>
        )}
      </div>
    </div>
  );
}
