import api from "./axios";

export const fetchCategories = async () => {
    const response = await api.get("/categories");
    
    if (response.data && response.data.success && response.data.data) {
        return response.data.data;
    }
    
    return response.data;
}

export const fetchCategoryById = async (id: string) =>{
    const response = await api.get(`/categories/${id}`);
    
    if (response.data && response.data.success && response.data.data) {
        return response.data.data;
    }

    return response.data;
}