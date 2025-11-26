export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ErrorResponse {
    message: string;
    status: number;
    timestamp: string;
}