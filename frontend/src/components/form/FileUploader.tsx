import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  onUploadSuccess: (fileKey: string) => void;
}

export const FileUploader: React.FC<Props> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File must be less than 5MB');
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
      setError(err.response?.data?.error?.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Reference Material (Optional)
      </label>
      
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors bg-white">
        <div className="space-y-1 text-center">
          {isUploading ? (
            <Loader2 className="mx-auto h-12 w-12 text-indigo-500 animate-spin" />
          ) : fileName ? (
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          ) : (
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          )}
          
          <div className="flex text-sm text-gray-600 justify-center">
            {fileName ? (
              <span className="font-medium text-indigo-600">{fileName}</span>
            ) : (
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf,.txt" onChange={handleFileChange} disabled={isUploading} />
              </label>
            )}
            {!fileName && <p className="pl-1">or drag and drop</p>}
          </div>
          <p className="text-xs text-gray-500">
            PDF or TXT up to 5MB
          </p>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};
