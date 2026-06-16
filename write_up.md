# Flo Energy Tech Assessment

## Q1 What is the rationale for the technologies you have decided to use?

_Language: Javascript_
- Familiarity/Proficiency
- Loosely typed language which enables faster scripting
- Can be improved to strongly typed by upgrading to Typescript

_Database: Postgresql_
- meter readings are structured data hence choosing a Relational Database Management Systems (RDBMS)
- searches about using uuid as primary key recommends PostgreSQL over MySQL in terms of performance and syntax/usage

## Q2 What would you have done differently if you had more time?
- Write the code in compiled language eg Go because of type safety and also compiled binary runs more stable when deployed
- Write tests

## Q3 What is the rationale for the design choices that you have made?
- Use combination or read stream and read/process each line at at time to enable the code to handle large data and use less memory footprint
- Batch write to database to reduce high latency

