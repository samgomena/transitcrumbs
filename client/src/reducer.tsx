import React, {
  createContext,
  Dispatch,
  ReactChild,
  useContext,
  useReducer,
} from "react";

export interface State {
  loading: boolean;
  route: number | null;
  date: Date | string | null;
  vehicle: number | null;
  trips: Array<number>;
}

export enum Actions {
  LOADING,
  SET_ROUTE,
  SET_DATE,
  SET_VEHICLE,
  SET_TRIPS,
}

interface Action {
  type: Actions;
  payload: any;
}

const initialState: State = {
  loading: false,
  date: "2020-03-11",
  route: 105,
  vehicle: null,
  trips: [],
};

function reducer(state: State, action: Action): State {
  const { LOADING, SET_ROUTE, SET_DATE, SET_VEHICLE, SET_TRIPS } = Actions;

  switch (action.type) {
    case LOADING:
      return { ...state, loading: action.payload };
    case SET_ROUTE:
      return { ...state, route: action.payload };
    case SET_DATE:
      return { ...state, date: action.payload };
    case SET_VEHICLE:
      return { ...state, vehicle: action.payload };
    case SET_TRIPS:
      return { ...state, trips: action.payload };
    default:
      return state;
  }
}

const StateContext = createContext<[State, Dispatch<Action>]>([
  initialState,
  // Appease the ts gods
  () => {},
]);

const StateProvider = ({ children }: { children: ReactChild }) => {
  const contextValue = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
export const useAppState = () => useContext(StateContext);
