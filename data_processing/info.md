## FAQ about this data

The general structure of the data looks like this:

#### How much data is there? how many MB (unzipped), how many rows/events?

There's approximately 500 MB unzipped at the time of writing (4/3)

```Tsv
EVENT_NO_TRIP   OPD_DATE    VEHICLE_ID  METERS   ACT_TIME GPS_LONGITUDE GPS_LATITUDE
BIG_INTEGER     DTG         INTEGER     INTEGER  INTEGER  GEO           GEO
# Example
150000000       01-JAN-00   0           0        0        -122.600000   45.600000
```

Where:

- EVENT_NO_TRIP: Datetime the trip was logged
- OPD_DATE: Human readable date (DAY-MONTH-YEAR) the trip occurred
- VEHICLE_ID: Ostensibly a unique identified for the vehicle performing the trip
- METERS: TBD, Likely the total trip length of the vehicle
- ACT_TIME: TBD; Possible internal metric?
- GPS_LONGITUDE: Longitude of a stop?
- GPS_LATITUDE: Latitude of a stop?

```bash
# This assumes theres only data stored in `/data`
$ du -sh data/
496M    data/
```

There's just over 8.6 million rows at the time of writing (4/3)

Given this:

```python
    df = load_data()
    print(df.shape)
```

```bash
$ python main.py
(8623470, 7) # (Rows, Columns)
```

#### The data appears to be event data for C-Tran busses. How many vehicles are tracked?

#### how many routes?

#### which dates are tracked, are these weekdays or weekend days?

#### using estimation or extrapolation how many events would you expect to need to process for a typical day? per week? per month? per year?

#### how many different vehicles are tracked?

#### are the same vehicles tracked each day or does it change from day to day?

#### any guess as to what the "METERS" column means?

#### the ACT_TIME columns seems to represent the time at which the event occurred. what are its units?

#### Can you convert this to datetime format?

#### what is the earliest and latest event for each route and vehicle for each day?

#### are the events spaced evenly in time or are the events more frequent at specific times of day (for a given vehicle)?

#### Do the GPS_LONGITUDE and GPS_LATITUDE values correspond to locations within Clark County?

#### What is the bounding box for the GPS locations. That is what are the minimum and maximum latitude and longitude coordinates? If you plot these on a map does the bounding box roughly correspond #### with Clark county?

#### can you find the bounding box for a given route? can you compute the birds-eye distance for a bounding box? that is, the distance from the min latitude, min longitude to the max latitude max

#### longitude.

#### which route has the largest birds-eye distance? the smallest distance?

#### which vehicle has the largest distance? the smallest distance?

#### how many trips does a vehicle take per day? min, max, median, mean, stddev
