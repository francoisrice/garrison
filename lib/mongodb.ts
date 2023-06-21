import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
	throw new Error(
		"Invalid/Missing environment variable found for MONGO_URL inside .env.local"
	);
}

const client = new MongoClient(process.env.MONGODB_URI);
const clientPromise = client.connect();

export default clientPromise;
