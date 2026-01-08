import { useEffect, useState } from "react";

export default function CountdownTimer({ targetDate }) {
    const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            if (!targetDate) {
                setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            setTime({ days, hours, minutes, seconds });
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const blocks = [
        { value: time.days, label: "Days" },
        { value: time.hours, label: "Hours" },
        { value: time.minutes, label: "Mins" },
        { value: time.seconds, label: "Secs" },
    ];

    return (
        <div className="flex items-center gap-3">
            {blocks.map((b, i) => (
                <div
                    key={i}
                    className="bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4 flex flex-col items-center"
                >
                    <div className="text-primary text-lg font-montserrat leading-7 uppercase">
                        {String(b.value).padStart(2, "0")}
                    </div>
                    <div className="text-primary text-xs font-montserrat leading-7 uppercase">{b.label}</div>
                </div>
            ))}
        </div>
    );
}
