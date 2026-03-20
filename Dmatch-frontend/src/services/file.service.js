import axiosClient from './axiosClient';

/**
 * File Storage API service — upload/delete files lên S3.
 *
 * Endpoints (qua API Gateway):
 *   POST   /api/v1/files              → Upload file (multipart/form-data)
 *   DELETE /api/v1/files              → Xóa file theo file_key
 *   GET    /api/v1/files/presigned-url → Lấy presigned URL để download/view
 */

/**
 * Upload file lên S3.
 * @param {File} file - File object từ input
 * @param {string} folder - Folder đích (avatars, cvs, logos, covers, general)
 * @returns {Promise} - { message, data: { file_name, file_key, file_type, file_size } }
 */
export const uploadFile = (file, folder = 'general') => {
     const formData = new FormData();
     formData.append('file', file);
     formData.append('folder', folder);

     return axiosClient.post('/api/v1/files', formData, {
          headers: {
               'Content-Type': 'multipart/form-data',
          },
     });
};

/**
 * Xóa file trên S3.
 * @param {string} fileKey - Key của file cần xóa
 */
export const deleteFile = (fileKey) => {
     return axiosClient.delete('/api/v1/files', {
          params: { file_key: fileKey },
     });
};

/**
 * Lấy presigned URL để download/view file.
 * @param {string} fileKey - Key của file
 * @returns {Promise} - { message, data: presignedUrl }
 */
export const getPresignedUrl = (fileKey) => {
     return axiosClient.get('/api/v1/files/presigned-url', {
          params: { file_key: fileKey },
     });
};
