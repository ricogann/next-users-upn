import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { FaSquareInstagram } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { AiOutlineMail } from "react-icons/ai";
import { TbWorldWww } from "react-icons/tb";
import _misc from "@/services/misc.service";

interface misc {
    logo_instansi: number;
    no_hp: string;
    email: number;
    instagram: string;
    laman_web: string;
}

export default function Footer() {
    const router = useRouter();
    const misc = new _misc();
    const [dataMisc, setDataMisc] = useState<misc>();
    const Menus = [
        {
            title: `${dataMisc?.instagram}`,
            src: FaSquareInstagram,
            link: "https://instagram.com/bpU",
        },
        {
            title: `${dataMisc?.laman_web}`,
            src: TbWorldWww,
            link: "/",
        },
        {
            title: `${dataMisc?.no_hp}`,
            src: IoCall,
            link: "/",
        },
        {
            title: `${dataMisc?.email}`,
            src: AiOutlineMail,
            link: "/",
        },
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
        <nav className="bg-[rgb(240,237,238)] shadow-xl lg:p-3">
            <div className="text-[#0A090C] font-semibold font-montserrat w-full px-6 py-4 md:px-8">
                <div className="flex justify-center px-6 gap-2 lg:gap-10">
                    {Menus.map((menu, index) => (
                        <div
                            className="flex flex-row items-center lg:gap-2"
                            key={index}
                        >
                            <menu.src className="text-[30px] text-black" />
                            <h1
                                className={`hidden lg:block text-[15px] text-black`}
                            >
                                {menu.title}
                            </h1>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Menu (Hidden on Large Screens) */}
        </nav>
    );
}
