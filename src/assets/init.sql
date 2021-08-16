CREATE TABLE IF NOT EXISTS "bill" (
	"id"	INTEGER,
	"createdAt"	TEXT NOT NULL,
	"lastUpdate"	TEXT NOT NULL,
	"meta"	TEXT,
	"name"	TEXT,
	"description"	TEXT,
	"currency"	TEXT DEFAULT '€',
	"imageUri"	TEXT,
	"geoLocation"	TEXT,
	"dateTime"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "counter" (
	"id"	INTEGER,
	"bill"	INTEGER,
	"createdAt"	TEXT NOT NULL,
	"lastUpdate"	TEXT NOT NULL,
	"meta"	TEXT,
	"name"	TEXT,
	"count"	INTEGER,
	"description"	TEXT,
	"imageUri"	TEXT,
	"price"	INTEGER,
	FOREIGN KEY("bill") REFERENCES "bill"("id") ON DELETE CASCADE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
