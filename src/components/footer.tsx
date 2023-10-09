import Image from "next/image";
import logo_bpu from "../../public/images/logo-bpu.png";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { RxHamburgerMenu } from "react-icons/rx";
import { BsPersonCircle } from "react-icons/bs";
import {FaSquareInstagram} from "react-icons/fa6";
import {IoCall} from "react-icons/io5";
import {AiOutlineMail} from "react-icons/ai";
import {TbWorldWww} from "react-icons/tb";
import _misc from "@/services/misc.service";
import { data } from "autoprefixer";

interface misc {
    logo_instansi: number;
    no_hp: string;
    email: number;
    instagram: string;
    laman_web: string;

}

const Footer = ({
}) => {
    const router = useRouter();
    const misc = new _misc();
    const [dataMisc, setDataMisc] = useState<misc>();
     const Menus = [
        {
            title: `${dataMisc?.instagram}`,src: FaSquareInstagram,link:"https://instagram.com/bpU",
        },
        {
            title: `${dataMisc?.laman_web}`,src: TbWorldWww,link:"/",
        },
        {
            title: `${dataMisc?.no_hp}`,src: IoCall ,link:"/",
        },
        {
            title: `${dataMisc?.email}`,src: AiOutlineMail,link:"/",
        }
    ];

     useEffect(() => {
        async function fetchData() {
            try {
                const dataMisc = await misc.getDataMisc();

                setDataMisc(dataMisc.data);
            } catch (error) {
                console.error("error fetching data fasilitas ", error);
            }
        }
        fetchData();
    });

    return (
        <nav className="bg-[#F0EDEE] shadow-xl">
            <div className=" container mx-auto flex justify-between items-center">
                <div className="flex h-[120px] items-center justify-between w-full px-6 py-3 md:px-8">
                    <div className=" md:gap-14 text-[#0A090C] font-semibold font-montserrat">
                        <div className="flex flex-row gap-14 ">
                        {Menus.map((menu, index) => (
                        
                                <div className="flex flex-row items-center justify-between gap-5">
                                    <menu.src className="text-[30px] text-black" />
                                <h1
                                className={`origin-left duration-200 text-[15px] text-black`}
                                >
                                {menu.title}
                                </h1>
                                </div>
                        ))}
                         </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Hidden on Large Screens) */}
        </nav>
    );
};

export { Footer };
