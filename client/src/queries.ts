import gql from "graphql-tag";

export const ROUTES = gql`
  query getRoutes {
    gtfs_routes {
      route_id
      route_long_name
      route_short_name
    }
  }
`;

// export const AVL_CAD_DATES = gql`
//   query getAvlDates {
//     cad_avl_trips(distinct_on: service_date, order_by: { service_date: asc }) {
//       service_date
//     }
//   }
// `;

export const AVL_CAD_DATES = gql`
  query getAvlDatesFromRoute($route_number: Int) {
    cad_avl_trips(
      distinct_on: service_date
      order_by: { service_date: asc }
      where: { route_number: { _eq: $route_number } }
    ) {
      service_date
    }
  }
`;

export const AVL_CAD_VEHICLES_FROM_ROUTE_AND_DATE = gql`
  query getAvlVehiclesFromRouteAndDay($route_number: Int, $service_date: date) {
    cad_avl_trips(
      where: {
        route_number: { _eq: $route_number }
        service_date: { _eq: $service_date }
      }
      distinct_on: vehicle_number
    ) {
      vehicle_number
    }
  }
`;

export const AVL_CAD_TRIPS_FROM_ROUTE_AND_DATE = gql`
  query getAvlTripsFromRoute($route_number: Int, $service_date: date) {
    cad_avl_trips(
      where: {
        route_number: { _eq: $route_number }
        service_date: { _eq: $service_date }
      }
      distinct_on: trip_number
    ) {
      trip_number
      vehicle_number
      block
    }
  }
`;

export const AVL_CAD_TRIP_FROM_ROUTE = gql`
  query getAvlTripsFromRoute($route_number: Int) {
    cad_avl_trips(
      where: { route_number: { _eq: $route_number } }
      distinct_on: trip_number
    ) {
      trip_number
      service_date
      block
      vehicle_number
    }
  }
`;

export const GET_BREADCRUMBS_FROM_VEHICLE_AND_DATE = gql`
  query getBreadcrumbsFromVehicleAndDate($vehicle_id: Int, $opd_date: date) {
    unique_trips: breadcrumbs(
      where: { vehicle_id: { _eq: $vehicle_id }, opd_date: { _eq: $opd_date } }
      distinct_on: event_no_trip
    ) {
      event_no_trip
    }
    timestamps: breadcrumbs(
      where: { vehicle_id: { _eq: $vehicle_id }, opd_date: { _eq: $opd_date } }
      order_by: { act_time: asc }
    ) {
      act_time
    }
    breadcrumbs: breadcrumbs(
      where: { vehicle_id: { _eq: $vehicle_id }, opd_date: { _eq: $opd_date } }
      order_by: { act_time: asc, event_no_trip: asc }
    ) {
      lat
      lon
      act_time
      event_no_trip
    }
  }
`;

export const DISTINCT_VEHICLES_ON_DAY = (day: string) => gql`
query {
    breadcrumbs(where: {opd_date: {_eq: "${day}"}}, distinct_on: vehicle_id) {
      vehicle_id
    }
  }
`;

export const BREADCRUMBS_WHERE = gql`
  query($route_number: Int) {
    breadcrumbs(where: { event_no_trip: { _eq: $route_number } }) {
      lat
      lon
    }
  }
`;

export const BREADCRUMBS = gql`
  query {
    breadcrumbs(
      where: {
        opd_date: { _eq: "2020-03-19" }
        event_no_trip: { _eq: 153914212 }
      }
      order_by: { meters: asc, act_time: asc }
    ) {
      lat
      lon
      # act_time
      # meters
      # id
    }
  }
`;
