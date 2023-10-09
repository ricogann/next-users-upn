import Image from "next/image";
import logo_bpu from "../../public/images/logo-bpu.png";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { RxHamburgerMenu } from "react-icons/rx";
import { BsPersonCircle } from "react-icons/bs";
import _misc from "@/services/misc.service";

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
                        <div className="flex flex-row gap-5">
                            <div className="flex flex-col gap-5">
                                <h1 className="">{dataMisc?.laman_web} </h1>
                                <h1 className="">{dataMisc?.instagram}</h1>
                            </div>
                            <div className="flex flex-col gap-5">
                                <h1 className="">{dataMisc?.no_hp} </h1>
                                <h1 className="">{dataMisc?.email}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Hidden on Large Screens) */}
        </nav>
    );
};

export { Footer };
