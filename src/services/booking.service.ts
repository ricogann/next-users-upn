import BookingDTO from "@/interfaces/bookingDTO";

class _serviceBooking {
    constructor(private baseUrl: string) {}

    async getPemesanan(id: number) {
        const response = await fetch(
            `${this.baseUrl}/api/booking/fasilitas/${id}`
        );
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
}

export default _serviceBooking;
