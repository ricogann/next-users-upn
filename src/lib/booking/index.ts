import _serviceBooking from "@/services/booking.service";
import BookingDTO from "@/interfaces/bookingDTO";

class _libBooking {
    serviceBooking = new _serviceBooking("https://api.ricogann.com");

    async getPemesanan(id: number) {
        try {
            const data = await this.serviceBooking.getPemesanan();

            return data;
        } catch (error) {
            console.error("getPemesanan error", error);
            throw error;
        }
    }

    async getPemesananByIdUser(idAccount: number) {
        try {
            const data = await this.serviceBooking.getPemesananByIdUser(
                idAccount
            );

            return data;
        } catch (error) {
            console.error("getPemesananByIdUser error", error);
            throw error;
        }
    }

    async getDetailPemesanan(id: number) {
        try {
            const data = await this.serviceBooking.getDetailPemesanan(id);

            return data;
        } catch (error) {
            console.error("getDetailPemesanan error", error);
            throw error;
        }
    }

    async addPemesanan(body: BookingDTO) {
        try {
            const data = await this.serviceBooking.addPemesanan(body);

            if (data.status === true) {
                return data;
            }
        } catch (error) {
            console.error("addPemesanan error", error);
            throw error;
        }
    }

    async uploadSIK(data: FormData, id: number) {
        try {
            const response = await this.serviceBooking.uploadSIK(data, id);

            if (response.status === true) {
                return response;
            }
        } catch (error) {
            console.error("uploadSIK error", error);
            throw error;
        }
    }

    async uploadBuktiPembayaran(data: FormData, id: number) {
        try {
            const response = await this.serviceBooking.uploadBuktiPembayaran(
                data,
                id
            );

            if (response.status === true) {
                return response;
            }
        } catch (error) {
            console.error("uploadBuktiPembayaran error", error);
            throw error;
        }
    }

    async addMahasiswaToKamar(id: number, idAccount: number) {
        try {
            const response = await this.serviceBooking.addMahasiswaTokamar(
                id,
                idAccount
            );

            if (response.status === true) {
                return response;
            }
        } catch (error) {
            console.error("addMahasiswaToKamar error", error);
            throw error;
        }
    }
}

export default _libBooking;
