### Loading data into postgres:

#### Postgres Container Initialization:

```bash
docker run --name ctran_db -d -e POSTGRES_USER=ctran POSTGRES_PASSWORD=ctran POSTGRES_DB=ctran postgres:latest

# Optional but useful; convert tsv to csv
# Note: postgres will likely complain about '\t' delimiters so this is recommended
for file in ./*.tsv; do
    tr '\t' ',' < $file > $(basename $file .tsv).csv
    # Uncomment to delete tsv files
    # rm -f $file
done

# Copy csv/tsv files to container
for file in ./*.csv; do
    docker cp $file ctran_db:/tmp/
done

# Load files into db _in_ the container
# Note this assumes your local copy of files matches those in the container's /tmp/ directory
# This hasn't been tested and may require manually importing the files
for file in ./*.csv; do
    docker exec -it ctran_db psql -U ctran -c "\COPY bus_data(event_no_trip, opd_date, vehicle_id, meters, act_time, gps_longitude, gps_latitude) FROM '/tmp/$file' DELIMITER ',' CSV HEADER;"
done
```

This also requires the database to have a `bus_data` table already created. To do this you can:

```bash
docker exec -it ctran_db psql -U ctran
```

and then create the table with this SQL:

```sql
CREATE TABLE bus_data (
    id SERIAL NOT NULL,
    event_no_trip INTEGER,
    opd_date DATE,
    vehicle_id INTEGER,
    meters INTEGER,
    act_time INTEGER,
    gps_longitude NUMERIC(10, 6),
    gps_latitude NUMERIC(10, 6),
    -- postgis geography function
    geog GEOGRAPHY(POINT);
    constraint bus_data_pkey primary key (id)
);
```

It's also important to note the longitude and latitude values are numeric values with a _precision_ of 10 and a _scale_ of 6. That is, no lat/long values can exceed 10 digits and the mantissa can be at most 6 digits.

TODO: Import and use PostGIS for geo calculations.

#### PostGIS container initialization

The postgis container is based of the [`kartoza:latest`](https://hub.docker.com/r/kartoza/postgis/).

```bash
docker run --name ctran_db -d -e POSTGRES_USER=ctran -e POSTGRES_PASS=ctran -e POSTGRES_DBNAME=ctran -e ALLOW_IP_RANGE='0.0.0.0/0' -p '5432:5432' -v pg_data:/var/lib/postgresql kartoza/postgis
```

Connect to it:

```bash
docker exec -it ctran_db psql -U ctran
```

select ST_Area(geog) / 0.3048 ^ 2 sqft, ST_Area(the_geog) sqm from somegeogtable;
