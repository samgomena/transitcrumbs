import React, {
  createContext,
  Dispatch,
  ReactChild,
  Reducer,
  useContext,
  useReducer,
} from "react";

export interface AppState {
  route: number | null;
  date: Date | string | null;
  vehicle: number | null;
  trips: Array<number>;
}

export enum Actions {
  SET_ROUTE,
  SET_DATE,
  SET_VEHICLE,
  SET_TRIPS,
}

type Payload = any;

interface Action {
  type: Actions;
  payload: Payload;
}

const initialState: AppState = {
  route: null,
  date: null,
  vehicle: null,
  trips: [],
};

function reducer(state: AppState, action: Action): AppState {
  const { SET_ROUTE, SET_DATE, SET_VEHICLE, SET_TRIPS } = Actions;

  switch (action.type) {
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

// const StateContext = createContext<[AppState, Reducer<AppState, Action>]>([
// [AppState, React.Dispatch<Action>]
const StateContext = createContext<[AppState, React.Dispatch<Action>]>([
  initialState,
  // Appease the ts gods
  () => {},
]);

const StateProvider = ({ children }: { children: ReactChild }) => {
  // const contextValue: [AppState, Dispatch<Action>] = useReducer(
  // const contextValue: Reducer<AppState, Action> = useReducer(
  const contextValue = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
export const useAppState = () => useContext(StateContext);
