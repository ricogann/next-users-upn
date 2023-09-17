import { useState, useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { BsFillPinMapFill } from "react-icons/bs";
import { MdOutlineWatchLater, MdPayment } from "react-icons/md";
import { useRouter } from "next/router";

interface Fasilitas {
    id_fasilitas: number;
    nama: string;
    deskripsi: string;
    alamat: string;
    foto: string;
    jam_buka: string;
    jam_tutup: string;
    bukaHari: string;
    durasi: number;
}

interface Cookies {
    CERT?: string;
}

export default function Home() {
    const router = useRouter();

    const [isLogin, setIsLogin] = useState(true);
    const [cookies, setCookies] = useState<Cookies>({});

    useEffect(() => {
        const cookies: Cookies = document.cookie.split(";").reduce((res, c) => {
            const [key, val] = c.trim().split("=");
            try {
                return Object.assign(res, { [key]: JSON.parse(val) });
            } catch (e) {
                return Object.assign(res, { [key]: val });
            }
        }, {});

        setCookies(cookies);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [dataFasilitas, setDataFasilitas] = useState<Fasilitas[][]>([]);
    const [dataFotoFasilitas, setDataFotoFasilitas] = useState<string[][]>([]);
    const [dataInfo, setInfo] = useState<string[]>([]);

    async function getDataFasilitas() {
        try {
            const res = await fetch("https://api.ricogann.com/api/fasilitas");
            const data = await res.json();

            return data;
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getDataFasilitas();

                const dataFoto: string[][] = [];
                let group: Array<string> = [];

                for (let i = 0; i < data.data.length; i++) {
                    group.push(data.data[i]);

                    if (group.length === 4 || i === data.data.length - 1) {
                        dataFoto.push(group);
                        group = [];
                    }
                }

                const dataFasilitas: Fasilitas[][] = [];
                let groupFasilitas: Array<Fasilitas> = [];

                for (let i = 0; i < data.data.length; i++) {
                    groupFasilitas.push(data.data[i]);

                    if (
                        groupFasilitas.length === 4 ||
                        i === data.data.length - 1
                    ) {
                        dataFasilitas.push(groupFasilitas);
                        groupFasilitas = [];
                    }
                }

                setInfo(dataFasilitas[0][0] as any);
                setDataFotoFasilitas(dataFoto);
                setDataFasilitas(dataFasilitas);
            } catch (error) {
                console.error("error fetching data fasilitas ", error);
            }
        }

        fetchData();
    }, []);

    const handleFoto = (data: Fasilitas) => {
        const dataFoto = JSON.parse(data.foto);

        const dataInfo = [
            String(data.id_fasilitas),
            data.nama,
            data.deskripsi,
            data.alamat,
            data.jam_buka,
            data.jam_tutup,
            data.bukaHari,
        ];

        setDataFotoFasilitas(dataFoto);
        setInfo(dataInfo);
    };

    const handleBook = () => {
        if (dataInfo.length === 0) {
            router.push(`/booking/${dataFasilitas[0][0].id_fasilitas}`);
        } else {
            router.push(`/booking/${dataInfo[0]}`);
        }
    };

    return (
        <div className="bg-[#F7F8FA] h-screen md:h-full">
            <Navbar isLogin={isLogin} />
            <div className="p-10 xl:mx-24">
                <div className="carousel carousel-center md:hidden">
                    {dataFasilitas.map((data, index) => {
                        return (
                            <div
                                className="carousel-item grid grid-cols-2 gap-3 mx-5"
                                key={index}
                            >
                                {data.map((data, index) => {
                                    return (
                                        <div
                                            className=""
                                            key={index}
                                            onClick={() => handleFoto(data)}
                                        >
                                            <Image
                                                src={`https://api.ricogann.com/assets/${
                                                    JSON.parse(data.foto)[0]
                                                }`}
                                                width={150}
                                                height={150}
                                                alt="asrama"
                                                className="rounded-[13px] w-[150px] h-[150px]"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

                {/* Tab & Desktop */}
                <div className="hidden md:flex carousel w-full">
                    {dataFasilitas.map((data, index) => {
                        return (
                            <div
                                id={`slide${index}`}
                                className="carousel-item relative w-full grid grid-cols-3 grid-row-2 gap-4"
                                key={index}
                            >
                                {data.map((data, index) => {
                                    return index === 0 ? (
                                        <div
                                            className="row-span-2 cursor-pointer"
                                            onClick={() => handleFoto(data)}
                                            key={index}
                                        >
                                            <Image
                                                src={`https://api.ricogann.com/assets/${
                                                    JSON.parse(data.foto)[0]
                                                }`}
                                                alt="asrama"
                                                className="h-full"
                                                width={500}
                                                height={500}
                                            />
                                        </div>
                                    ) : index === 2 ? (
                                        <div
                                            className="row-span-2 cursor-pointer"
                                            onClick={() => handleFoto(data)}
                                            key={index}
                                        >
                                            <Image
                                                src={`https://api.ricogann.com/assets/${
                                                    JSON.parse(data.foto)[0]
                                                }`}
                                                alt="asrama"
                                                className="h-full"
                                                width={500}
                                                height={500}
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => handleFoto(data)}
                                            key={index}
                                        >
                                            <Image
                                                src={`https://api.ricogann.com/assets/${
                                                    JSON.parse(data.foto)[0]
                                                }`}
                                                alt="asrama"
                                                width={500}
                                                height={500}
                                            />
                                        </div>
                                    );
                                })}
                                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                                    <a
                                        href={`#slide${index - 1}`}
                                        className={`btn btn-circle ${
                                            index === 0 ? "invisible" : ""
                                        } cursor-pointer`}
                                    >
                                        ❮
                                    </a>
                                    <a
                                        href={`#slide${index + 1}`}
                                        className={`btn btn-circle ${
                                            index === dataFasilitas.length - 1
                                                ? "invisible"
                                                : ""
                                        } cursor-pointer`}
                                    >
                                        ❯
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={`mt-5 bg-[#FFFFFF] rounded-[13px] border`}>
                    <div className="px-5 py-5 lg:px-14 lg:py-14 lg:flex-row">
                        {/* Content here */}
                        <div className="p-2 md:p-3 xl:p-0">
                            <h1 className="font-bold md:text-[25px] xl:text-[35px] text-black">
                                {dataInfo[1] === undefined
                                    ? dataFasilitas.length > 0
                                        ? dataFasilitas[0][0].nama
                                        : ""
                                    : dataInfo[1]}
                            </h1>

                            <div className="mt-6">
                                <div className="flex gap-5 mt-3">
                                    <BsFillPinMapFill className="text-black font-bold text-2xl" />
                                    <div className="flex flex-col">
                                        <h2 className="text-[8px] md:text-[12px] xl:text-[17px] text-black">
                                            {dataInfo[3] === undefined
                                                ? dataFasilitas.length > 0
                                                    ? dataFasilitas[0][0].alamat
                                                    : ""
                                                : dataInfo[3]}
                                            <a href="">Get directions</a>
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex gap-5 mt-3">
                                    <MdOutlineWatchLater className="text-black font-bold text-2xl" />
                                    <div className="flex flex-col">
                                        <h2 className="text-[8px] md:text-[12px] xl:text-[17px] text-black">
                                            Senin - Kamis
                                        </h2>
                                        <h2 className="text-[8px] md:text-[12px] xl:text-[17px] text-black">
                                            {dataInfo[4] === undefined
                                                ? dataFasilitas.length > 0
                                                    ? dataFasilitas[0][0]
                                                          .jam_buka
                                                    : ""
                                                : dataInfo[4]}{" "}
                                            -{" "}
                                            {dataInfo[5] === undefined
                                                ? dataFasilitas.length > 0
                                                    ? dataFasilitas[0][0]
                                                          .jam_tutup
                                                    : ""
                                                : dataInfo[5]}
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex gap-5 mt-3">
                                    <MdPayment className="text-black font-bold text-2xl" />
                                    <div className="flex flex-col">
                                        <h2 className="text-[8px] md:text-[12px] xl:text-[17px] text-black">
                                            Mode Of Payment
                                        </h2>
                                        <h2 className="text-[8px] md:text-[12px] xl:text-[17px] text-black">
                                            Virtual Account
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-5">
                                <button
                                    className="w-24 bg-[#F7F8FA] hover:bg-[#00FF66] text-semibold font-bold py-2 px-2 text-black border-black border-[2px] text-[12px] xl:text-[17px] xl:w-32 rounded-lg mx-2 "
                                    onClick={() =>
                                        router.push(
                                            `/detail/${
                                                dataInfo[0] === undefined
                                                    ? dataFasilitas.length > 0
                                                        ? dataFasilitas[0][0]
                                                              .id_fasilitas
                                                        : ""
                                                    : dataInfo[0]
                                            }`
                                        )
                                    }
                                >
                                    More Info
                                </button>
                                <button
                                    className="w-24 bg-[#322A7D] hover:bg-[#00FF66] text-white font-bold py-2 px-2 text-[12px] xl:text-[17px] xl:w-32 rounded-lg mx-2"
                                    onClick={handleBook}
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Of content */}
            </div>
        </div>
    );
}
