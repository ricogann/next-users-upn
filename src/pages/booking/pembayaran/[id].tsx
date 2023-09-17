import { Navbar } from "@/components/navbar";
import { useState, useEffect, useCallback } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useRouter } from "next/router";
import useSwr from "swr";

interface Cookies {
    CERT: string;
}

interface Mahasiswa {
    nama: string;
}

interface Dosen {
    nama: string;
}

interface Umum {
    nama: string;
}

interface Fasilitas {
    nama: string;
}

interface Harga {
    harga: number;
}

interface Account {
    Dosen: Dosen[];
    Mahasiswa: Mahasiswa[];
    Umum: Umum[];
}

interface Pemesanan {
    Account: Account;
    Fasilitas: Fasilitas;
    Harga: Harga;
    id_pemesanan: number;
    jam_checkin: string;
    jam_checkout: string;
    total_harga: number;
    tanggal_pemesanan: string;
    status: string;
    createdAt: string;
}

export default function Pembayaran() {
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();
    const { id } = router.query;

    const [namaPemesan, setNamaPemesan] = useState("");
    const [tanggalPemesanan, setTanggalPemesanan] = useState("");
    const [jam_checkin, setJam_checkin] = useState("");
    const [jam_checkout, setJam_checkout] = useState("");
    const [harga, setHarga] = useState(0);
    const [status, setStatus] = useState("Belum dibayar");
    const [namaFasilitas, setNamaFasilitas] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [remainingTime, setRemainingTime] = useState(`23:59:59`);
    const [buktiPembayaran, setBuktiPembayaran] = useState<File | null>(null);

    async function getBooking(id: string) {
        try {
            const res = await fetch(
                `http://ricogann.com:5000/api/booking/${id}`
            );
            const result = await res.json();

            setData(result.data);
            countdown(result.data.createdAt);
        } catch (error) {
            console.log(error);
        }
    }

    const setData = (data: Pemesanan) => {
        console.log(data);
        // if (data.Account.Dosen.length === 0)
        if (data.Account.Mahasiswa.length > 0) {
            setNamaPemesan(data.Account.Mahasiswa[0].nama);
        }
        if (data.Account.Dosen.length > 0) {
            setNamaPemesan(data.Account.Dosen[0].nama);
        }
        if (data.Account.Umum.length > 0) {
            setNamaPemesan(data.Account.Umum[0].nama);
        }
        setTanggalPemesanan(
            new Date(data.tanggal_pemesanan).toISOString().split("T")[0]
        );
        setJam_checkin(data.jam_checkin);
        setJam_checkout(data.jam_checkout);
        setHarga(data.total_harga);
        setStatus(data.status);
        setNamaFasilitas(data.Fasilitas.nama);
        setCreatedAt(data.createdAt);
    };

    useEffect(() => {
        const cookiesGet = document.cookie.split(";").reduce((res, c) => {
            const [key, val] = c.trim().split("=");
            try {
                return Object.assign(res, { [key]: JSON.parse(val) });
            } catch (e) {
                return Object.assign(res, { [key]: val });
            }
        }, {});

        const cookies = cookiesGet as Cookies;

        if (cookies.CERT) {
            setIsLogin(true);
        } else {
            router.push("/auth/login");
        }

        if (id) {
            getBooking(id as string);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        const interval = setInterval(() => {
            countdown(createdAt);
        }, 1000);

        return () => clearInterval(interval);
    }, [createdAt]);

    async function countdown(tanggalPemesanan: string) {
        const targetDateTime =
            new Date(tanggalPemesanan).getTime() + 24 * 60 * 60 * 1000;

        const currentTime = new Date().getTime();
        const difference = targetDateTime - currentTime;

        if (difference <= 0) {
            console.log("waktu habis");
        } else {
            const hours = Math.floor(
                (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
                (difference % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setRemainingTime(
                `${hours}:${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
            );
        }
    }

    async function uploadBuktiPembayaran(id: string, body: FormData) {
        try {
            const res = await fetch(
                `http://ricogann.com:5000/api/booking/upload-bukti/${id}`,
                {
                    method: "PUT",
                    body: body,
                }
            );
            const result = await res.json();

            if (result.status === true) {
                router.push("/account/profile");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleInputFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setBuktiPembayaran(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!buktiPembayaran) {
            alert("Harap upload bukti pembayaran terlebih dahulu");
        } else {
            const data = new FormData();
            data.append("bukti_pembayaran", buktiPembayaran);
            uploadBuktiPembayaran(id as string, data);
        }
    };

    return (
        <div className="flex flex-col bg-[#F7F8FA]">
            <Navbar isLogin={isLogin} />

            <div className="p-10">
                <div className="flex flex-col rounded-[13px] mb-5">
                    <h1 className="text-[14px] font-regular text-[#7F8FA4]">
                        Step 2 of 2
                    </h1>
                    <h1 className="text-[29px] font-semibold text-[#11141A]">
                        Form Sewa Fasilitas
                    </h1>
                </div>
                <div className=" bg-[#FFFFFF] flex-row justify-center items-center gap-3 p-10 rounded-[15px] shadow-lg lg:bg-[#FFFFFF] lg:flex-col lg:w-full">
                    <div className="text-center">
                        <h2 className="text-[16px] lg:text-[12px] font-semibold ">
                            Selesaikan Pembayaran Dalam
                        </h2>
                        <h2 className="text-[25px] lg:text-[12px] font-semibold text-[#FFA101]">
                            {remainingTime}
                        </h2>
                        <h2 className="text-[16px] lg:text-[12px] font-semibold mt-5">
                            Batas akhir pembayaran <br />
                            {`${new Date(createdAt).getDate() + 1} ${new Date(
                                createdAt
                            ).toLocaleString("default", {
                                month: "long",
                            })} ${new Date(createdAt).getFullYear()} `}{" "}
                            <br />
                            {`${new Date(createdAt).getHours()}:${new Date(
                                createdAt
                            ).getMinutes()}`}
                        </h2>
                    </div>

                    <div className="gap-2 flex flex-col">
                        <div className="mt-5">
                            <h2 className="text-[20px] lg:text-[12px] font-semibold text-center">
                                Kode BNI VA
                            </h2>
                            <h2 className="text-[25px] lg:text-[12px] font-semibold text-[#FFA101] text-center">
                                1693547942887
                            </h2>
                        </div>
                        <h2 className="text-[16px] lg:text-[12px] font-semibold mt-5">
                            Informasi Pemesanan
                        </h2>
                        <div className="">
                            <h2 className="text-[16px] lg:text-[12px] font-semibold text-[#7F8FA4]">
                                Nama
                            </h2>
                            <h2 className="text-[16px] lg:text-[12px] font-semibold ">
                                {namaPemesan}
                            </h2>
                        </div>
                        <div className="">
                            <h2 className="text-[16px] lg:text-[12px] font-semibold text-[#7F8FA4]">
                                Fasilitas
                            </h2>
                            <h2 className="text-[16px] lg:text-[12px] font-semibold ">
                                {namaFasilitas}
                            </h2>
                        </div>
                        <div className="">
                            <h2 className="text-[16px] lg:text-[12px] font-semibold text-[#7F8FA4]">
                                Checkin - Checkout
                            </h2>
                            <h2 className="text-[16px] lg:text-[12px] font-semibold ">
                                {`${jam_checkin} - ${jam_checkout}`}
                            </h2>
                        </div>
                        <div className="">
                            <h2 className="text-[16px] lg:text-[12px] font-semibold text-[#7F8FA4] ">
                                Tanggal Penyewaan
                            </h2>
                            <h2 className="text-[16px] lg:text-[12px] font-semibold ">
                                {tanggalPemesanan}
                            </h2>
                        </div>
                        <h2 className="text-[16px] lg:text-[12px] font-semibold text-[#7F8FA4]">
                            Harga
                        </h2>
                        <h2 className="text-[16px] lg:text-[12px] font-semibold ">
                            {`Rp${harga
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}
                        </h2>
                        <h2 className="text-[16px] lg:text-[12px] font-semibold text-[#7F8FA4]">
                            Status
                        </h2>
                        <h2 className="text-[16px] lg:text-[12px] font-semibold text-red-500">
                            {status}
                        </h2>
                    </div>
                </div>
                {/* End Of Card */}

                <div className="flex-col flex gap-5 mt-5 p-5 border rounded-xl shadow-lg bg-[#FFFFFF] xl:p-10 xl:items-center">
                    <h1 className="font-semibold">Upload Bukti Pembayaran</h1>
                    <form className="flex items-center">
                        <input
                            name="bukti_pembayaran"
                            type="file"
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            onChange={handleInputFoto}
                        />
                    </form>
                    <button
                        className="w-36 bg-[#322A7D] hover:bg-[#00FF66] text-white font-bold py-2 px-4 rounded-lg ml-auto xl:m-auto"
                        onClick={handleUpload}
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
}
