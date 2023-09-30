import Image from "next/image";
import { useState, useEffect } from "react";

import { Navbar } from "@/components/navbar";

import { BsFillPersonFill, BsFillCalendarFill } from "react-icons/bs";
import { FaDollarSign } from "react-icons/fa";
import { BiSolidPhoneCall, BiSolidPencil, BiCalendar } from "react-icons/bi";
import { HiLocationMarker } from "react-icons/hi";
import { AiFillClockCircle } from "react-icons/ai";
import { MdPayment } from "react-icons/md";
import { useRouter } from "next/router";

import _serviceBooking from "@/services/booking.service";
import _serviceFasilitas from "@/services/fasilitas.service";

import _libCookies from "@/lib/cookies";
import _libBooking from "@/lib/booking";

import BookingDTO from "@/interfaces/bookingDTO";
import CookiesDTO from "@/interfaces/cookiesDTO";
import PemesananDTO from "@/interfaces/pemesananDTO";
import AccountDTO from "@/interfaces/accountDTO";
import FasilitasDTO from "@/interfaces/fasilitasDTO";
import { error } from "console";

export default function Booking() {
    const router = useRouter();
    const fasilitas = new _serviceFasilitas("https://api.ricogann.com");
    const libCookies = new _libCookies();
    const libBooking = new _libBooking();

    const [isLogin, setIsLogin] = useState(true);
    const [dataHarga, setDataHarga] = useState<any>([]);
    const [dataFasilitas, setDataFasilitas] = useState<FasilitasDTO>();
    const [isAvailable, setIsAvailable] = useState(true);
    const [pemesanan, setPemesanan] = useState<PemesananDTO[]>([]);
    const [date, setDate] = useState("");
    const [id, setId] = useState("");

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

    const [statusBook, setStatusBook] = useState<boolean>(true);
    const [bookMessage, setBookMessage] = useState<string>("");
    const [isAsrama, setIsAsrama] = useState<boolean>(false);

    const jamToNumber = (jam: string) => {
        const convertJam = jam.split(":").join("");
        return parseInt(convertJam);
    };

    useEffect(() => {
        const tanggalFiltered = pemesanan.filter(
            (item) =>
                item.tanggal_pemesanan.split("T")[0] === tanggal &&
                jam_checkin >= item.jam_checkin &&
                jam_checkin <= item.jam_checkout
        );

        if (tanggalFiltered.length > 0 || jam_checkout <= jam_checkin) {
            setStatusBook(false);
            setBookMessage("Pemilihan jam tidak tersedia");
        } else {
            setStatusBook(true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jam_checkin, jam_checkout]);

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
        }
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

            const dataBooking = await libBooking.getPemesanan(Number(id));
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
                : harga * (setDurasiBooking() / 60),
            durasi: setDurasiBooking(),
            keterangan: keterangan,
            status: "Menunggu Pembayaran",
        };

        if (isAsrama) {
            const addMahasiswaToKamar = await libBooking.addMahasiswaToKamar(
                idHarga,
                idAccount
            );

            if (addMahasiswaToKamar !== undefined) {
                const createPemesanan = await libBooking.addPemesanan(data);
                if (createPemesanan.status === true) {
                    alert("Berhasil Booking");
                    router.push(
                        `/booking/pembayaran/${createPemesanan.data.id_pemesanan}`
                    );
                } else {
                    alert("Gagal Booking");
                }
            } else {
                alert("Kamu sudah terdaftar di Asrama");
            }
        } else {
            const createPemesanan = await libBooking.addPemesanan(data);
            if (createPemesanan.status === true) {
                alert("Berhasil Booking");
                router.push(
                    `/booking/pembayaran/${createPemesanan.data.id_pemesanan}`
                );
            }
        }
    };

    const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setDate(date);
    };

    const checkAvailability = async () => {
        let dataBooked: PemesananDTO[] = [];

        pemesanan.map((item) => {
            if (
                item.tanggal_pemesanan.split("T")[0] === date &&
                item.id_fasilitas === Number(id)
            ) {
                dataBooked.push(item);
            }
        });

        if (dataBooked.length > 0) {
            setIsAvailable(false);
        } else {
            setIsAvailable(true);
        }

        setDataBooked(dataBooked);
    };

    console.log(dataFasilitas);

    return (
        <div className="">
            {isLogin ? (
                <div className="h-screen md:h-full bg-[#F7F8FA]">
                    <Navbar isLogin={isLogin} nama={namaAccount} />

                    <div className="p-10 xl:px-28">
                        <div className=" flex flex-col rounded-[13px] xl:mb-5">
                            <h1 className="text-[14px] font-regular text-[#7F8FA4]">
                                Step 1 of 2
                            </h1>
                            <h1 className="text-[29px] font-bold text-[#11141A]">
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
                                            className="xl:w-full xl:h-[300px] rounded-[15px]"
                                        />
                                    )}
                                    <div className="flex flex-col md:mt-6 gap-3">
                                        <h2 className="text-[16px] md:text-[20px] font-bold text-black xl:text-[35px]">
                                            {dataFasilitas &&
                                                dataFasilitas.nama}
                                        </h2>
                                        <div className="flex items-start gap-2">
                                            <HiLocationMarker className="hidden md:block text-black xl:text-3xl" />
                                            <h2 className="text-[10px] md:text-[18px] mt-2 md:mt-0 text-black xl:w-[380px]">
                                                {dataFasilitas &&
                                                    dataFasilitas.alamat}
                                            </h2>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MdPayment className="text-black font-bold text-3xl" />
                                            <div className="flex flex-col">
                                                <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black">
                                                    Mode Of Payment
                                                </h2>
                                                <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black">
                                                    Virtual Account
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-2">
                                                <BiCalendar className="text-black font-bold text-3xl" />
                                                <div className="flex flex-col gap-2">
                                                    <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black">
                                                        Cek Ketersediaan
                                                        Fasilitas
                                                    </h2>
                                                    <div className="flex flex-col md:flex-row items-start gap-5">
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="date"
                                                                className="border rounded-md px-2 py-1 w-[100px] text-[10px] xl:text-[15px] h-[20px] xl:h-[30px] xl:w-[150px] focus:outline-none focus:border-blue-500"
                                                                onChange={
                                                                    handleDate
                                                                }
                                                            />
                                                            <button
                                                                className="bg-[#322A7D] hover:bg-[#00FF66] text-white font-bold p-[4px] text-[12px] xl:text-[15px] xl:w-24 rounded-lg"
                                                                onClick={
                                                                    checkAvailability
                                                                }
                                                            >
                                                                Check
                                                            </button>
                                                        </div>
                                                        <div className="">
                                                            {isAvailable ? (
                                                                <div className="flex text-black items-center gap-3">
                                                                    <div className="">
                                                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                                    </div>
                                                                    <h1>
                                                                        Available
                                                                    </h1>
                                                                </div>
                                                            ) : (
                                                                <div className="">
                                                                    <div className="text-black flex items-center gap-3">
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
                                                                                    className="text-black flex gap-3"
                                                                                >
                                                                                    <h1 className="text-[15px] xl:text-[17px]">
                                                                                        {index +
                                                                                            1}

                                                                                        .
                                                                                    </h1>
                                                                                    <div className="text-[15px] xl:text-[17px]">
                                                                                        {
                                                                                            item.jam_checkin
                                                                                        }
                                                                                    </div>
                                                                                    <div className="text-[15px] xl:text-[17px]">
                                                                                        to
                                                                                    </div>
                                                                                    <div className="text-[15px] xl:text-[17px]">
                                                                                        {
                                                                                            item.jam_checkout
                                                                                        }
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
                                <h2 className="text-[12px] lg:text-[18px] text-black font-semibold ">
                                    Nama
                                </h2>
                                <div className="  bg-[#FFFFFF] flex items-center p-2 md:p-3 rounded-lg lg:bg-[#F7F8FA]  lg:flex-row ">
                                    <BsFillPersonFill className="text-black md:text-2xl" />
                                    <input
                                        name={`nama`}
                                        type="text"
                                        className="text-[10px] lg:text-[14px] ml-2 w-full p-1 text-black font-regular bg-[#fff] xl:bg-[#F7F8FA]"
                                        value={namaAccount}
                                        onChange={handleInput}
                                    />
                                </div>
                                <h2
                                    className={`${
                                        isAsrama ? "hidden" : "block"
                                    } text-[12px] lg:text-[18px] text-black font-semibold`}
                                >
                                    Tanggal
                                </h2>
                                <div
                                    className={`${
                                        isAsrama ? "hidden" : "block"
                                    } bg-[#FFFFFF] flex items-center p-2 md:p-3 rounded-lg lg:bg-[#F7F8FA] lg:flex-row`}
                                >
                                    <BsFillCalendarFill className="text-black md:text-xl" />
                                    <input
                                        name={`tanggal`}
                                        type="date"
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        className="text-[10px] lg:text-[14px] ml-4 rounded bg-[#fff] xl:bg-[#F7F8FA] text-black"
                                        value={tanggal}
                                        onChange={handleInput}
                                    />
                                </div>
                                <div
                                    className={`${
                                        isAsrama ? "hidden" : "block"
                                    }`}
                                >
                                    <h2 className="text-[12px] lg:text-[18px] text-black font-semibold ">
                                        Jam Checkin
                                    </h2>
                                    <div className="  bg-[#FFFFFF] flex items-center p-2 md:p-3 rounded-[15px] lg:bg-[#F7F8FA]  lg:flex-row ">
                                        <AiFillClockCircle className="text-black text-xl" />
                                        <input
                                            name="jam_checkin"
                                            type="time"
                                            className=" text-[10px] lg:text-[14px] ml-4 rounded text-black bg-[#fff] xl:bg-[#f7f8fa]"
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
                                    <h2 className="text-[12px] lg:text-[18px] text-black font-semibold ">
                                        Jam Checkout
                                    </h2>
                                    <div className="  bg-[#FFFFFF] flex items-center p-2 md:p-3 rounded-[15px] lg:bg-[#F7F8FA]  lg:flex-row ">
                                        <AiFillClockCircle className="text-black text-xl" />
                                        <input
                                            name="jam_checkout"
                                            type="time"
                                            className=" text-[10px] lg:text-[14px] ml-4 rounded text-black bg-[#fff] xl:bg-[#f7f8fa]"
                                            value={jam_checkout}
                                            onChange={handleInput}
                                        />
                                    </div>
                                </div>
                                <div
                                    className={`${
                                        isAsrama && role !== "umum"
                                            ? "block"
                                            : "hidden"
                                    }`}
                                >
                                    <h2
                                        className={`text-[12px] lg:text-[18px] text-black font-semibold`}
                                    >
                                        {isAsrama ? "Lantai" : "Tipe Harga"}
                                    </h2>
                                    <div
                                        className={`bg-[#FFFFFF] flex items-center p-2 md:p-3 rounded-[15px] lg:bg-[#F7F8FA] lg:flex-row `}
                                    >
                                        <AiFillClockCircle className="text-black text-xl" />
                                        <select
                                            name={`harga`}
                                            className=" text-[10px] lg:text-[14px] ml-4 rounded text-black font-semibold bg-[#fff] xl:bg-[#f7f8fa] w-full"
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
                                            : "hidden"
                                    } text-[12px] lg:text-[18px] text-black font-semibold `}
                                >
                                    Biaya
                                </h2>
                                <div
                                    className={`${
                                        role !== "umum"
                                            ? isAsrama
                                                ? "block"
                                                : "hidden"
                                            : "hidden"
                                    } bg-[#FFFFFF] flex items-center p-2 rounded-[15px] lg:bg-[#F7F8FA]  lg:flex-row`}
                                >
                                    <FaDollarSign className="text-black text-xl" />
                                    <input
                                        type="text"
                                        className={`${
                                            isAsrama ? "block" : "hidden"
                                        } text-[10px] lg:text-[14px] ml-4 rounded text-black bg-[#fff] xl:bg-[#f7f8fa]`}
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
                                        } text-[10px] lg:text-[14px] ml-4 rounded text-black bg-[#fff] xl:bg-[#f7f8fa]`}
                                        readOnly
                                        value={`Rp${(
                                            harga *
                                            (setDurasiBooking() / 60)
                                        )
                                            .toString()
                                            .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                "."
                                            )}`}
                                    />
                                </div>
                                <h2 className="text-[12px] lg:text-[18px] text-black font-semibold ">
                                    No. Telp
                                </h2>
                                <div className="  bg-[#FFFFFF] flex items-center p-2 md:p-3 rounded-[15px] lg:bg-[#F7F8FA]  lg:flex-row ">
                                    <BiSolidPhoneCall className="text-black text-xl" />
                                    <input
                                        type="number"
                                        className="text-[10px] lg:text-[14px] ml-4 text-black bg-[#fff] xl:bg-[#f7f8fa] rounded"
                                        value={noTelpAccount}
                                        onChange={handleInput}
                                    />
                                </div>
                                <h2 className="text-[12px] lg:text-[18px] text-black font-semibold ">
                                    Keterangan
                                </h2>
                                <div className="  bg-[#FFFFFF] flex items-center p-2 rounded-[15px] lg:bg-[#F7F8FA]  lg:flex-row ">
                                    <BiSolidPencil className="text-black" />
                                    <textarea
                                        name="keterangan"
                                        className="text-[10px] lg:text-[12px] ml-2 text-black bg-[#fff] xl:bg-[#f7f8fa] rounded w-full h-full"
                                        placeholder="Saya meminjam fasilitas ini untuk..."
                                        value={keterangan}
                                        onChange={handleTextarea}
                                    />
                                </div>

                                {/* <div className="mt-5 bg-[#FFFFFF] flex flex-wrap rounded-[15px] lg:bg-[#F7F8FA]  lg:flex-row ">
                                    <div className="p-3 flex flex-row ">
                                        <input
                                            type="checkbox"
                                            className="ml-2"
                                        />
                                        <h2 className="text-[10px] lg:text-[12px] ml-5">
                                            Menyetujui Persyaratan Sewa Asrama.{" "}
                                            <br />
                                            <a
                                                className="font-[#2400FF]"
                                                href=""
                                            >
                                                Lembar Persyaratan.
                                            </a>
                                        </h2>
                                    </div>
                                </div> */}
                                <h1
                                    className={`${
                                        statusBook === true ? "hidden" : "block"
                                    } ${
                                        isAsrama ? "hidden" : "block"
                                    } text-red-500`}
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
                                    }  bg-[#322A7D] hover:bg-[#00FF66] text-white font-bold py-2 px-4 rounded-lg mt-7`}
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
                </div>
            ) : (
                <div className="w-full h-screen flex justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            )}
        </div>
    );
}
