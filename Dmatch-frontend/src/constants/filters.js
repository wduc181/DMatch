/**
 * Static filter options cho các dropdowns.
 * Đây là constants cố định, không phải data từ backend API.
 */

// Location options cho filter
export const LOCATIONS = [
     { value: 'all', label: 'Tất cả địa điểm' },
     { value: 'ho-chi-minh', label: 'Hồ Chí Minh' },
     { value: 'ha-noi', label: 'Hà Nội' },
     { value: 'da-nang', label: 'Đà Nẵng' },
     { value: 'can-tho', label: 'Cần Thơ' },
];

// Company size ranges cho filter
export const COMPANY_SIZES = [
     { value: 'all', label: 'Tất cả quy mô' },
     { value: '1-50', label: 'Dưới 50 nhân viên', min: 1, max: 50 },
     { value: '51-200', label: '50 - 200 nhân viên', min: 51, max: 200 },
     { value: '201-500', label: '200 - 500 nhân viên', min: 201, max: 500 },
     { value: '501-1000', label: '500 - 1000 nhân viên', min: 501, max: 1000 },
     { value: '1000+', label: 'Trên 1000 nhân viên', min: 1001, max: Infinity },
];

// Job types
export const JOB_TYPES = [
     { value: 'FULL_TIME', label: 'Toàn thời gian' },
     { value: 'PART_TIME', label: 'Bán thời gian' },
     { value: 'CONTRACT', label: 'Hợp đồng' },
     { value: 'INTERNSHIP', label: 'Thực tập' },
     { value: 'REMOTE', label: 'Từ xa' },
];
