## Steps to run the code

1. Create an .env file in root base on .env.sample. This file is used for the postgresql password and username variables in compose.yml. Please provide password and username.

2. Create a config.json file base on config.json.sample in /src/db. This is the config file for postgresql db connection. Please provide password and username.

3. Run "npm install" to install all the dependencies.

4. Create a folder "postgres-db-data" in root. This folder is used in compose.yml file to map the internal container storage path to an external Docker volume or host path.

5. Run "docker compose up" to create the containers.

6. Log in to adminer at http://localhost:8080/ and create the meter_readings table using the sql in /src/sql/create_table.sql.

7. Run 'npm run dev" to run the code.



###### Additional Information

1. I have added the audit fields to the meter_readings table so now the sql looks like the below

```sql
create table meter_readings (
    id uuid default gen_random_uuid() not null,
    "nmi" varchar(10) not null,
    "timestamp" timestamp not null,
    "consumption" numeric not null,
    "created_by" varchar(20) not null,
    "created_at" timestamptz not null DEFAULT now(),
    "modified_by" varchar(20) not null,
    "modified_at" timestamptz not null DEFAULT now(),
    constraint meter_readings_pk primary key (id),
    constraint meter_readings_unique_consumption unique ("nmi", "timestamp")
);
```