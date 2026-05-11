export const unwrapApiResponse = (response) => {
     const payload = response?.data ?? response;
     if (payload && typeof payload === 'object' && 'data' in payload) {
          return payload.data;
     }
     return payload;
};

export const pageContent = (page) => page?.content ?? [];

export const pageTotalElements = (page) =>
     page?.total_elements ?? page?.totalElements ?? 0;

export const pageTotalPages = (page) =>
     page?.total_pages ?? page?.totalPages ?? 1;
