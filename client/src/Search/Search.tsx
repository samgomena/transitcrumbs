import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { BREADCRUMBS } from "../queries";

export function SearchBar(): React.ReactNode {
  return (
    <div>
      <p>Search bar yo</p>
    </div>
  );
}

export function Breadcrumbs(): React.ReactNode {
  const { loading, error, data } = useQuery(BREADCRUMBS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const breadcrumbs = data.breadcrumbs.map(
    ({ lat, lon }): L.LatLngTuple => [lat, lon]
  );

  console.log(breadcrumbs);

  return <div>Breadcrumbs yo!</div>;
  // return data.rates.map(({ currency, rate }) => (
  //   <div key={currency}>
  //     <p>
  //       {currency}: {rate}
  //     </p>
  //   </div>
  // ));
}
