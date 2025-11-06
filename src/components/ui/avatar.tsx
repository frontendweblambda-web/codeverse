import Image, { ImageProps } from "next/image";

import clsx from "clsx";

type AvatarProps = Omit<ImageProps, "src" | "alt"> & {
	src?: string;
	alt?: string;
	size?: number;
	auto?: boolean;
};
export default function Avatar({
	auto,
	alt = "",
	src,
	size = 30,
	className,
	...rest
}: AvatarProps) {
	return (
		<div
			className={clsx(
				"rounded-full overflow-hidden  bg-slate-900",
				className,
				auto && "mx-auto",
			)}
			style={{ width: size + 1, height: size + 1 }}>
			<Image
				className="w-full h-full"
				alt={alt!}
				src={src || "/images/avatar1.jpg"}
				width={size}
				height={size}
				{...rest}
			/>
		</div>
	);
}
