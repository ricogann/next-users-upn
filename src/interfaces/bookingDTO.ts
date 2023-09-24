export default interface BookingDTO {
    id_fasilitas: number;
    id_harga: number;
    id_account: number;
    tanggal_pemesanan: string;
    jam_checkin: string;
    jam_checkout: string;
    durasi: number;
    total_harga: number;
    keterangan: string;
    status: string;
}
