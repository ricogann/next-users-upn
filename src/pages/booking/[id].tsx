import Image from "next/image";
import { useState, useEffect } from "react";

import { Navbar } from "@/components/navbar";

import { BsFillPersonFill, BsFillCalendarFill } from "react-icons/bs";
import { FaDollarSign } from "react-icons/fa";
import {
    BiSolidPhoneCall,
    BiSolidPencil,
    BiCalendar,
    BiSolidTimer,
} from "react-icons/bi";
import { HiLocationMarker } from "react-icons/hi";
import { AiFillClockCircle } from "react-icons/ai";
import { MdPayment } from "react-icons/md";
import { useRouter } from "next/router";
import Loading from "@/components/loading";
import Footer from "@/components/footer";

import _serviceBooking from "@/services/booking.service";
import _serviceFasilitas from "@/services/fasilitas.service";
import _serviceUsers from "@/services/users.service";

import _libCookies from "@/lib/cookies";

import BookingDTO from "@/interfaces/bookingDTO";
import CookiesDTO from "@/interfaces/cookiesDTO";
import PemesananDTO from "@/interfaces/pemesananDTO";
import AccountDTO from "@/interfaces/accountDTO";
import FasilitasDTO from "@/interfaces/fasilitasDTO";

export default function Booking() {
    const router = useRouter();
    const fasilitas = new _serviceFasilitas();
    const booking = new _serviceBooking();
    const users = new _serviceUsers();

    const libCookies = new _libCookies();

    const [isLogin, setIsLogin] = useState(true);
    const [dataHarga, setDataHarga] = useState<any>([]);
    const [dataFasilitas, setDataFasilitas] = useState<FasilitasDTO>();
    const [isAvailable, setIsAvailable] = useState(true);
    const [pemesanan, setPemesanan] = useState<PemesananDTO[]>([]);
    const [date, setDate] = useState("");
    const [id, setId] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (router.isReady) {
            setId(router.query.id as string);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady]);

    const [dataBooked, setDataBooked] = useState<PemesananDTO[]>([]);

    //data booking
    const [idAccount, setIdAccount] = useState<number>(0);
    const [idHarga, setIdHarga] = useState<number>(0);
    const [namaAccount, setNamaAccount] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [tanggal, setTanggal] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [jam_checkin, setJamCheckin] = useState<string>("00:00");
    const [jam_checkout, setJamCheckout] = useState<string>("00:00");
    const [harga, setHarga] = useState<number>(0);
    const [noTelpAccount, setNoTelpAccount] = useState<string>("");
    const [keterangan, setKeterangan] = useState<string>("");
    const [durasi, setDurasi] = useState<number>(1);
    const [statusBook, setStatusBook] = useState<boolean>(true);
    const [bookMessage, setBookMessage] = useState<string>("");
    const [isAsrama, setIsAsrama] = useState<boolean>(false);
    const [cookiesCert, setCookiesCert] = useState<string>("");
    const [isWeekend, setIsWeekend] = useState<boolean>(false);

    const jamToNumber = (jam: string) => {
        const convertJam = jam.split(":").join("");
        return parseInt(convertJam);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "nama") {
            setNamaAccount(e.target.value);
        } else if (e.target.name === "tanggal") {
            setTanggal(e.target.value);
        } else if (e.target.name === "jam_checkin") {
            setJamCheckin(e.target.value);
            setJamCheckout(Number(e.target.value.split(":")[0]) + 1 + ":00");
        } else if (e.target.name === "jam_checkout") {
            setJamCheckout(e.target.value);
            if (jamToNumber(e.target.value) <= jamToNumber(jam_checkin)) {
                setStatusBook(false);
                setBookMessage(
                    "Jam Checkout harus setidaknya 1 jam setelah jam checkin"
                );
            } else {
                setStatusBook(true);
            }
        } else if (e.target.name === "harga") {
            setHarga(parseInt(e.target.value));
        } else if (e.target.name === "no_telp") {
            setNoTelpAccount(e.target.value);
        } else if (e.target.name === "durasi") {
            setDurasi(parseInt(e.target.value));
        }
    };

    const checkWeekend = (dateStr: string) => {
        const date = new Date(dateStr);
        const dayOfWeek = date.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6;
    };

    const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.name === "keterangan") {
            setKeterangan(e.target.value);
        }
    };

    const handleHarga = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIdHarga(parseInt(e.target.value.split(",")[0]));
        setHarga(parseInt(e.target.value.split(",")[1]));
    };

    useEffect(() => {
        async function init(id: string) {
            const cookies: CookiesDTO = await libCookies.getCookies();
            setCookiesCert(cookies.CERT);
            if (cookies.CERT === undefined) {
                setIsLogin(false);
                router.push("/");
            } else {
                setIsLogin(true);
            }

            const dataHarga = await fasilitas.getHarga(Number(id));
            const dataFasilitas: FasilitasDTO =
                await fasilitas.getFasilitasById(Number(id));

            if (dataFasilitas.nama === "Asrama") {
                setIsAsrama(true);
            }

            const dataBooking = await booking.getPemesanan(cookies.CERT);
            setPemesanan(dataBooking);

            const Account: AccountDTO = await libCookies.parseJwt(cookies);

            setIdAccount(Account.id_account);
            setNamaAccount(Account.nama);
            setNoTelpAccount(Account.no_telp);
            setRole(Account.role);

            setDataHarga(dataHarga);
            setIdHarga(dataHarga[0].id);
            if (role === "umum") {
                setHarga(dataHarga[0].harga);
            }
            setHarga(dataHarga[0].harga);

            setDataFasilitas(dataFasilitas);
        }

        if (id !== "") {
            init(id as string);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const timeStringToMinutes = (timeString: string) => {
        const [hours, minutes] = timeString.split(/[:.]/).map(Number);
        return hours * 60 + minutes;
    };

    const setDurasiBooking = () => {
        const checkin: number = timeStringToMinutes(jam_checkin);
        const checkout: number = timeStringToMinutes(jam_checkout);

        return checkout - checkin;
    };

    useEffect(() => {
        let dataBooked: PemesananDTO[] = [];

        const weekend = checkWeekend(tanggal);
        if (weekend) {
            setIsWeekend(true);
        } else {
            setIsWeekend(false);
        }

        pemesanan.map((item) => {
            if (item.durasi > 1) {
                const dbDate = new Date(item.tanggal_pemesanan.split("T")[0]);
                for (let i = 0; i < item.durasi; i++) {
                    const temp = dbDate.setDate(dbDate.getDate() + 1);
                    const dayAfter = new Date(temp).toISOString().split("T")[0];

                    if (dayAfter === tanggal) {
                        setStatusBook(false);
                        dataBooked.push(item);
                    }
                }
            }
            if (
                item.tanggal_pemesanan.split("T")[0] === tanggal &&
                item.id_fasilitas === Number(id)
            ) {
                setStatusBook(false);
                dataBooked.push(item);
            }
        });

        if (keterangan === "") {
            setStatusBook(false);
            setBookMessage("Keterangan harus diisi");
        } else {
            if (
                dataBooked.length > 0 &&
                dataBooked.filter((item) => item.status !== "Dibatalkan")
                    .length > 0
            ) {
                setBookMessage("Tanggal sudah di booking");
            } else {
                setStatusBook(true);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tanggal, keterangan]);

    const handleBooking = async () => {
        const data: BookingDTO = {
            id_fasilitas: Number(id),
            id_harga: idHarga,
            id_account: idAccount,
            tanggal_pemesanan: tanggal,
            jam_checkin: jam_checkin,
            jam_checkout: jam_checkout,
            total_harga: isAsrama
                ? harga * 2 + 250000
                : role === "organisasi" && isWeekend
                ? harga * durasi
                : role !== "umum"
                ? 0
                : harga * durasi,
            durasi: durasi,
            keterangan: keterangan,
            status: "Menunggu Konfirmasi",
        };

        if (isAsrama) {
            if (await users.checkExpiredMahasiswa(idAccount, cookiesCert)) {
                setLoading(true);
                const addMahasiswaToKamar = await booking.addMahasiswaTokamar(
                    idHarga,
                    idAccount,
                    cookiesCert
                );

                if (addMahasiswaToKamar !== undefined) {
                    const createPemesanan = await booking.addPemesanan(
                        data,
                        cookiesCert
                    );
                    if (createPemesanan.status === true) {
                        setLoading(false);
                        alert("Berhasil Booking");
                        router.push(`/account/profile`);
                    } else {
                        setLoading(false);
                        alert("Gagal Booking");
                    }
                } else {
                    setLoading(false);
                    alert("Kamu sudah terdaftar di Asrama");
                }
            } else {
                alert("Tidak bisa daftar, semester anda lebih dari semester 3");
            }
        } else {
            const createPemesanan = await booking.addPemesanan(
                data,
                cookiesCert
            );
            if (createPemesanan.status === true) {
                setLoading(true);
                alert("Berhasil Booking");
                router.push(`/account/profile`);
                setLoading(false);
            }
        }
    };

    const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setTanggal(date);
    };

    const checkAvailability = async () => {
        let dataBooked: PemesananDTO[] = [];

        pemesanan.map((item) => {
            if (item.durasi > 1) {
                const dbDate = new Date(item.tanggal_pemesanan.split("T")[0]);
                for (let i = 0; i < item.durasi; i++) {
                    const temp = dbDate.setDate(dbDate.getDate() + 1);
                    const dayAfter = new Date(temp).toISOString().split("T")[0];

                    if (dayAfter === tanggal) {
                        dataBooked.push(item);
                    }
                }
            }
            if (
                item.tanggal_pemesanan.split("T")[0] === tanggal &&
                item.id_fasilitas === Number(id)
            ) {
                dataBooked.push(item);
            }
        });

        if (
            dataBooked.length > 0 &&
            dataBooked.filter((item) => item.status !== "Dibatalkan").length > 0
        ) {
            setIsAvailable(false);
        } else {
            setIsAvailable(true);
        }

        setDataBooked(dataBooked);
    };
    const isLoading = () => {
        setLoading(!loading);
    };

    return (
        <div className="">
            {isLogin ? (
                <div className="h-full bg-[#2C666E] relative">
                    {loading && (
                        <div className="absolute w-full h-full flex justify-center items-center z-50 backdrop-blur-sm">
                            <Loading />
                        </div>
                    )}
                    <Navbar
                        isLogin={isLogin}
                        nama={namaAccount}
                        isLoading={isLoading}
                    />

                    <div className="p-10 xl:px-28">
                        <div className=" flex flex-col rounded-[13px] xl:mb-5">
                            <h1 className="text-[14px] font-regular text-[#F0EDEE]">
                                Step 1 of 2
                            </h1>
                            <h1 className="text-[29px] font-bold text-[#F0EDEE]">
                                Form Sewa Fasilitas
                            </h1>
                        </div>
                        <div className="flex-col flex lg:gap-5 lg:flex-row-reverse">
                            <div className="  bg-[#FFFFFF] flex flex-wrap rounded-[15px] lg:bg-[#FFFFFF] xl:flex-col ">
                                <div className="p-7 flex flex-row lg:flex-col lg:items-center gap-3">
                                    {dataFasilitas && (
                                        <Image
                                            src={`https://api.ricogann.com/assets/${
                                                JSON.parse(
                                                    dataFasilitas.foto
                                                )[0]
                                            }`}
                                            alt="foto"
                                            width={100}
                                            height={100}
                                            className="hidden lg:block xl:w-full xl:h-[300px] rounded-[15px]"
                                        />
                                    )}
                                    <div className="flex flex-col md:mt-6 gap-3">
                                        <h2 className="text-[16px] md:text-[20px] font-bold text-[#0A090C] xl:text-[35px]">
                                            {dataFasilitas &&
                                                dataFasilitas.nama}
                                        </h2>
                                        <div className="flex items-start gap-2">
                                            <HiLocationMarker className="hidden md:block text-[#0A090C] xl:text-3xl" />
                                            <h2 className="text-[12px] md:text-[18px] text-[#0A090C] xl:w-[380px]">
                                                {dataFasilitas &&
                                                    dataFasilitas.alamat}
                                            </h2>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MdPayment className="text-[#0A090C] font-bold text-3xl" />
                                            <div className="flex flex-col">
                                                <h2 className="text-[12px] md:text-[12px] xl:text-[17px] text-[#0A090C]">
                                                    Mode Of Payment
                                                </h2>
                                                <h2 className="text-[12px] md:text-[12px] xl:text-[17px] text-[#0A090C]">
                                                    Virtual Account
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-2">
                                                <BiCalendar className="text-[#0A090C] font-bold text-3xl" />
                                                <div className="flex flex-col gap-2">
                                                    <h2 className="text-[12px] md:text-[12px] xl:text-[17px] text-[#0A090C]">
                                                        Cek Ketersediaan
                                                        Fasilitas
                                                    </h2>
                                                    <div className="flex flex-col items-start gap-5">
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="date"
                                                                className="border rounded-md px-2 py-1 w-[100px] text-[12px] xl:text-[15px] xl:h-[30px] xl:w-[150px] h-8 focus:outline-none focus:border-blue-500"
                                                                onChange={
                                                                    handleDate
                                                                }
                                                                min={
                                                                    new Date()
                                                                        .toISOString()
                                                                        .split(
                                                                            "T"
                                                                        )[0]
                                                                }
                                                                value={tanggal}
                                                            />
                                                            <button
                                                                className="bg-[#07393C] hover:bg-[#2C666E] text-[#F0EDEE] font-bold p-[4px] text-[12px] xl:text-[15px] w-14 h-8 xl:h-8 xl:w-24 rounded-lg"
                                                                onClick={
                                                                    checkAvailability
                                                                }
                                                            >
                                                                Check
                                                            </button>
                                                        </div>
                                                        <div className="">
                                                            {isAvailable ? (
                                                                <div className="flex text-[#0A090C] items-center gap-3">
                                                                    <div className="">
                                                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                                    </div>
                                                                    <h1>
                                                                        Available
                                                                    </h1>
                                                                </div>
                                                            ) : (
                                                                <div className="flex gap-3">
                                                                    <div className="text-[#0A090C] flex items-center gap-3">
                                                                        <div className="w-2 h-2 xl:w-3 xl:h-3 bg-red-500 rounded-full"></div>
                                                                        <h1 className="text-[15px] xl:text-[17px]">
                                                                            Booked
                                                                        </h1>
                                                                    </div>
                                                                    <div className="">
                                                                        {dataBooked.map(
                                                                            (
                                                                                item,
                                                                                index
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    className="text-[#0A090C] flex gap-3"
                                                                                >
                                                                                    <div
                                                                                        className={`text-[15px] xl:text-[17px] ${
                                                                                            item.status ===
                                                                                            "Dibatalkan"
                                                                                                ? "hidden"
                                                                                                : "flex gap-2"
                                                                                        }`}
                                                                                    >
                                                                                        <h1>
                                                                                            Oleh
                                                                                        </h1>
                                                                                        {item
                                                                                            .Account
                                                                                            .Mahasiswa[0]
                                                                                            ? item
                                                                                                  .Account
                                                                                                  .Mahasiswa[0]
                                                                                                  .nama
                                                                                            : item
                                                                                                  .Account
                                                                                                  .Umum[0]
                                                                                            ? item
                                                                                                  .Account
                                                                                                  .Umum[0]
                                                                                                  .nama
                                                                                            : item
                                                                                                  .Account
                                                                                                  .UKM[0]
                                                                                            ? item
                                                                                                  .Account
                                                                                                  .UKM[0]
                                                                                                  .nama_ukm
                                                                                            : item
                                                                                                  .Account
                                                                                                  .Organisasi[0]
                                                                                                  .nama_organisasi}
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col xl:gap-4 xl:p-7 lg:bg-[#FFFFFF] rounded-[15px] lg:flex-1 mt-5 xl:mt-0">
                                <h2 className="text-[12px] lg:text-[18px] mb-1 text-white md:text-[#0A090C] font-semibold ">
                                    Nama
                                </h2>
                                <div className="  bg-[#FFFFFF] flex items-center p-2 md:p-3 rounded-lg lg:bg-[#F7F8FA]  lg:flex-row ">
                                    <BsFillPersonFill className="text-[#0A090C] md:text-2xl" />
                                    <input
                                        name={`nama`}
                                        type="text"
                                        className="text-[12px] lg:text-[14px] ml-2 w-full p-1 text-[#0A090C] font-regular bg-[#fff] xl:bg-[#F7F8FA]"
                                        value={namaAccount}
                                        onChange={handleInput}
                                    />
                                </div>
                                <h2
                                    className={`${
                                        isAsrama ? "hidden" : "block"
                                    } text-[12px] lg:text-[18px] my-1 text-white md:text-[#0A090C] font-semibold`}
                                >
                                    Tanggal
                                </h2>
                                <div
                                    className={`${
                                        isAsrama ? "hidden" : "block"
                                    } bg-[#FFFFFF] flex items-center p-2 md:p-3 rounded-lg lg:bg-[#F7F8FA] lg:flex-row`}
                                >
                                    <BsFillCalendarFill className="text-[#0A090C] md:text-xl" />
                                    <input
                                        name={`tanggal`}
                                        type="date"
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        className="text-[12px] lg:text-[14px] ml-4 rounded bg-[#fff] xl:bg-[#F7F8FA] text-[#0A090C]"
                                        value={tanggal}
                                        onChange={handleInput}
                                    />
                                </div>
                                <div
                                    className={`${
                                        isAsrama ? "hidden" : "block"
                                    }`}
                                >
                                    <h2
                                        className={`text-[12px] lg:text-[18px] my-1 text-white md:text-[#0A090C] font-semibold`}
                                    >
                                        Lama Hari
                                    </h2>
                                    <div className="  bg-[#FFFFFF] flex items-center p-2 md:p-3 rounded-lg lg:bg-[#F7F8FA]  lg:flex-row ">
                                        <BiSolidTimer className="text-[#0A090C] md:text-2xl" />
                                        <input
                                            name={`durasi`}
                                            type="number"
                                            className="text-[12px] lg:text-[14px] ml-2 w-full p-1 text-[#0A090C] font-regular bg-[#fff] xl:bg-[#F7F8FA]"
                                            value={durasi}
                                            onChange={handleInput}
                                        />
                                    </div>
                                </div>
                                <div
                                    className={`${
                                        isAsrama ? "hidden" : "block"
                                    }`}
                                >
                                    <h2 className="text-[12px] lg:text-[18px] my-1 text-white md:text-[#0A090C] font-semibold ">
                                        Jam Checkin
                                    </h2>
                                    <div className="  bg-[#FFFFFF] flex items-center p-2 md:p-3 rounded-[15px] lg:bg-[#F7F8FA]  lg:flex-row ">
                                        <AiFillClockCircle className="text-[#0A090C] text-xl" />
                                        <input
                                            name="jam_checkin"
                                            type="time"
                                            className=" text-[12px] lg:text-[14px] ml-4 rounded text-[#0A090C] bg-[#fff] xl:bg-[#f7f8fa]"
                                            value={jam_checkin}
                                            onChange={handleInput}
                                        />
                                    </div>
                                </div>
                                <div
                                    className={`${
                                        isAsrama ? "hidden" : "block"
                                    }`}
                                >
                                    <h2 className="text-[12px] lg:text-[18px] my-1 text-white md:text-[#0A090C] font-semibold ">
                                        Jam Checkout
                                    </h2>
                                    <div className="  bg-[#FFFFFF] flex items-center p-2 md:p-3 rounded-[15px] lg:bg-[#F7F8FA]  lg:flex-row ">
                                        <AiFillClockCircle className="text-[#0A090C] text-xl" />
                                        <input
                                            name="jam_checkout"
                                            type="time"
                                            className=" text-[12px] lg:text-[14px] ml-4 rounded text-[#0A090C] bg-[#fff] xl:bg-[#f7f8fa]"
                                            value={jam_checkout}
                                            onChange={handleInput}
                                        />
                                    </div>
                                </div>
                                <div
                                    className={`${
                                        role !== "umum"
                                            ? isAsrama
                                                ? "block"
                                                : "hidden"
                                            : "block"
                                    }`}
                                >
                                    <h2
                                        className={`text-[12px] lg:text-[18px] my-1 text-[#0A090C] font-semibold `}
                                    >
                                        {isAsrama ? "Lantai" : "Tipe Harga"}
                                    </h2>
                                    <div
                                        className={`bg-[#FFFFFF] flex items-center p-2 md:p-3 rounded-[15px] lg:bg-[#F7F8FA] lg:flex-row `}
                                    >
                                        <AiFillClockCircle className="text-[#0A090C] text-xl" />
                                        <select
                                            name={`harga`}
                                            className=" text-[12px] lg:text-[14px] ml-4 rounded text-[#0A090C] font-semibold bg-[#fff] xl:bg-[#f7f8fa] w-full"
                                            onChange={handleHarga}
                                        >
                                            {dataHarga &&
                                                dataHarga.map(
                                                    (
                                                        harga: any,
                                                        index: number
                                                    ) => {
                                                        return (
                                                            <option
                                                                value={[
                                                                    harga.id,
                                                                    harga.harga,
                                                                ]}
                                                                key={index}
                                                            >
                                                                {harga.nama}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                        </select>
                                    </div>
                                </div>
                                <div
                                    className={`${
                                        role === "organisasi" && isWeekend
                                            ? "block"
                                            : "hidden"
                                    }`}
                                >
                                    <h2
                                        className={`text-[12px] lg:text-[18px] my-1 text-[#0A090C] font-semibold `}
                                    >
                                        {isAsrama ? "Lantai" : "Tipe Harga"}
                                    </h2>
                                    <div
                                        className={`bg-[#FFFFFF] flex items-center p-2 md:p-3 rounded-[15px] lg:bg-[#F7F8FA] lg:flex-row `}
                                    >
                                        <AiFillClockCircle className="text-[#0A090C] text-xl" />
                                        <select
                                            name={`harga`}
                                            className=" text-[12px] lg:text-[14px] ml-4 rounded text-[#0A090C] font-semibold bg-[#fff] xl:bg-[#f7f8fa] w-full"
                                            onChange={handleHarga}
                                        >
                                            {dataHarga &&
                                                dataHarga.map(
                                                    (
                                                        harga: any,
                                                        index: number
                                                    ) => {
                                                        return (
                                                            <option
                                                                value={[
                                                                    harga.id,
                                                                    harga.harga,
                                                                ]}
                                                                key={index}
                                                            >
                                                                {harga.nama}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                        </select>
                                    </div>
                                </div>
                                <h2
                                    className={`${
                                        role !== "umum"
                                            ? isAsrama
                                                ? "block"
                                                : "hidden"
                                            : "block"
                                    } text-[12px] lg:text-[18px] my-1 text-white md:text-[#0A090C] font-semibold `}
                                >
                                    Biaya
                                </h2>
                                <h2
                                    className={`${
                                        role === "organisasi" && isWeekend
                                            ? "block"
                                            : "hidden"
                                    } text-[12px] lg:text-[18px] my-1 text-white md:text-[#0A090C] font-semibold `}
                                >
                                    Biaya
                                </h2>
                                <div
                                    className={`${
                                        role !== "umum"
                                            ? isAsrama
                                                ? "block"
                                                : "hidden"
                                            : "block"
                                    } bg-[#FFFFFF] flex items-center p-2 rounded-[15px] lg:bg-[#F7F8FA]  lg:flex-row`}
                                >
                                    <FaDollarSign className="text-[#0A090C] text-xl" />
                                    <input
                                        type="text"
                                        className={`${
                                            isAsrama ? "block" : "hidden"
                                        } text-[12px] lg:text-[14px] ml-4 rounded text-[#0A090C] bg-[#fff] xl:bg-[#f7f8fa]`}
                                        readOnly
                                        value={`Rp${(harga * 2 + 250000)
                                            .toString()
                                            .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                "."
                                            )}`}
                                    />
                                    <input
                                        type="text"
                                        className={`${
                                            isAsrama ? "hidden" : "block"
                                        } text-[12px] lg:text-[14px] ml-4 rounded text-[#0A090C] bg-[#fff] xl:bg-[#f7f8fa]`}
                                        readOnly
                                        value={`Rp${(
                                            harga *
                                            (setDurasiBooking() / 60) *
                                            durasi
                                        )
                                            .toString()
                                            .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                "."
                                            )}`}
                                    />
                                </div>
                                <div
                                    className={`${
                                        role === "organisasi" && isWeekend
                                            ? "block"
                                            : "hidden"
                                    } bg-[#FFFFFF] flex items-center p-2 rounded-[15px] lg:bg-[#F7F8FA]  lg:flex-row`}
                                >
                                    <FaDollarSign className="text-[#0A090C] text-xl" />
                                    <input
                                        type="text"
                                        className={`${
                                            isAsrama ? "block" : "hidden"
                                        } text-[12px] lg:text-[14px] ml-4 rounded text-[#0A090C] bg-[#fff] xl:bg-[#f7f8fa]`}
                                        readOnly
                                        value={`Rp${(harga * 2 + 250000)
                                            .toString()
                                            .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                "."
                                            )}`}
                                    />
                                    <input
                                        type="text"
                                        className={`${
                                            isAsrama ? "hidden" : "block"
                                        } text-[12px] lg:text-[14px] ml-4 rounded text-[#0A090C] bg-[#fff] xl:bg-[#f7f8fa]`}
                                        readOnly
                                        value={`Rp${(
                                            harga *
                                            (setDurasiBooking() / 60) *
                                            durasi
                                        )
                                            .toString()
                                            .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                "."
                                            )}`}
                                    />
                                </div>
                                <h2 className="text-[12px] lg:text-[18px] my-1 text-white md:text-[#0A090C] font-semibold ">
                                    No. Telp
                                </h2>
                                <div className="  bg-[#FFFFFF] flex items-center p-2 md:p-3 rounded-[15px] lg:bg-[#F7F8FA]  lg:flex-row ">
                                    <BiSolidPhoneCall className="text-[#0A090C] text-xl" />
                                    <input
                                        type="number"
                                        className="text-[12px] lg:text-[14px] ml-4 text-[#0A090C] bg-[#fff] xl:bg-[#f7f8fa] rounded"
                                        value={noTelpAccount}
                                        onChange={handleInput}
                                    />
                                </div>
                                <h2 className="text-[12px] lg:text-[18px] my-1 text-white md:text-[#0A090C] font-semibold ">
                                    Keterangan
                                </h2>
                                <div className="  bg-[#FFFFFF] flex items-center p-2 rounded-[15px] lg:bg-[#F7F8FA]  lg:flex-row ">
                                    <BiSolidPencil className="text-[#0A090C]" />
                                    <textarea
                                        name="keterangan"
                                        className="text-[12px] lg:text-[12px] ml-2 text-[#0A090C] bg-[#fff] xl:bg-[#f7f8fa] rounded w-full h-full"
                                        placeholder="Saya meminjam fasilitas ini untuk..."
                                        value={keterangan}
                                        onChange={handleTextarea}
                                    />
                                </div>
                                <p className="">
                                    Dengan Melakukan Transaksi Maka Anda telah
                                    menyetujui semua kesepakatan. Untuk
                                    informasi lebih lanjut, silakan kunjungi{" "}
                                    {dataFasilitas && (
                                        <a
                                            className="text-[#FFA500]"
                                            href={`https://api.ricogann.com/assets/${JSON.parse(
                                                dataFasilitas.termservice
                                            )}`}
                                            target="_blank"
                                        >
                                            halaman kebijakan kami
                                        </a>
                                    )}
                                </p>
                                <h1
                                    className={`${
                                        statusBook === true ? "hidden" : "block"
                                    } ${
                                        isAsrama ? "hidden" : "block"
                                    } text-red-500 mt-4 md:mt-0`}
                                >
                                    {bookMessage}
                                </h1>

                                <button
                                    className={`${
                                        statusBook === true
                                            ? "block"
                                            : isAsrama
                                            ? "block"
                                            : "bg-gray-600"
                                    }  bg-[#07393C] hover:bg-[#2C666E] text-[#F0EDEE] font-bold py-2 px-4 rounded-lg mt-7`}
                                    onClick={handleBooking}
                                    disabled={
                                        statusBook === false
                                            ? isAsrama
                                                ? false
                                                : true
                                            : false
                                    }
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            ) : (
                <div className="w-full h-screen flex justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            )}
        </div>
    );
}
