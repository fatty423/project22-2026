import { useRef, useState, useCallback } from 'react';
import { Upload, X, Camera, Video } from 'lucide-react';

interface FileUploadProps {
  accept: string;
  label: string;
  hint: string;
  icon: 'photo' | 'video';
  maxSizeMB: number;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  error?: string;
  preview?: string;
}

export function FileUpload({
  accept,
  label,
  hint,
  icon,
  maxSizeMB,
  file,
  onFileSelect,
  error,
  preview,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFileSelect(dropped);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const IconComponent = icon === 'photo' ? Camera : Video;

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>

      {file && preview && icon === 'photo' ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-xl border-2 border-slate-200"
          />
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : file ? (
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <Video className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {file.name}
            </p>
            <p className="text-xs text-slate-500">
              {(file.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : error
                ? 'border-red-300 bg-red-50'
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center ${
                isDragging ? 'bg-blue-100' : 'bg-slate-100'
              }`}
            >
              {isDragging ? (
                <Upload className="w-7 h-7 text-blue-600" />
              ) : (
                <IconComponent className="w-7 h-7 text-slate-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                {isDragging ? 'Drop file here' : 'Drag and drop or click to browse'}
              </p>
              <p className="text-xs text-slate-500 mt-1">{hint}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Max size: {maxSizeMB}MB
              </p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const selected = e.target.files?.[0] || null;
          onFileSelect(selected);
          if (inputRef.current) inputRef.current.value = '';
        }}
      />

      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
