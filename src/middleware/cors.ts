import { NextResponse } from "next/server";

export function withCORS(res: NextResponse) {
	res.headers.set("Access-Control-Allow-Origin", "*"); // allow all origins
	res.headers.set(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, OPTIONS",
	);
	res.headers.set(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization",
	);
	return res;
}

export function handleOptions() {
	return withCORS(new NextResponse(null, { status: 204 }));
}
