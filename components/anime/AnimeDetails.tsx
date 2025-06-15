import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface AnimeDetailsProps {
    anime: any;
}

const AnimeDetails = ({ anime }: AnimeDetailsProps) => {
    const title = anime.title.english || anime.title.romaji || "Unknown Title";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
        >
            <div className="space-y-2">
                <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">{title}</h1>
                {anime.title.native && (
                    <p className="text-lg text-muted-foreground">{anime.title.native}</p>
                )}
            </div>

            {anime.genres && (
                <div className="flex flex-wrap gap-2">
                    {anime.genres.map((genre: string) => (
                        <Badge key={genre} variant="secondary">
                            {genre}
                        </Badge>
                    ))}
                </div>
            )}

            {anime.description && (
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Synopsis</h2>
                    <p
                        className="text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: anime.description }}
                    ></p>
                </div>
            )}

            {anime.trailer && anime.trailer.site === "youtube" && (
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold">Trailer</h2>
                    <div className="overflow-hidden rounded-lg border aspect-video">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${anime.trailer.id}`}
                            title={`${title} Trailer`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            {anime.characters?.nodes?.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Main Characters</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {anime.characters.nodes.map((character: any) => (
                            <motion.div
                                key={character.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center"
                            >
                                <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                                    <Image
                                        src={character.image.large || "/placeholder.png"}
                                        alt={character.name.full}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="mt-2 text-center">
                                    <p className="line-clamp-1 font-medium">{character.name.full}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {anime.tags && anime.tags.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                        {anime.tags
                            .sort((a: any, b: any) => b.rank - a.rank)
                            .slice(0, 12)
                            .map((tag: any) => (
                                <Badge key={tag.id} variant="outline" className="text-xs">
                                    {tag.name}
                                </Badge>
                            ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default AnimeDetails;