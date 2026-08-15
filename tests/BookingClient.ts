import { APIRequestContext } from '@playwright/test';

export class BookingClient {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }
    async getAllBookings() {
        const response = await this.request.get('/booking');
        return response;
    }
    async getBookingById(id: number) {
        const response = await this.request.get(`/booking/${id}`);
        return response;
    }
    async getBookingByDate(checkin: string) {
        const response = await this.request.get(`/booking?checkin=${checkin}`);
        return response;
    }
    async createBooking(bookingData: any) {
        const response = await this.request.post('/booking', {
            data: bookingData
        });
        return response;
    }
    async authMethod(username: string, password: string) {
        const authRes = await this.request.post('/auth', {
            data: { username, password }
        });
        return authRes;
    }
    async deleteBooking(id: number, token: string) {
        const response = await this.request.delete(`/booking/${id}`, {
            headers: {
                'Cookie': `token=${token}`
            }
        });
        return response;
    }
    async updateBooking(id: number, token: string, updatedData: any) {
        return await this.request.put(`/booking/${id}`, {
            headers: {
                'Cookie': `token=${token}`
            },
            data: updatedData
        });
    }
}