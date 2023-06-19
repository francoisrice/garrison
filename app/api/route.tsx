import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

if (!process.env.MONGODB_URI) {
	throw new Error(
		"Invalid/Missing environment variable found for MONGO_URL inside .env.local"
	);
}

const mongoClient = new MongoClient(process.env.MONGODB_URI);

export async function POST(request: Request, response: Response) {
	// Fetch Trading Bot data

	const client = await mongoClient.connect();

	const requestObj = await request.json();
	const algo = requestObj.algo;

	try {
		const trades = await client
			.db("dev")
			.collection("trades")
			.find({ algo: "3-ma-cross-30m-BTC-v0_1" })
			.toArray();

		return NextResponse.json(trades);
	} catch (error) {
		console.error(error);
		return { statusCode: response.status, error };
	} finally {
		await client.close();
	}
}
