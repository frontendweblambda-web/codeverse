import { NextResponse } from "next/server";

import { db } from "@/lib/prisma-client";

export async function GET() {
	let databaseStatus = "ok";
	let connectionCount = -2; // Default to -2 to indicate it hasn't been fetched
	try {
		// Test basic database connection
		connectionCount = await db.$queryRaw`SELECT 1 as count`;
	} catch (error) {
		databaseStatus = "error";
		//logger.error("Database health check error:", error);
	}

	return NextResponse.json(
		{
			message: "Server is running",
			version: "1.0.0",
			database: databaseStatus,
			connectionCount: connectionCount,
			uptime: process.uptime(),
			memoryUsage: process.memoryUsage(),
			environment: {
				NODE_ENV: process.env.NODE_ENV,
			},
		},
		{ status: 200 },
	);
}
