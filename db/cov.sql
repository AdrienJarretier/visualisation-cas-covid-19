CREATE TABLE "countries" (
  "geoid" CHARACTER(2) PRIMARY KEY,
  "name" TEXT
);

CREATE TABLE "cases" (
  "country" CHARACTER(2),
  "date" DATE NOT NULL,
  "cases" INTEGER NOT NULL,
  "deaths" INTEGER NOT NULL,
  UNIQUE (country, date)
);

ALTER TABLE "cases" ADD FOREIGN KEY ("country") REFERENCES "countries" ("geoid");
