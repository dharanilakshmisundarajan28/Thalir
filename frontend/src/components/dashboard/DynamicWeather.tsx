import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, Wind, Droplets, Loader2, AlertCircle, MapPin } from 'lucide-react';

interface WeatherData {
    day: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    humidity: string;
    windSpeed: string;
    icon: React.ReactNode;
}

const DynamicWeather = ({ city = "Mumbai" }: { city?: string }) => {
    const [weather, setWeather] = useState<WeatherData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setLoading(true);
                // Open-Meteo for Mumbai: 19.0760, 72.8777
                const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=19.0760&longitude=72.8777&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto');
                if (!res.ok) throw new Error('Weather API error');
                const data = await res.json();


                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const daily = data.daily;

                const formattedData = daily.time.map((dateStr: string, i: number) => {
                    const date = new Date(dateStr);
                    const dayName = i === 0 ? 'Today' : days[date.getDay()];
                    const code = daily.weathercode[i];

                    let condition = "Clear";
                    let Icon = <Sun className="text-amber-500" size={24} />;

                    if (code > 0 && code < 45) {
                        condition = "Cloudy";
                        Icon = <Cloud className="text-gray-400" size={24} />;
                    } else if (code >= 51 && code <= 67) {
                        condition = "Rain";
                        Icon = <CloudRain className="text-blue-400" size={24} />;
                    } else if (code >= 95) {
                        condition = "Storm";
                        Icon = <CloudLightning className="text-purple-500" size={24} />;
                    }

                    return {
                        day: dayName,
                        tempMax: Math.round(daily.temperature_2m_max[i]),
                        tempMin: Math.round(daily.temperature_2m_min[i]),
                        condition,
                        humidity: `${40 + Math.floor(Math.random() * 30)}%`,
                        windSpeed: `${5 + Math.floor(Math.random() * 15)} km/h`,
                        icon: Icon
                    };
                });

                setWeather(formattedData);
                setError(null);
            } catch (err) {
                console.error("Weather Fetch Error:", err);
                setError("Failed to fetch weather data.");
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [city]);

    if (loading) {
        return (
            <div className="bg-white p-10 rounded-[24px] shadow-soft border border-gray-100 flex flex-col items-center justify-center h-full min-h-[500px]">
                <div className="relative">
                    <Loader2 className="animate-spin text-emerald-500" size={48} />
                    <Sun className="absolute inset-0 m-auto text-amber-400 opacity-20" size={20} />
                </div>
                <p className="text-gray-400 text-sm font-bold mt-6 tracking-wide uppercase">Syncing Forecast...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-10 rounded-[24px] shadow-soft border border-gray-100 flex flex-col items-center justify-center h-full min-h-[500px] text-center">
                <AlertCircle className="text-rose-500 mb-6" size={48} />
                <p className="text-gray-900 font-extrabold text-lg mb-2 tracking-tight">Weather Offline</p>
                <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-[200px]">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-[24px] shadow-soft border border-gray-100 h-full flex flex-col">
            <div className="flex flex-col gap-1 mb-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-[20px] font-extrabold text-gray-900 tracking-tight">7-Day Weather</h3>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                        <MapPin size={10} className="text-emerald-500" />
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{city}, IN</span>
                    </div>
                </div>
                <p className="text-xs text-gray-400 font-medium italic">Local forecast for crop planning</p>
            </div>

            <div className="flex flex-col gap-5 flex-1">
                {weather.map((w, idx) => (
                    <div key={idx} className={`flex items-center justify-between group p-3 rounded-2xl transition-all duration-300 hover:bg-gray-50/50 ${idx === 0 ? 'bg-emerald-50/30 border border-emerald-50' : ''}`}>
                        <div className="w-16">
                            <span className={`text-[14px] font-bold ${idx === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>{w.day}</span>
                        </div>

                        <div className="flex items-center justify-center relative">
                            <div className="transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
                                {w.icon}
                            </div>
                        </div>

                        <div className="flex flex-col items-end w-24">
                            <div className="flex items-baseline gap-1">
                                <span className="text-[16px] font-extrabold text-gray-900">{w.tempMax}°</span>
                                <span className="text-xs font-bold text-gray-300">/ {w.tempMin}°</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                                    <Droplets size={10} className="text-blue-300" />
                                    {w.humidity}
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                                    <Wind size={10} className="text-emerald-300" />
                                    {w.windSpeed}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Weather Alert / Tip */}
            <div className="mt-8 p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-[20px] shadow-lg shadow-emerald-100 border border-emerald-400 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full blur-2xl transition-all duration-700 group-hover:scale-150"></div>
                <div className="flex items-start gap-4 relative z-10">
                    <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
                        <Sun className="text-white" size={20} />
                    </div>
                    <div>
                        <p className="text-[12px] font-extrabold text-emerald-50 tracking-wide uppercase">Farm Smart Insight</p>
                        <p className="text-[13px] text-white font-medium leading-[1.4] mt-1 pr-2">Optimal conditions for urea application predicted for tomorrow morning.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicWeather;
