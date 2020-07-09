import React, { ReactElement, useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";
import DatePicker from "react-datepicker";

import SearchResults from "./SearchResults";
import { useAppState, Actions } from "../reducer";

import "react-datepicker/dist/react-datepicker.css";

import {
  ROUTES,
  AVL_CAD_TRIPS_FROM_ROUTE_AND_DATE,
  AVL_CAD_VEHICLES_FROM_ROUTE_AND_DATE,
  GET_BREADCRUMBS_FROM_VEHICLE_AND_DATE,
  GET_BREADCRUMBS_FROM_DATE_AND_TRIPS,
  AVL_CAD_DATES,
} from "../queries";

type Route = {
  route_id: number;
  route_long_name: string;
  route_short_name: string;
};

type Trip = {
  trip_number: number;
  service_date: Date;
  train: number;
};

export const Routes = (props: any): ReactElement => {
  const [state, dispatch] = useAppState();
  const { data, loading, error } = useQuery(ROUTES);

  if (loading) return <div>Loading routes...</div>;
  if (error) return <div>There was an error loading routes :(</div>;

  return (
    <div>
      {/* <div>Route</div> */}
      <select
        className="form-control mb-2"
        onChange={(e) =>
          dispatch({ type: Actions.SET_ROUTE, payload: e.target.value })
        }
      >
        {/* Null option */}
        <option value="">Select a route</option>
        {data.gtfs_routes.map(
          ({ route_long_name, route_short_name }: Route, idx: number) => (
            <option key={`route-${idx}`} value={route_short_name}>
              {route_long_name}
            </option>
          )
        )}
      </select>
    </div>
  );
};

export const Dates = (props: any): ReactElement => {
  const [state, dispatch] = useAppState();
  const { route: route_number, date } = state;

  const { data, loading, error } = useQuery(AVL_CAD_DATES, {
    variables: { route_number },
  });

  const dates: Array<Date> = useMemo(
    () =>
      data &&
      data.cad_avl_trips.map(
        ({ service_date }: { service_date: string }) => new Date(service_date)
      ),
    [data && data.cad_avl_trips]
  );

  if (loading) return <div>Loading dates...</div>;
  if (error) return <div>Error loading dates :(</div>;

  return (
    <DatePicker
      className="form-control mb-2"
      dateFormat="yyyy-MM-dd"
      selected={date ? new Date(date) : undefined}
      onChange={(date: Date) =>
        dispatch({ type: Actions.SET_DATE, payload: date })
      }
      includeDates={dates}
      placeholderText="Select a service date"
    />
  );
};

export const Vehicles = (props: any) => {
  const [state, dispatch] = useAppState();
  const { route, date } = state;
  if (!route || !date) return null;

  const { data, loading, error } = useQuery(
    AVL_CAD_VEHICLES_FROM_ROUTE_AND_DATE,
    {
      variables: {
        route_number: route,
        service_date: date,
      },
    }
  );

  if (loading) return <div>Loading vehicles...</div>;
  if (error) return <div>Error loading vehicle information</div>;

  return (
    <div>
      <div>Vehicle ID</div>
      <select
        className="form-control mb-2"
        onChange={(e) =>
          dispatch({ type: Actions.SET_VEHICLE, payload: e.target.value })
        }
      >
        <option></option>
        {data.cad_avl_trips.map(
          ({ vehicle_number }: { vehicle_number: number }, idx: number) => (
            <option key={`vehicle-${idx}`} value={vehicle_number}>
              {vehicle_number}
            </option>
          )
        )}
      </select>
    </div>
  );
};

type TripDataType = {
  __typename: string;
  block: number;
  trip_number: number;
  vehicle_number: number;
};

export type TripsByBlock = Record<number, Array<TripDataType>>;

export const Trips = (props: any) => {
  const [state, dispatch] = useAppState();
  let { route, date } = state;
  date = "2020-03-11";
  route = 105;

  if (!route || !date) return null;

  const { data, loading, error } = useQuery(AVL_CAD_TRIPS_FROM_ROUTE_AND_DATE, {
    variables: {
      route_number: route,
      service_date: date,
    },
  });

  const tripsByBlock: TripsByBlock = useMemo(
    () =>
      data &&
      data.cad_avl_trips.reduce(
        (acc: any, { block, trip_number, vehicle_number }: TripDataType) => {
          if (acc[block] === undefined)
            acc[block] = [{ trip_number, vehicle_number }];
          else acc[block].push({ trip_number, vehicle_number });
          return acc;
        },
        {}
      ),
    [data && data.cad_avl_trips]
  );

  if (loading) return <div>Loading trips...</div>;
  if (error) return <div>Error loading trip information</div>;

  return (
    <div
      style={{
        overflow: "scroll",
      }}
    >
      <SearchResults tripsByBlock={tripsByBlock} />
    </div>
  );
};

export const useBreadcrumbs = (opd_date: string, vehicle_id: number) =>
  useQuery(GET_BREADCRUMBS_FROM_VEHICLE_AND_DATE, {
    variables: { opd_date, vehicle_id },
  });

export const useTripBreadcrumbs = (
  opd_date: string | Date | null,
  trips: Array<number>
) =>
  useQuery(GET_BREADCRUMBS_FROM_DATE_AND_TRIPS, {
    variables: { opd_date, _in: trips },
  });
