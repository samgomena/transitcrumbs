import React, { ReactElement, useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";
import DatePicker from "react-datepicker";

import { appActionType } from "../index";

import "react-datepicker/dist/react-datepicker.css";

import {
  ROUTES,
  AVL_CAD_TRIP_FROM_ROUTE,
  AVL_CAD_TRIPS_FROM_ROUTE_AND_DATE,
  AVL_CAD_VEHICLES_FROM_ROUTE_AND_DATE,
  GET_BREADCRUMBS_FROM_VEHICLE_AND_DATE,
  GET_BREADCRUMBS_FROM_DATE_AND_TRIPS,
  AVL_CAD_DATES,
} from "../queries";

type RouteProps = {
  setRoute: Function;
};

type Route = {
  route_id: number;
  route_long_name: string;
  route_short_name: string;
};

export const Routes = ({ state, dispatch }): ReactElement => {
  const { data, loading, error } = useQuery(ROUTES);

  if (loading) return <div>Loading routes...</div>;
  if (error) return <div>There was an error loading routes :(</div>;

  return (
    <div>
      <div>Route</div>
      {/* <select onChange={handleChange}> */}
      <select
        onChange={(e) =>
          dispatch({ type: appActionType.SET_ROUTE, payload: e.target.value })
        }
      >
        {/* Null option */}
        <option></option>
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

type Trip = {
  trip_number: number;
  service_date: Date;
  train: number;
};

export const Breakdown = (props) => {
  const {
    state,
    dispatch,
    route_number,
    date,
    setDate,
    vehicle,
    setVehicle,
    trips,
    setTrips,
  } = props;

  const { route } = state;

  if (route === null) return null;

  const { data, loading, error } = useQuery(AVL_CAD_TRIP_FROM_ROUTE, {
    variables: {
      route,
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading trip: {JSON.stringify(error)}</div>;

  return (
    <div>
      <div>Service Day</div>
      <Dates
        state={state}
        dispatch={dispatch}
        route_number={route_number}
        date={date}
        setDate={setDate}
      />
      <br />
      <Vehicles
        state={state}
        dispatch={dispatch}
        route_number={route_number}
        service_date={date}
        vehicle={vehicle}
        setVehicle={setVehicle}
      />
      <br />
      <Trips
        state={state}
        dispatch={dispatch}
        route_number={route_number}
        service_date={date}
        trips={trips}
        setTrips={setTrips}
      />
    </div>
  );
};

export const Dates = (props): ReactElement => {
  const { state, dispatch } = props;
  const { route, date } = state;
  const { data, loading, error } = useQuery(AVL_CAD_DATES, {
    variables: { route },
  });

  if (loading) return <div>Loading dates...</div>;
  if (error) return <div>Error loading dates :(</div>;

  const dates: Array<Date> = data.cad_avl_trips.map(
    ({ service_date }: { service_date: Date }) => new Date(service_date)
  );

  return (
    <DatePicker
      dateFormat="yyyy-MM-dd"
      selected={date}
      // onChange={(date: Date) => setDate(date)}
      onChange={(date: Date) =>
        dispatch({ type: appActionType.SET_DATE, payload: date })
      }
      includeDates={dates}
      placeholderText="Select a service date"
    />
  );
};

export const Vehicles = ({ state, dispatch }) => {
  const { route, date } = state;
  if (!route || !date) return null;

  const { data, loading, error } = useQuery(
    AVL_CAD_VEHICLES_FROM_ROUTE_AND_DATE,
    {
      variables: {
        route,
        date,
      },
    }
  );

  if (loading) return <div>Loading vehicles...</div>;
  if (error) return <div>Error loading vehicle information</div>;

  return (
    <div>
      <div>Vehicle ID</div>
      {/* <select onChange={(e) => setVehicle(e.target.value)}> */}
      <select
        onChange={(e) =>
          dispatch({ type: appActionType.SET_VEHICLE, payload: e.target.value })
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

export const Trips = ({
  state,
  dispatch,
  route_number,
  service_date,
  trips,
  setTrips,
}) => {
  const { route, date } = state;
  if (!route || !date) return null;

  service_date = "2020-03-11";
  route_number = 105;

  const { data, loading, error } = useQuery(AVL_CAD_TRIPS_FROM_ROUTE_AND_DATE, {
    variables: {
      route,
      date,
    },
  });

  const tripsByBlock = useMemo(
    () =>
      data &&
      data.cad_avl_trips.reduce(
        (acc, { block, trip_number, vehicle_number }: TripDataType) => {
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
        height: "40rem",
        overflow: "scroll",
      }}
    >
      {Object.entries(tripsByBlock).map(([block, values]) => (
        <div
          style={{
            border: "1px gray solid",
            borderRadius: "4px",
            padding: "4px",
            marginBottom: "4px",
          }}
          // onClick={() => setTrips(values.map(({ trip_number }) => trip_number))}
          onClick={() =>
            dispatch({
              type: appActionType.SET_TRIPS,
              payload: values.map(({ trip_number }) => trip_number),
            })
          }
        >
          <div style={{ fontSize: "1.2" }}>Block: {block}</div>
          {values.map(({ trip_number, vehicle_number }, idx) => (
            <div key={idx}>
              <input type="checkbox" />
              {trip_number} {vehicle_number}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const useBreadcrumbs = (opd_date: string, vehicle_id: number) =>
  useQuery(GET_BREADCRUMBS_FROM_VEHICLE_AND_DATE, {
    variables: { opd_date, vehicle_id },
  });

export const useTripBreadcrumbs = (opd_date: string, trips: Array<number>) =>
  useQuery(GET_BREADCRUMBS_FROM_DATE_AND_TRIPS, {
    variables: { opd_date, _in: trips },
  });
