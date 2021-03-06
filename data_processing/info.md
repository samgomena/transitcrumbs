## FAQ

#### What does the data look like

The general structure of the data looks like this:

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

#### How much time does it take <x> to parse this data?

Python: The data takes ~8s to process with python 3.8 on a 64bit i7 w/ 16GB RAM machine running MacOs:

With `time`:

```bash
# Note: Time includes loading pipenv and libraries via pipenv (not really sure what the overhead is)
time pipenv run python main.py

real    0m8.737s
user    0m7.174s
```

With `[hyperfine]`(https://github.com/sharkdp/hyperfine)

```bash
$ hyperfine --warmup 3 'pipenv run python main.py'
Benchmark #1: pipenv run python main.py
  Time (mean ± σ):      8.526 s ±  0.119 s    [User: 7.145 s, System: 1.647 s]
  Range (min … max):    8.427 s …  8.752 s    10 runs
```

#### How much data is there? how many MB (unzipped), how many rows/events?

There's approximately 500 MB unzipped at the time of writing (4/3)

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
    # (Rows, Columns)
    # (8623470, 7)
```

```bash
$ python main.py

```

#### The data appears to be event data for C-Tran busses. How many vehicles are tracked?

Assuming the each vehicle has a unique id in the `VEHICLE_ID` column:

```python
    df = load_data()
    print(
        len(df["VEHICLE_ID"].unique())
    )
    # 117
```

#### How many routes?

#### Which dates are tracked, are these weekdays or weekend days?

#### Using estimation or extrapolation how many events would you expect to need to process for a typical day? per week? per month? per year?

#### How many different vehicles are tracked?

See [number 2](#2)

#### Are the same vehicles tracked each day or does it change from day to day?

#### Any guess as to what the "METERS" column means?

At this point in time, I assume it's the meters the vehicle has travelled over the month. It's hard to say without a larger dataset/input from C-Tran.

#### The ACT_TIME columns seems to represent the time at which the event occurred. what are its units?

#### Relating to last: Can you convert this to datetime format?

#### What is the earliest and latest event for each route and vehicle for each day?

#### Are the events spaced evenly in time or are the events more frequent at specific times of day (for a given vehicle)?

#### Do the GPS_LONGITUDE and GPS_LATITUDE values correspond to locations within Clark County?

#### What is the bounding box for the GPS locations. That is what are the minimum and maximum latitude and longitude coordinates? If you plot these on a map does the bounding box roughly correspond #### with Clark county?

#### Can you find the bounding box for a given route? can you compute the birds-eye distance for a bounding box? that is, the distance from the min latitude, min longitude to the max latitude max longitude.

#### Which route has the largest birds-eye distance? the smallest distance?

#### Which vehicle has the largest distance? the smallest distance?

#### How many trips does a vehicle take per day? min, max, median, mean, stddev
