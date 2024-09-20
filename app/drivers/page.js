"use client";

import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { Home } from "lucide-react";

const DriversPage = () => {
    const [drivers, setDrivers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await fetch('https://ergast.com/api/f1/current/drivers.json');
                const data = await response.json();
                const driversData = data.MRData.DriverTable.Drivers;

                const driversWithImages = driversData.map(driver => ({
                    ...driver,
                    imageUrl: `/drivers/${driver.permanentNumber}.jpg`
                }));

                setDrivers(driversWithImages);
            } catch (error) {
                console.error('Error fetching drivers:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDrivers();
    }, []);

    useEffect(() => {
        if (!isLoading && containerRef.current) {
            const logoElement = containerRef.current.querySelector('.logo');
            const titleElement = containerRef.current.querySelector('.title');
            const cardElements = containerRef.current.querySelectorAll('.driver-card');

            gsap.set([logoElement, titleElement, ...cardElements], { opacity: 0, y: 50 });

            const tl = gsap.timeline();

            tl.to([logoElement, titleElement], {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "back.out(1.7)",
                stagger: 0.2
            });

            tl.to(cardElements, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            }, "-=0.5");
        }
    }, [isLoading]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="bg-gray-900 min-h-screen p-8 font-[family-name:var(--font-geist-sans)] text-white">
            <header className="text-center mb-12">
                <a href="/" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                    <Home size={24} />
                </a>
                <div className="logo mb-4">
                    <img src="/F1TPLogo.png" alt="F1 Dashboard Logo" className="mx-auto w-40" />
                </div>
                <h1 className="title text-3xl font-bold">F1 Drivers</h1>
            </header>

            <main className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
                {drivers.map((driver) => (
                    <div key={driver.driverId} className="driver-card relative overflow-hidden rounded-lg shadow-lg aspect-[3/4]">
                        <div
                            className="absolute inset-0 bg-cover bg-center z-0"
                            style={{ backgroundImage: `url(${driver.imageUrl})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
                        <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                            <h2 className="text-xl font-bold">{`${driver.givenName} ${driver.familyName}`}</h2>
                            <p className="text-sm opacity-80">{driver.nationality}</p>
                            <p className="mt-2 text-sm">Number: {driver.permanentNumber}</p>
                        </div>
                    </div>
                ))}
            </main>
            <footer className="mt-16 text-center">
                <a href="/" className="text-blue-400 hover:underline">
                    Back to Home
                </a>
            </footer>
        </div>
    );
};

export default DriversPage;