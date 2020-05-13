import React, { FunctionComponent } from "react";
import { useQuery } from "@apollo/react-hooks";

import { BREADCRUMBS, DISTINCT_DAYS } from "../queries";

export const FilterForm: FunctionComponent = () => {
  const {
    data: distinctDays,
    loading: distinctDaysLoading,
    error: distinctDaysError,
  } = useQuery(DISTINCT_DAYS);

  return distinctDaysLoading ? (
    <div>Loading...</div>
  ) : distinctDaysError ? (
    <div>Error...</div>
  ) : (
    <div>
      <select>
        {distinctDays.breadcrumbs.map(
          ({ opd_date }: { opd_date: string }, idx: number) => (
            <option key={`date-${idx}`}>{opd_date}</option>
          )
        )}
      </select>
    </div>
  );
};

export const useBreadcrumbs = () => useQuery(BREADCRUMBS);

export const Breadcrumbs: FunctionComponent = () => {
  const { loading, error, data } = useBreadcrumbs();

  // const breadcrumbs = data.breadcrumbs.map(
  //   ({ lat, lon }: { lat: number; lon: number }): L.LatLngTuple => [lat, lon]
  // );

  // console.log(breadcrumbs);

  return (
    <details>
      <summary>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error</p>
        ) : (
          <p>Breadcrumbs</p>
        )}
      </summary>
      <div style={{ overflowY: "scroll" }}>
        {data &&
          data.breadcrumbs.map(({ lat, lon }: { lat: number; lon: number }) => (
            <pre>
              [{lat}, {lon}]
            </pre>
          ))}
      </div>
    </details>
  );
};
