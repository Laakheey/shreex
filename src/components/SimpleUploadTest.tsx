import { useState } from 'react';
import { Upload, Check, X, Loader2 } from 'lucide-react';
import { useSupabase } from '../components/providers/SupabaseProvider';
import { useUser } from '@clerk/clerk-react';

const SimpleUploadTest = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [error, setError] = useState('');
  
  const supabase = useSupabase();
  const { user } = useUser();
  
  const uploadToSupabase = async (file: File) => {
    if (!supabase || !user) {
      throw new Error('Supabase or user not available');
    }

    const bucketName = 'chat_attachments'; // Changed to match actual bucket name
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    try {
      console.log('Uploading file:', fileName);
      
      // Real Supabase upload
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          contentType: file.type,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw error;
      }

      console.log('Upload successful:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      console.log('Public URL:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (err: any) {
      throw new Error('Upload failed: ' + err.message);
    }
  };

  const handleFileSelect = (e: any) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setError('');
    setUploadedUrl('');
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const url = await uploadToSupabase(file);
      setUploadedUrl(url);
      console.log('File uploaded successfully:', url);
    } catch (err: any) {
      setError(err.message);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setUploadedUrl('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            File Upload Test
          </h1>
          <p className="text-sm text-gray-500">
            Test your Supabase storage integration
          </p>
        </div>

        {/* File Input */}
        {!file && !uploadedUrl && (
          <label className="block">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                Click to select an image
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </label>
        )}

        {/* Selected File Preview */}
        {file && !uploadedUrl && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700 truncate flex-1">
                  {file.name}
                </p>
                <button
                  onClick={reset}
                  className="text-gray-400 hover:text-red-500 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-indigo-600 text-white rounded-xl py-3 font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload File
                </>
              )}
            </button>
          </div>
        )}

        {/* Success State */}
        {uploadedUrl && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-800 mb-1">
                    Upload successful!
                  </p>
                  <p className="text-xs text-green-600 break-all">
                    {uploadedUrl}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full bg-gray-100 text-gray-700 rounded-xl py-3 font-medium hover:bg-gray-200 transition-colors"
            >
              Upload Another File
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Note:</strong> This is a test component. Replace the{' '}
            <code className="bg-gray-100 px-1 rounded">uploadToSupabase</code>{' '}
            function with your actual Supabase upload logic.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleUploadTest;