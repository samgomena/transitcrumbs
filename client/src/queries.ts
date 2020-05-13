import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

export const DISTINCT_DAYS = gql`
  query {
    breadcrumbs(distinct_on: opd_date) {
      opd_date
    }
  }
`;

export const DISTINCT_VEHICLES = gql`
  query {
    breadcrumbs(distinct_on: vehicle_id) {
      vehicle_id
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

export const BREADCRUMBS = gql`
  query {
    breadcrumbs(
      where: { opd_date: { _eq: "2020-03-16" }, vehicle_id: { _eq: 6012 } }
      order_by: { meters: desc, act_time: desc }
    ) {
      lat
      lon
      act_time
      meters
      id
    }
  }
`;
