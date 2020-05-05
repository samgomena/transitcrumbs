import pandas as pd

from glob import glob

# Grab all tsv data from the `data` directory
ALL_DATA_FILES = glob("../data/**/*.tsv")

# Most of the lat/long information was taken from: https://stackoverflow.com/a/16743805/4668680
MAX_LAT = 90
MIN_LAT = -90

MAX_LONG = 180
MIN_LONG = -180


def load_data_to_db():
    ...


def test_is_monotonic(df, col):

    # operation_dates = df.OPD_DATE.unique()
    bus_ids = df["VEHICLE_ID"].unique()

    for bus_id in bus_ids:
        assert df[
            (df.OPD_DATE == "20-MAR-20") & (df.VEHICLE_ID == bus_id)
        ].METERS.is_monotonic, f"{bus_id} METERS is not monotonically increasing"


def test_longitude_valid(long_col):
    _min, _max = long_col.min(), long_col.max()
    return _min >= MIN_LONG and _max <= MAX_LONG


def test_latitude_valid(lat_col):
    _min, _max = lat_col.min(), lat_col.max()
    return _min >= MIN_LAT and _max <= MAX_LAT


def load_data():
    ### Data columns are:
    ### "EVENT_NO_TRIP"	"OPD_DATE"	"VEHICLE_ID"	"METERS"	"ACT_TIME"	"GPS_LONGITUDE"	"GPS_LATITUDE"

    # Taken and modified from https://stackoverflow.com/a/21232849/4668680
    return pd.concat(
        [pd.read_csv(_file, sep="\t") for _file in ALL_DATA_FILES], ignore_index=True
    )


def dump_to_multiindex(
    df, wanted_columns: list = ["METERS", "ACT_TIME"]
) -> pd.DataFrame:
    index = pd.MultiIndex.from_frame(df[["OPD_DATE", "VEHICLE_ID"]])

    return pd.DataFrame(
        df[wanted_columns].to_numpy(), columns=wanted_columns, index=index
    )


if __name__ == "__main__":
    df = load_data()

    print(df)

    print(f"All longitude values are valid: {test_longitude_valid(df.GPS_LONGITUDE)}")
    print(f"All latitude values are valid: {test_latitude_valid(df.GPS_LATITUDE)}")

    # a = df.shape
    # b = df["VEHICLE_ID"].unique()
    # c = df.loc[["OPD_DATE", "METERS"]].groupby(["OPD_DATE"]).max()
    # df["IS_WEEKDAY"] = (pd.DatetimeIndex(df["OPD_DATE"]).dayofweek) // 5 == 1

    # Unique vehicles per day data frame
    # uv_df = dump_to_multiindex(df)
    # print(uv_df)

    # pd.DataFrame(np.random.randn(6, 6), index=index[:6], columns=index[:6])
    # df1 = pd.DataFrame(list(df["METERS"]), index=index, columns=["METERS"])
    # for idx, row in df1.itertuples():
    #     print(idx)
    # print(df1.index.unique())
    # for _, idx_by_day in df1.groupby(level=0):
    #     print(idx_by_day)
    # for _, idx_by_vehicle in idx_by_day.groupby(level=0):
    #     print(idx_by_vehicle)

    # print(df1.loc[df1.index.unique()])
