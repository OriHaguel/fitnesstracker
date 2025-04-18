import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { SavedUser, Exercise } from './user/user.service.remote'
import { ExerciseProgress } from './tracking progress/progress.service';
const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api/'
    : '//localhost:3000/api/';



type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Create axios instance with default config
const axiosInstance = axios.create({
    withCredentials: true
});

// Define service methods
export const httpService = {
    get<T = any>(endpoint: string, data?: any): Promise<T> {
        return ajax<T>(endpoint, 'GET', data);
    },
    post<T = any>(endpoint: string, data?: SavedUser | Exercise | ExerciseProgress): Promise<T> {
        return ajax<T>(endpoint, 'POST', data);
    },
    put<T = any>(endpoint: string, data?: string | Exercise | number | ExerciseProgress | { weight: number }): Promise<T> {
        return ajax<T>(endpoint, 'PUT', data);
    },
    delete<T = any>(endpoint: string, data?: string | object): Promise<T> {
        return ajax<T>(endpoint, 'DELETE', data);
    }
};

async function ajax<T>(endpoint: string, method: HttpMethod = 'GET', data: any = null): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const params = (method === 'GET') ? data : null;

    const config: AxiosRequestConfig = {
        url,
        method,
        data,
        params
    };

    try {
        const res: AxiosResponse<T> = await axiosInstance(config);
        return res.data;
    } catch (error) {
        const err = error as AxiosError;
        console.log(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, data);
        console.dir(err);

        if (err.response?.status === 401) {
            sessionStorage.clear();
            window.location.assign('/');
        }
        throw err;
    }
}