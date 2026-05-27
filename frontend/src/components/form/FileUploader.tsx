import React, { useState } from 'react';
import { UploadCloud, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Props {
  onUploadSuccess: (fileKey: string) => void;
}

export const FileUploader: React.FC<Props> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setError(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const res = await axios.post(`${baseUrl}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFileName(file.name);
      onUploadSuccess(res.data.fileKey);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label 
        htmlFor="file-upload"
        className="border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center transition-colors cursor-pointer text-center border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 block w-full bg-white relative"
      >
        <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={isUploading} accept=".pdf,.txt,.png,.jpg,.jpeg" />
        
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-gray-100 mb-4 text-gray-700">
           <UploadCloud className="w-5 h-5" />
        </div>
        <p className="text-[15px] font-bold text-gray-900 mb-1">Choose a file or drag & drop it here</p>
        <p className="text-[11px] font-semibold text-gray-400 mb-6 tracking-wide">JPEG, PNG, upto 10MB</p>
        
        <div className="bg-white border border-gray-200 text-gray-600 text-xs font-bold px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors shadow-sm">
          Browse Files
        </div>

        {isUploading && (
          <div className="mt-6 flex items-center text-sm text-orange-600 font-medium bg-orange-50 px-4 py-2 rounded-full">
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Uploading...
          </div>
        )}
        
        {fileName && !isUploading && (
          <div className="mt-6 flex items-center text-sm text-green-600 font-medium bg-green-50 px-4 py-2 rounded-full">
            <CheckCircle className="mr-2 h-4 w-4" />
            {fileName}
          </div>
        )}
      </label>
      {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
    </div>
  );
};
