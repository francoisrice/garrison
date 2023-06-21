import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
	throw new Error(
		"Invalid/Missing environment variable found for MONGO_URL inside .env.local"
	);
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
	client = new MongoClient(uri, options);

	global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

// const client = new MongoClient(process.env.MONGODB_URI);
// const clientPromise = client.connect();

export default clientPromise;
