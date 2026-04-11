import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
    return (
        <div className="bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen">
            {/* Hero Section */}
            <section className="flex items-center justify-center px-6 py-20">
                <div className="max-w-4xl text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white"
                    >
                        Explore the World with <span className="text-indigo-600">Ease & Joy</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mt-6 text-lg text-gray-600 dark:text-gray-300"
                    >
                        Our tour management app helps you discover amazing destinations,
                        plan trips effortlessly, and create unforgettable memories ✈️🌍
                    </motion.p>

                    <div className="mt-8 flex justify-center gap-4">
                        <Button className="rounded-2xl px-6 py-3 text-lg">Start Your Journey</Button>
                        <Button variant="outline" className="rounded-2xl px-6 py-3 text-lg">
                            Learn More
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-6 py-16 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                {[
                    {
                        title: "Smart Planning",
                        desc: "Organize your trips with intelligent scheduling and recommendations.",
                        emoji: "🧭",
                    },
                    {
                        title: "Best Deals",
                        desc: "Find the best travel packages at affordable prices.",
                        emoji: "💸",
                    },
                    {
                        title: "24/7 Support",
                        desc: "We’re always here to help you during your journey.",
                        emoji: "📞",
                    },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                    >
                        <Card className="rounded-2xl shadow-md hover:shadow-xl transition">
                            <CardContent className="p-6 text-center">
                                <div className="text-4xl">{item.emoji}</div>
                                <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300">
                                    {item.desc}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </section>

            {/* About Story */}
            <section className="px-6 py-20 bg-white dark:bg-gray-900">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Our Story 💙
                    </h2>
                    <p className="mt-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                        We started with a simple idea — make travel planning fun, easy, and
                        stress-free. Whether you're exploring nearby gems or international
                        destinations, our platform is designed to guide you every step of
                        the way.
                    </p>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 py-20 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Ready to Start Your Adventure?
                    </h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                        Join thousands of happy travelers using our platform.
                    </p>

                    <Button className="mt-6 rounded-2xl px-8 py-4 text-lg">
                        Get Started Now 🚀
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default About;