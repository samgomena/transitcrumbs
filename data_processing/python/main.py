import pandas as pd

from glob import glob

# Grab all tsv data from `data` directory
ALL_DATA_FILES = glob("../data/**/*.tsv")


def load_data():
    # Taken and/or modified from https://stackoverflow.com/a/21232849/4668680
    return pd.concat((pd.read_csv(_file, sep="\t") for _file in ALL_DATA_FILES))


if __name__ == "__main__":
    df = load_data()

    q1 = df.shape
    q2 = len(df["VEHICLE_ID"].unique())
    print(df)
