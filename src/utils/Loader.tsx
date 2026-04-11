import { motion } from "framer-motion";

const Loader = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950" >
            <div className="flex flex-col items-center gap-6" >
                {/* Animated Spinner */}
                < motion.div
                    className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }
                    }
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />

                {/* Animated Text */}
                <motion.h2
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-lg font-semibold text-gray-700 dark:text-gray-300"
                >
                    Preparing your journey... ✈️
                </motion.h2>

                {/* Dots Animation */}
                <div className="flex gap-2" >
                    {
                        [0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                className="w-3 h-3 bg-indigo-500 rounded-full"
                                animate={{ y: [0, -8, 0] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 0.6,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Loader;