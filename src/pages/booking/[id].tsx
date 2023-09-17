import { Navbar } from "@/components/navbar";
import { BsFillPersonFill, BsFillCalendarFill } from "react-icons/bs";
import { useState, useEffect, useCallback } from "react";
import useSwr from "swr";

import { FaDollarSign } from "react-icons/fa";
import { BiSolidPhoneCall } from "react-icons/bi";
import { HiLocationMarker } from "react-icons/hi";
import { AiFillClockCircle } from "react-icons/ai";
import Image from "next/image";
import { useRouter } from "next/router";

interface Fasilitas {
    id_fasilitas: number;
    nama: string;
    deskripsi: string;
    alamat: string;
    foto: string;
    jam_buka: string;
    jam_tutup: string;
    durasi: number;
}

interface Account {
    id_account: number;
    nama: string;
    no_telp: string;
    npm: string;
    role: string;
    status: boolean;
}

interface Cookies {
    CERT: string;
}

interface Booking {
    id_fasilitas: number;
    id_harga: number;
    id_account: number;
    tanggal_pemesanan: string;
    jam_checkin: string;
    jam_checkout: string;
    durasi: number;
    total_harga: number;
    status: string;
}

export default function Booking() {
    const router = useRouter();
    const { id } = router.query;
    const [isLogin, setIsLogin] = useState(true);
    const [dataHarga, setDataHarga] = useState<any>([]);

    //data booking
    const [idAccount, setIdAccount] = useState<number>(0);
    const [idHarga, setIdHarga] = useState<number>(0);
    const [namaAccount, setNamaAccount] = useState<string>("");
    const [tanggal, setTanggal] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [jam_checkin, setJamCheckin] = useState<string>("09:00");
    const [jam_checkout, setJamCheckout] = useState<string>("22:00");
    const [harga, setHarga] = useState<number>(0);
    const [noTelpAccount, setNoTelpAccount] = useState<string>("");
    const [durasi, setDurasi] = useState<number>(0);
    const [totalHarga, setTotalHarga] = useState<number>(0);

    //auth check
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
        if (cookies.CERT === undefined) {
            setIsLogin(false);
            router.push("/auth/login");
        } else {
            setAccount(cookiesGet as Cookies);
        }
    }, []);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === "nama") {
            setNamaAccount(e.target.value);
        } else if (e.target.name === "tanggal") {
            setTanggal(e.target.value);
        } else if (e.target.name === "jam_checkin") {
            setJamCheckin(e.target.value);
        } else if (e.target.name === "jam_checkout") {
            setJamCheckout(e.target.value);
        } else if (e.target.name === "harga") {
            setHarga(parseInt(e.target.value));
        } else if (e.target.name === "no_telp") {
            setNoTelpAccount(e.target.value);
        }
    };

    const handleHarga = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setIdHarga(parseInt(e.target.value.split(",")[0]));
        setHarga(parseInt(e.target.value.split(",")[1]));
    };

    const fetcher = async (url: string): Promise<any> => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    };

    const { data, error, isLoading } = useSwr(
        id ? `https://api.ricogann.com/api/fasilitas/${id}` : null,
        fetcher
    );

    async function getHarga() {
        const response = await fetch(
            `https://api.ricogann.com/api/harga/${id}`
        );
        const result = await response.json();
        return result.data;
    }

    useEffect(() => {
        async function getHarga(id: string) {
            if (id !== undefined) {
                const response = await fetch(
                    `https://api.ricogann.com/api/harga/${id}`
                );
                const result = await response.json();

                if (result.data.length > 0) {
                    setDataHarga(result.data);
                    setIdHarga(result.data[0].id);
                    setHarga(result.data[0].harga);
                }
            }
        }

        if (id) {
            getHarga(id as string);
        }
    }, [id]);

    const parseJwt = (token: Cookies) => {
        try {
            return JSON.parse(atob(token.CERT.split(".")[1]));
        } catch (e) {
            return null;
        }
    };

    const timeStringToMinutes = (timeString: string) => {
        const [hours, minutes] = timeString.split(/[:.]/).map(Number);
        return hours * 60 + minutes;
    };

    const setDurasiBooking = () => {
        const checkin: number = timeStringToMinutes(jam_checkin);
        const checkout: number = timeStringToMinutes(jam_checkout);

        return checkout - checkin;
    };

    const setAccount = (cookies: Cookies) => {
        setIdAccount(parseJwt(cookies).id_account);
        setNamaAccount(parseJwt(cookies).nama);
        setNoTelpAccount(parseJwt(cookies).no_telp);
    };

    const handleBooking = async () => {
        const data: Booking = {
            id_fasilitas: Number(id),
            id_harga: idHarga,
            id_account: idAccount,
            tanggal_pemesanan: tanggal,
            jam_checkin: jam_checkin,
            jam_checkout: jam_checkout,
            total_harga: harga * (setDurasiBooking() / 60),
            durasi: setDurasiBooking(),
            status: "Menunggu Pembayaran",
        };

        if (data.durasi % 60 !== 0) {
            alert("Durasi harus kelipatan 60 menit");
            return;
        }

        const response = await fetch(
            `https://api.ricogann.com/api/booking/add`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();

        if (result.status === true) {
            router.push(`/booking/pembayaran/${result.data.id_pemesanan}`);
        }
    };

    console.log(dataHarga);

    return (
        <div className="">
            {isLogin ? (
                <div className="h-full bg-[#F7F8FA]">
                    <Navbar isLogin={isLogin} />

                    <div className="p-10 xl:px-28">
                        <div className=" flex flex-col rounded-[13px] xl:mb-5">
                            <h1 className="text-[14px] font-regular text-[#7F8FA4]">
                                Step 1 of 2
                            </h1>
                            <h1 className="text-[29px] font-semibold text-[#11141A]">
                                Form Sewa Fasilitas
                            </h1>
                        </div>
                        <div className="flex-col flex lg:gap-5 lg:flex-row-reverse">
                            <div className="  bg-[#FFFFFF] flex flex-wrap rounded-[15px] lg:bg-[#FFFFFF] xl:flex-col ">
                                <div className="p-7 flex flex-row lg:flex-col lg:items-center gap-3">
                                    {data && (
                                        <Image
                                            src={`https://api.ricogann.com/assets/${
                                                JSON.parse(data.data.foto)[0]
                                            }`}
                                            alt="foto"
                                            width={100}
                                            height={100}
                                            className="xl:w-full xl:h-[300px] rounded-[15px]"
                                        />
                                    )}
                                    <div className="flex flex-col lg:items-center">
                                        <h2 className="text-[16px] md:text-[20px] font-semibold text-black xl:text-[35px]">
                                            {data && data.data.nama}
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <HiLocationMarker className="hidden md:block text-black xl:text-2xl" />
                                            <h2 className="text-[10px] md:text-[14px] mt-2 text-black xl:w-[380px]">
                                                {data && data.data.alamat}
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col xl:gap-4 xl:p-7 lg:bg-[#FFFFFF] rounded-[15px] lg:flex-1 mt-5 xl:mt-0">
                                <h2 className="text-[12px] lg:text-[12px] font-semibold ">
                                    Nama
                                </h2>
                                <div className="  bg-[#FFFFFF] flex items-center p-2 rounded-lg lg:bg-[#F7F8FA]  lg:flex-row ">
                                    <BsFillPersonFill className="text-black" />
                                    <input
                                        name={`nama`}
                                        type="text"
                                        className="text-[10px] lg:text-[12px] ml-2 w-full p-1 text-black font-semibold bg-[#fff] xl:bg-[#F7F8FA]"
                                        value={namaAccount}
                                        onChange={handleInput}
                                    />
                                </div>
                                <h2 className="text-[12px] lg:text-[12px] font-semibold ">
                                    Tanggal
                                </h2>
                                <div className="  bg-[#FFFFFF] flex items-center p-2 rounded-lg lg:bg-[#F7F8FA]  lg:flex-row ">
                                    <BsFillCalendarFill className="text-black" />
                                    <input
                                        name={`tanggal`}
                                        type="date"
                                        className="text-[10px] lg:text-[12px] ml-2 rounded bg-[#fff] xl:bg-[#F7F8FA] text-black"
                                        value={tanggal}
                                        onChange={handleInput}
                                    />
                                </div>
                                <h2 className="text-[12px] lg:text-[12px] font-semibold ">
                                    Jam Checkin
                                </h2>
                                <div className="  bg-[#FFFFFF] flex items-center p-2 rounded-[15px] lg:bg-[#F7F8FA]  lg:flex-row ">
                                    <AiFillClockCircle className="text-black" />
                                    <input
                                        name="jam_checkin"
                                        type="time"
                                        className=" text-[10px] lg:text-[12px] ml-2 rounded text-black font-semibold bg-[#fff] xl:bg-[#f7f8fa]"
                                        value={jam_checkin}
                                        onChange={handleInput}
                                    />
                                </div>
                                <h2 className="text-[12px] lg:text-[12px] font-semibold ">
                                    Jam Checkout
                                </h2>
                                <div className="  bg-[#FFFFFF] flex items-center p-2 rounded-[15px] lg:bg-[#F7F8FA]  lg:flex-row ">
                                    <AiFillClockCircle className="text-black" />
                                    <input
                                        name="jam_checkout"
                                        type="time"
                                        className=" text-[10px] lg:text-[12px] ml-2 rounded text-black font-semibold bg-[#fff] xl:bg-[#f7f8fa]"
                                        value={jam_checkout}
                                        onChange={handleInput}
                                    />
                                </div>
                                <h2 className="text-[12px] lg:text-[12px] font-semibold ">
                                    Tipe Harga
                                </h2>
                                <div className="  bg-[#FFFFFF] flex items-center p-2 rounded-[15px] lg:bg-[#F7F8FA]  lg:flex-row ">
                                    <AiFillClockCircle className="text-black" />
                                    <select
                                        name={`harga`}
                                        className=" text-[10px] lg:text-[12px] ml-2 rounded text-black font-semibold bg-[#fff] xl:bg-[#f7f8fa] w-full"
                                        onChange={handleHarga}
                                    >
                                        {dataHarga &&
                                            dataHarga.map(
                                                (harga: any, index: number) => {
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
                                <h2 className="text-[12px] lg:text-[12px] font-semibold ">
                                    Biaya
                                </h2>
                                <div className="  bg-[#FFFFFF] flex items-center p-2 rounded-[15px] lg:bg-[#F7F8FA]  lg:flex-row ">
                                    <FaDollarSign className="text-black" />
                                    <input
                                        type="text"
                                        className=" text-[10px] lg:text-[12px] ml-2 rounded text-black font-semibold bg-[#fff] xl:bg-[#f7f8fa]"
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
                                <h2 className="text-[12px] lg:text-[12px] font-semibold ">
                                    No. Telp
                                </h2>
                                <div className="  bg-[#FFFFFF] flex items-center p-2 rounded-[15px] lg:bg-[#F7F8FA]  lg:flex-row ">
                                    <BiSolidPhoneCall className="text-black" />
                                    <input
                                        type="number"
                                        className="text-[10px] lg:text-[12px] ml-2 text-black bg-[#fff] xl:bg-[#f7f8fa] rounded"
                                        value={noTelpAccount}
                                        onChange={handleInput}
                                    />
                                </div>

                                <div className="mt-5 bg-[#FFFFFF] flex flex-wrap rounded-[15px] lg:bg-[#F7F8FA]  lg:flex-row ">
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
                                </div>
                                <button
                                    className=" bg-[#322A7D] hover:bg-[#00FF66] text-white font-bold py-2 px-4 rounded-lg mt-7"
                                    onClick={handleBooking}
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
