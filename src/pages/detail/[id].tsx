import Image from "next/image";
import { useState } from "react";
import picture_asrama from "../../../public/images/fasilitas_asrama.jpg";
import picture_kantin from "../../../public/images/fasilitas_kantin.jpg";
import picture_tennis from "../../../public/images/fasilitas_tennis.jpg";
import picture_giriloka from "../../../public/images/fasilitas_giriloka.jpg";
import { Navbar } from "@/components/navbar";
import { BsFillPinMapFill } from "react-icons/bs";
import { MdOutlineWatchLater, MdPayment } from "react-icons/md";
import { BiCalendar, BiBookmark } from "react-icons/bi";
import { FaDollarSign } from "react-icons/fa";

export default function DetailFasilitas() {
    const [isLogin, setIsLogin] = useState(true);
    return (
        <div className="bg-[#F7F8FA]">
            <Navbar isLogin={isLogin} />
            <div className="p-10 xl:mx-24">
                <div className="carousel carousel-center md:hidden">
                    <div className="carousel-item grid grid-cols-2 gap-3 mx-5">
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            className="rounded-xl w-[150px] h-[150px]"
                        />
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            className="rounded-xl w-[150px] h-[150px]"
                        />
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            className="rounded-xl w-[150px] h-[150px]"
                        />
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            className="rounded-xl w-[150px] h-[150px]"
                        />
                    </div>
                    <div className="carousel-item grid grid-cols-2 gap-2">
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            className="rounded-xl w-[150px] h-[150px]"
                        />
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            className="rounded-xl w-[150px] h-[150px]"
                        />
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            className="rounded-xl w-[150px] h-[150px]"
                        />
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            className="rounded-xl w-[150px] h-[150px]"
                        />
                    </div>
                </div>

                {/* Tab & Desktop */}
                <div className="hidden md:flex carousel w-full">
                    <div
                        id="slide1"
                        className="carousel-item relative w-full grid grid-cols-3 grid-row-2 gap-4"
                    >
                        <div className="row-span-2">
                            <Image
                                src={picture_kantin}
                                alt="asrama"
                                className="h-full"
                            />
                        </div>
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            width={500}
                            height={500}
                        />
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            width={500}
                            height={500}
                        />
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            width={500}
                            height={500}
                        />
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            width={500}
                            height={500}
                        />
                        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a href="#slide4" className="btn btn-circle">
                                ❮
                            </a>
                            <a href="#slide2" className="btn btn-circle">
                                ❯
                            </a>
                        </div>
                    </div>
                    <div id="slide2" className="carousel-item relative w-full">
                        <Image
                            src={picture_kantin}
                            alt="asrama"
                            width={100}
                            height={100}
                        />
                        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a href="#slide1" className="btn btn-circle">
                                ❮
                            </a>
                            <a href="#slide3" className="btn btn-circle">
                                ❯
                            </a>
                        </div>
                    </div>
                    <div id="slide3" className="carousel-item relative w-full">
                        <Image
                            src={picture_giriloka}
                            alt="asrama"
                            width={100}
                            height={100}
                        />
                        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a href="#slide2" className="btn btn-circle">
                                ❮
                            </a>
                            <a href="#slide4" className="btn btn-circle">
                                ❯
                            </a>
                        </div>
                    </div>
                    <div id="slide4" className="carousel-item relative w-full">
                        <Image
                            src={picture_tennis}
                            alt="asrama"
                            width={100}
                            height={100}
                        />
                        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a href="#slide3" className="btn btn-circle">
                                ❮
                            </a>
                            <a href="#slide1" className="btn btn-circle">
                                ❯
                            </a>
                        </div>
                    </div>
                </div>

                <div className={`mt-5 bg-[#FFFFFF] rounded-[13px] border`}>
                    <div className="px-5 py-5 lg:px-14 lg:py-14 lg:flex-row">
                        {/* Content here */}
                        <div className="p-2 md:p-3 xl:p-0">
                            <h1 className="font-bold md:text-[25px] xl:text-[35px] text-black">
                                Giri Loka
                            </h1>

                            <div className="flex flex-col gap-2 mt-6">
                                <div className="flex gap-5 mt-3">
                                    <BsFillPinMapFill className="text-black font-bold text-2xl" />
                                    <div className="flex flex-col">
                                        <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black">
                                            Jl. Rungkut Madya No.1, Gn. Anyar,
                                            Kec. Gn. Anyar, Surabaya,
                                            <br /> Jawa Timur 60294{" "}
                                            <a href="">Get directions</a>
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex gap-5 mt-3">
                                    <MdOutlineWatchLater className="text-black font-bold text-2xl" />
                                    <div className="flex flex-col">
                                        <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black">
                                            Senin - Kamis
                                        </h2>
                                        <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black">
                                            10:00 am - 07:30 pm
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 mt-3">
                                    <BiBookmark className="text-black font-bold text-2xl" />

                                    <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black w-[180px] md:w-1/2">
                                        Lorem Ipsum is simply dummy text of the
                                        printing and typesetting industry. Lorem
                                        Ipsum has been the industry standard
                                        dummy text ever since the 1500s, when an
                                        unknown printer took a galley of type
                                        and scrambled it to make a type specimen
                                        book.
                                    </h2>
                                </div>
                                <div className="flex items-center gap-5 mt-3">
                                    <FaDollarSign className="text-black font-bold text-2xl" />

                                    <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black">
                                        Rp3.000.000
                                    </h2>
                                </div>
                                <div className="flex gap-5 mt-3">
                                    <MdPayment className="text-black font-bold text-2xl" />
                                    <div className="flex flex-col">
                                        <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black">
                                            Mode Of Payment
                                        </h2>
                                        <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black">
                                            Virtual Account
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex gap-5 mt-3">
                                    <BiCalendar className="text-black font-bold text-2xl" />
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-[10px] md:text-[12px] xl:text-[17px] text-black">
                                            Cek Ketersediaan Fasilitas
                                        </h2>
                                        <input
                                            type="date"
                                            className="border rounded-md px-2 py-1 w-[100px] text-[10px] xl:text-[15px] h-[20px] xl:h-[30px] xl:w-[150px] focus:outline-none focus:border-blue-500"
                                        />
                                        <div className=" gap-2 mt-2">
                                            <div className="hidden text-black items-center gap-3">
                                                <div className="">
                                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                </div>
                                                <h1>Available</h1>
                                            </div>
                                            <div className="">
                                                <div className="text-black flex items-center gap-3">
                                                    <div className="w-2 h-2 xl:w-3 xl:h-3 bg-red-500 rounded-full"></div>
                                                    <h1 className="text-[15px] xl:text-[17px]">
                                                        Booked
                                                    </h1>
                                                </div>
                                                <div className="text-black flex gap-3">
                                                    <h1 className="text-[15px] xl:text-[17px]">
                                                        1.
                                                    </h1>
                                                    <div className="text-[15px] xl:text-[17px]">
                                                        09.00
                                                    </div>
                                                    <div className="text-[15px] xl:text-[17px]">
                                                        to
                                                    </div>
                                                    <div className="text-[15px] xl:text-[17px]">
                                                        13.00
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-5">
                                <button className="w-24 bg-[#F7F8FA] hover:bg-[#00FF66] text-semibold font-bold py-2 px-2 text-black border-black border-[2px] text-[12px] xl:text-[17px] xl:w-32 rounded-lg mx-2 ">
                                    More Info
                                </button>
                                <button className="w-24 bg-[#322A7D] hover:bg-[#00FF66] text-white font-bold py-2 px-2 text-[12px] xl:text-[17px] xl:w-32 rounded-lg mx-2">
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
