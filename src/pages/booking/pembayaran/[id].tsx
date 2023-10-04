import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

import { Navbar } from "@/components/navbar";
import Loading from "@/components/loading";

import _serviceBooking from "@/services/booking.service";

import _libCookies from "@/lib/cookies";

import CookiesDTO from "@/interfaces/cookiesDTO";
import PemesananDTO from "@/interfaces/pemesananDTO";
import _libBooking from "@/lib/booking";

export default function Pembayaran() {
    const router = useRouter();
    const libCookies = new _libCookies();
    const libBooking = new _libBooking();

    const booking = new _serviceBooking();

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (router.isReady) {
            setId(router.query.id as string);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady]);

    const [role, setRole] = useState<string>("");
    const [nama, setNama] = useState<string>("");
    const [id, setId] = useState<string>("");
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
    const [buktiSik, setBuktiSik] = useState<File | null>(null);

    const setData = (data: PemesananDTO) => {
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
        async function fetchData(id: string) {
            const data = await booking.getDetailPemesanan(Number(id));
            setData(data);

            const dataCookies: CookiesDTO = await libCookies.getCookies();

            if (dataCookies.CERT !== undefined) {
                setIsLogin(true);
                setRole(JSON.parse(atob(dataCookies.CERT.split(".")[1])).role);
                setNama(JSON.parse(atob(dataCookies.CERT.split(".")[1])).nama);
            } else {
                setIsLogin(false);
            }
        }

        if (id !== "") {
            fetchData(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        const interval = setInterval(async () => {
            const time = await libBooking.countdown([
                { tanggal_pemesanan: createdAt, remainingTime },
            ]);
        }, 1000);

        return () => clearInterval(interval);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createdAt]);

    const handleInputFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "bukti_pembayaran") {
            setBuktiPembayaran(e.target.files![0]);
        } else if (e.target.name === "bukti_sik") {
            setBuktiSik(e.target.files![0]);
        }
    };

    const handleUpload = async () => {
        if (!buktiSik) {
            setIsLoading(true);
            const data = new FormData();
            data.append("bukti_pembayaran", buktiPembayaran as File);
            const res = await booking.uploadBuktiPembayaran(data, Number(id));
            if (res.status === true) {
                router.push("/account/profile");
            }
        } else if (!buktiPembayaran) {
            setIsLoading(true);
            const data = new FormData();
            data.append("SIK", buktiSik as File);
            const res = await booking.uploadSIK(data, Number(id));
            if (res.status === true) {
                router.push("/account/profile");
            }
        }
    };

    return (
        <div className="flex flex-col bg-[#2C666E] relative">
            {isLoading && (
                <div className="absolute w-full h-full flex justify-center items-center z-50 backdrop-blur-sm">
                    <Loading />
                </div>
            )}
            <Navbar isLogin={isLogin} nama={nama} />

            <div className="p-10 md:px-28">
                <div className="flex flex-col rounded-[13px] mb-5">
                    <h1 className="text-[14px] font-regular text-[#F0EDEE]">
                        Step 2 of 2
                    </h1>
                    <h1 className="text-[29px] font-semibold text-[#F0EDEE]">
                        Form Sewa Fasilitas
                    </h1>
                </div>
                <div className=" bg-[#F0EDEE] flex flex-col justify-center items-center gap-3 p-10 rounded-[15px] shadow-xl lg:flex-row lg:w-full lg:justify-evenly">
                    <div className="text-center text-[#0A090C]">
                        <h2 className="text-[16px] lg:text-[25px] font-regular">
                            Selesaikan Pembayaran Dalam
                        </h2>
                        <h2 className="text-[25px] lg:text-[25px] font-bold text-[#FFA101]">
                            {remainingTime}
                        </h2>
                        <h2 className="text-[16px] lg:text-[25px] font-regular mt-5">
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
                        <div className="mt-5 font-regular text-center">
                            <h2 className="text-[20px] lg:text-[25px]">
                                Kode BNI VA
                            </h2>
                            <h2 className="text-[25px] lg:text-[30px] font-bold text-[#FFA101]">
                                1693547942887
                            </h2>
                        </div>
                    </div>

                    <div className="gap-2 flex flex-col text-[#0A090C]">
                        <div className="">
                            <h2 className="text-[16px] lg:text-[22px] font-semibold">
                                Nama
                            </h2>
                            <h2 className="text-[16px] lg:text-[18px] font-regular ">
                                {namaPemesan}
                            </h2>
                        </div>
                        <div className="">
                            <h2 className="text-[16px] lg:text-[22px] font-semibold ">
                                Tanggal Penyewaan
                            </h2>
                            <h2 className="text-[16px] lg:text-[18px] font-regular ">
                                {tanggalPemesanan}
                            </h2>
                        </div>
                        <div className="">
                            <h2 className="text-[16px] lg:text-[22px] font-semibold">
                                Fasilitas
                            </h2>
                            <h2 className="text-[16px] lg:text-[18px] font-regular ">
                                {namaFasilitas}
                            </h2>
                        </div>
                        <div className="">
                            <h2 className="text-[16px] lg:text-[22px] font-semibold">
                                Checkin - Checkout
                            </h2>
                            <h2 className="text-[16px] lg:text-[18px] font-regular ">
                                {`${jam_checkin} - ${jam_checkout}`}
                            </h2>
                        </div>
                        <h2
                            className={`${
                                role !== "umum" ? `hidden` : `flex`
                            } text-[16px] lg:text-[22px] font-semibold`}
                        >
                            Harga
                        </h2>
                        <h2
                            className={`${
                                role !== "umum" ? `hidden` : `flex`
                            } text-[16px] lg:text-[18px] font-regular`}
                        >
                            {`Rp${harga
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}
                        </h2>
                        <h2 className="text-[16px] lg:text-[22px] font-semibold">
                            Status
                        </h2>
                        <h2 className="text-[16px] lg:text-[18px] font-semibold text-red-500">
                            {role !== "umum"
                                ? namaFasilitas === "Asrama"
                                    ? "Belum Melakukan Pembayaran"
                                    : "Belum Upload SIK"
                                : "Belum Upload SIK"}
                        </h2>
                    </div>
                </div>
                {/* End Of Card */}

                <div className="flex-col flex gap-5 mt-5 p-5 border rounded-xl shadow-lg bg-[#F0EDEE] xl:p-10 xl:items-center">
                    <h1 className="font-semibold text-[#0A090C] xl:text-[25px]">
                        {role !== "umum"
                            ? namaFasilitas === "Asrama"
                                ? "Upload Bukti Pembayaran"
                                : "Upload SIK"
                            : "Upload SIK"}
                    </h1>
                    <form
                        className={`${
                            role !== "umum"
                                ? namaFasilitas === "Asrama"
                                    ? "flex"
                                    : "hidden"
                                : `flex`
                        } flex items-center`}
                    >
                        <input
                            name="bukti_pembayaran"
                            type="file"
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            onChange={handleInputFoto}
                        />
                    </form>
                    <form
                        className={`${
                            role !== "umum"
                                ? namaFasilitas === "Asrama"
                                    ? "hidden"
                                    : "flex"
                                : `hidden`
                        } flex items-center`}
                    >
                        <input
                            name="bukti_sik"
                            type="file"
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                            onChange={handleInputFoto}
                        />
                    </form>
                    <button
                        className="w-36 bg-[#07393C] hover:bg-[#2C666E] text-white font-bold py-2 px-4 rounded-lg ml-auto xl:m-auto"
                        onClick={handleUpload}
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );
}
