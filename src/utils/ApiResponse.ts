export default class ApiResponse {
    message: string;
    statusCode: number;
    data?: any;
    success: boolean;

    constructor(message: string, statusCode: number, data?: any) {
        this.message = message;
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        if (data) {
            this.data = data;
        }
    }
}