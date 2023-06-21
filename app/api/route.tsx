import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response) {
	// Fetch Trading Bot data

	const requestObj = await request.json();
	const algo = requestObj.algo;

	const client = await clientPromise;
	try {
		const trades = await client
			.db("dev")
			.collection("trades")
			.find({ algo })
			.toArray();

		return NextResponse.json(trades);
	} catch (error) {
		console.error(error);
		return { statusCode: response.status, error };
	}
}
