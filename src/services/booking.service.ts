import BookingDTO from "@/interfaces/bookingDTO";

class _serviceBooking {
    constructor(private baseUrl: string) {}

    async getPemesanan() {
        const response = await fetch(`${this.baseUrl}/api/booking`);
        const data = await response.json();

        return data.data;
    }

    async getDetailPemesanan(id: number) {
        const response = await fetch(`${this.baseUrl}/api/booking/${id}`);
        const data = await response.json();

        return data.data;
    }

    async addPemesanan(data: BookingDTO) {
        const response = await fetch(`${this.baseUrl}/api/booking/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return await response.json();
    }

    async uploadSIK(data: FormData, id: number) {
        const response = await fetch(
            `${this.baseUrl}/api/booking/upload-sik/${id}`,
            {
                method: "PUT",
                body: data,
            }
        );

        return await response.json();
    }
}

export default _serviceBooking;
