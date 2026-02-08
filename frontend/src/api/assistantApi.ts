// src/api/assistantApi.ts
import axiosInstance from "./interceptor/axiosInstance";


//ask ai
export const askAssistant = async (prompt: string) => {
    const response = await axiosInstance.post("/assistant/ask", { prompt });
    return response.data; 
};
