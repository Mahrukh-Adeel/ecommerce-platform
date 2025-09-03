import api from "./axios";

export const getUserProfile = async () => {
    const response = await api.get('/users/profile/me');
    
    if (response.data && response.data.success && response.data.data) {
        return response.data;
    }
    
    return response.data;
};

export const updateUserProfile = async (userId: string, updateData: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    password?: string;
}) => {
    console.log('Update Profile - User ID:', userId);
    
    const response = await api.put(`/users/${userId}`, updateData);
    
    if (response.data && response.data.success && response.data.data) {
        return response.data;
    }
    
    return response.data;
};

export const getUserById = async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    
    if (response.data && response.data.success && response.data.data) {
        return response.data;
    }
    
    return response.data;
};