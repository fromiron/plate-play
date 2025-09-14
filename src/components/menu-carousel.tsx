"use client";

import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type ImageType = {
	id: string;
	src: string;
	alt: string;
	title: string;
};
const MenuCarousel = () => {
	const images: ImageType[] = [
		{
			id: "1",
			src: "https://picsum.photos/200",
			alt: "Illustrations by ©AarzooAly",
			title: "Menu1",
		},
		{
			id: "2",
			src: "https://picsum.photos/200",
			alt: "Illustrations by ©AarzooAly",
			title: "Menu2",
		},
		{
			id: "3",
			src: "https://picsum.photos/200",
			alt: "Illustrations by ©AarzooAly",
			title: "Menu3",
		},
		{
			id: "4",
			src: "https://picsum.photos/200",
			alt: "Illustrations by ©AarzooAly",
			title: "Menu4",
		},
		{
			id: "5",
			src: "https://picsum.photos/200",
			alt: "Illustrations by ©AarzooAly",
			title: "Menu5",
		},
		{
			id: "6",
			src: "https://picsum.photos/200",
			alt: "Illustrations by ©AarzooAly",
			title: "Menu6",
		},
	];
	return (
		<div className="mb-4 flex items-center justify-center rounded-2xl bg-gray-100">
			<MotionCarousel
				images={images}
				className=""
				loop={true}
				showNavigation={true}
				showPagination={true}
			/>
		</div>
	);
};

interface MotionCarouselProps {
	images: ImageType[];
	className?: string;
	autoplay?: boolean;
	loop?: boolean;
	showNavigation?: boolean;
	showPagination?: boolean;
}

const MotionCarousel = ({
	images,
	className,
	autoplay = false,
	loop = true,
	showNavigation = true,
	showPagination = true,
}: MotionCarouselProps) => {
	const [api, setCarouselApi] = useState<CarouselApi | null>(null);
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		if (!api) return;

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap());
		});
	}, [api]);

	return (
		<Carousel
			setApi={(instance) => setCarouselApi(instance)}
			className={cn("w-full", className)}
			opts={{
				loop,
				slidesToScroll: 1,
			}}
			plugins={
				autoplay
					? [
							Autoplay({
								delay: 2000,
								stopOnInteraction: true,
								stopOnMouseEnter: true,
							}),
						]
					: []
			}
		>
			<CarouselContent className="mt-4 flex h-[400px] w-full">
				{images.map((img, index) => (
					<CarouselItem
						key={img.id}
						className="relative flex h-[84%] w-full basis-[50%] items-center justify-center sm:basis-[50%] md:basis-[30%] lg:basis-[25%] xl:basis-[21%]"
					>
						<motion.div
							initial={false}
							animate={{
								clipPath:
									current !== index
										? "inset(15% 0 15% 0 round 2rem)"
										: "inset(0 0 0 0 round 2rem)",
							}}
							className="h-full w-full cursor-pointer overflow-hidden rounded-3xl"
							tabIndex={0}
							aria-label={`Go to slide ${index + 1}`}
							aria-current={current === index}
							onClick={() => api?.scrollTo(index)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									api?.scrollTo(index);
								}
							}}
						>
							<div className="relative h-full w-full border">
								<Image
									src={img.src}
									alt={img.alt}
									fill
									className="h-full w-full scale-105 object-cover"
								/>
							</div>
						</motion.div>
						<AnimatePresence mode="wait">
							{current === index && (
								<motion.div
									key={`caption-${img.id}`}
									initial={{ opacity: 0, filter: "blur(10px)" }}
									animate={{ opacity: 1, filter: "blur(0px)" }}
									transition={{ duration: 0.5 }}
									className="absolute bottom-0 left-2 flex w-full translate-y-full items-center justify-center p-2 text-center font-medium text-black/20 tracking-tight"
								>
									{img.title}
								</motion.div>
							)}
						</AnimatePresence>
					</CarouselItem>
				))}
			</CarouselContent>

			{showPagination && (
				<div className="absolute bottom-4 flex w-full items-center justify-center">
					<div className="flex items-center justify-center gap-2">
						{images.map((img, index) => (
							<button
								key={`dot-${img.id}`}
								type="button"
								onClick={() => api?.scrollTo(index)}
								className={cn(
									"h-2 w-2 cursor-pointer rounded-full transition-all",
									current === index
										? "bg-black ring-3 ring-accent"
										: "bg-gray-400",
								)}
								aria-label={`Go to slide ${index + 1}`}
							/>
						))}
					</div>
				</div>
			)}
			{showNavigation && (
				<div className="absolute bottom-4 flex w-full items-center justify-between gap-2 px-4">
					<button
						type="button"
						aria-label="Previous slide"
						onClick={() => api?.scrollPrev()}
						className="rounded-full bg-gray-400 p-2"
					>
						<ChevronLeft aria-hidden className="text-white" />
					</button>
					<button
						type="button"
						aria-label="Next slide"
						onClick={() => api?.scrollNext()}
						className="rounded-full bg-gray-400 p-2"
					>
						<ChevronRight aria-hidden className="text-white" />
					</button>
				</div>
			)}
		</Carousel>
	);
};

export { MenuCarousel };
