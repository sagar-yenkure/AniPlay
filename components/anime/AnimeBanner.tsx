import Image from "next/image";
import { motion } from "framer-motion";

interface AnimeBannerProps {
    anime: any;
}

const AnimeBanner = ({ anime }: AnimeBannerProps) => {
    const title = anime.title.english || anime.title.romaji || "Unknown Title";

    return (
        <>
            {anime.bannerImage && (
                <motion.div
                    className="relative h-[200px] w-full md:h-[300px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Image
                        src={anime.bannerImage}
                        alt={title}
                        fill
                        priority
                        className="object-cover object-center"
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)",
                        }}
                    />
                </motion.div>
            )}
        </>
    );
};

export default AnimeBanner;