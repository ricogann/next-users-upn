interface RemainingTime {
    tanggal_pemesanan: string;
    remainingTime: string;
}

class _libBooking {
    async countdown(tanggalPemesanan: RemainingTime[]) {
        const updatedRemainingTime = tanggalPemesanan.map((item) => {
            const targetDateTime =
                new Date(item.tanggal_pemesanan).getTime() +
                24 * 60 * 60 * 1000;

            const currentTime = new Date().getTime();

            const difference = targetDateTime - currentTime;

            if (difference <= 0) {
                return {
                    tanggal_pemesanan: item.tanggal_pemesanan,
                    remainingTime: "Waktu Habis",
                };
            } else if (difference > 0) {
                const hours = Math.floor(
                    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                    (difference % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                return {
                    tanggal_pemesanan: item.tanggal_pemesanan,
                    remainingTime: `${hours}:${minutes}:${
                        seconds < 10 ? `0${seconds}` : seconds
                    }`,
                };
            }
        });

        return updatedRemainingTime as RemainingTime[];
    }
}

export default _libBooking;
