import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-gray-950 px-6">
            <div className="max-w-xl text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl"
                >
                    🚫
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 text-4xl font-bold text-gray-900 dark:text-white"
                >
                    Access Denied
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 text-gray-600 dark:text-gray-300"
                >
                    Oops! You don’t have permission to view this page. Please contact
                    admin or go back to a safe place.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 flex justify-center gap-4"
                >
                    <Button
                        className="rounded-2xl px-6 py-3"
                        onClick={() => navigate("/")}
                    >
                        Go Home 🏠
                    </Button>

                    <Button
                        variant="outline"
                        className="rounded-2xl px-6 py-3"
                        onClick={() => navigate(-1)}
                    >
                        Go Back ⬅️
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};

export default Unauthorized;