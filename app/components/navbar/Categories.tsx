'use client';

import { IoCarSport, IoCarSportSharp } from "react-icons/io5";
import { IoIosCar } from "react-icons/io";
import { FaTruckPickup, FaShuttleVan } from "react-icons/fa";
import { GiF1Car, GiRaceCar } from "react-icons/gi";
import { PiCarProfileFill } from "react-icons/pi";
import { MdElectricCar } from "react-icons/md";
import { FaCarOn } from "react-icons/fa6";


import Container from "../Container";
import CategoryBox from "../CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";

export const categories = [
    {
    label: 'Cars',
    icon: IoIosCar,
    description: 'Your everyday vehicle that gets the job done'
    },
    {
    label: 'Trucks',
    icon: FaTruckPickup,
    description: 'For the jobsite or your jetski'
    },
    {
    label: 'Minivans & Vans',
    icon: FaShuttleVan,
    description: 'The people mover or furniture mover'
    },
    {
    label: 'Exotic & Luxury',
    icon: GiF1Car,
    description: 'The upper echelon of automotive excellence'
    },
    {
    label: 'Classics',
    icon: GiRaceCar,
    description: 'A blast from the past'
    },
    {
    label: 'SUVs',
    icon: PiCarProfileFill,
    description: 'For anything life throws at you'
    },
    {
    label: 'Sport',
    icon: IoCarSport,
    description: 'The backroads are calling your name'
    },
    {
    label: 'Electric',
    icon: MdElectricCar,
    description: 'For the environmentally conscious'
    },
    {
    label: 'Convertible',
    icon: FaCarOn,
    description: 'Drop the top, grab some sunscreen, and hop in'
    },
    
]

const Categories  = () => {
    const params = useSearchParams();
    const category = params?.get('category');
    const pathname = usePathname();
    const isMainPage = pathname === "/";

if(!isMainPage) {
    return null;
}

    return (
        <Container>
            <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
                {categories.map((item) => (
                    <CategoryBox 
                        key={item.label}
                        label={item.label}
                        icon={item.icon}
                        selected={category === item.label}
                    />
                ))}
            </div>
        </Container>
    );
}

export default Categories;