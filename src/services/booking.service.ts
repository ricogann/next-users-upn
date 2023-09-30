import BookingDTO from "@/interfaces/bookingDTO";

class _serviceBooking {
    constructor(private baseUrl: string) {}

    async getPemesanan() {
        const response = await fetch(`${this.baseUrl}/api/booking`);
        const data = await response.json();

        return data.data;
    }

    async getPemesananByIdUser(idAccount: number) {
        try {
            const res = await fetch(
                `https://api.ricogann.com/api/booking/user/${idAccount}`
            );
            const data = await res.json();
            console.log(data);
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
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

    async uploadBuktiPembayaran(data: FormData, id: number) {
        const response = await fetch(
            `${this.baseUrl}/api/booking/upload-bukti/${id}`,
            {
                method: "PUT",
                body: data,
            }
        );

        return await response.json();
    }

    async addMahasiswaTokamar(id: number, idAccount: number) {
        const res = await fetch(
            `${this.baseUrl}/api/booking/kamarAsrama/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ idAccount }),
            }
        );
        return await res.json();
    }
}

export default _serviceBooking;
