import _serviceBooking from "@/services/booking.service";
import BookingDTO from "@/interfaces/bookingDTO";

class _libBooking {
    serviceBooking = new _serviceBooking("https://api.ricogann.com");

    async getPemesanan(id: number) {
        try {
            const data = await this.serviceBooking.getPemesanan(id);

            return data;
        } catch (error) {
            console.error("getPemesanan error", error);
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
}

export default _libBooking;
