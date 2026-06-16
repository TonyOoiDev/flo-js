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