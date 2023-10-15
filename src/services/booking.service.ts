import BookingDTO from "@/interfaces/bookingDTO";
import _core from "./core.service";

class _serviceBooking extends _core {
    constructor() {
        super();
    }

    private baseUrl = _core.getBaseUrl();

    async getPemesanan(cookie: string) {
        const response = await fetch(`${this.baseUrl}/api/booking`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookie}`,
            },
        });
        const data = await response.json();

        return data.data;
    }

    async getPemesananByIdUser(idAccount: number, cookie: string) {
        try {
            const res = await fetch(
                `${this.baseUrl}/api/booking/user/${idAccount}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${cookie}`,
                    },
                }
            );
            const data = await res.json();
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getDetailPemesanan(id: number, cookie: string) {
        const response = await fetch(`${this.baseUrl}/api/booking/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookie}`,
            },
        });
        const data = await response.json();
        console.log(data);

        return data.data;
    }

    async addPemesanan(data: BookingDTO, cookie: string) {
        const response = await fetch(`${this.baseUrl}/api/booking/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookie}`,
            },
            body: JSON.stringify(data),
        });

        return await response.json();
    }

    async uploadSIK(data: FormData, id: number, cookie: string) {
        const response = await fetch(
            `${this.baseUrl}/api/booking/upload-sik/${id}`,
            {
                method: "PUT",
                body: data,
                headers: {
                    Authorization: `Bearer ${cookie}`,
                },
            }
        );

        return await response.json();
    }

    async uploadBuktiPembayaran(data: FormData, id: number, cookie: string) {
        const response = await fetch(
            `${this.baseUrl}/api/booking/upload-bukti/${id}`,
            {
                method: "PUT",
                body: data,
                headers: {
                    Authorization: `Bearer ${cookie}`,
                },
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
