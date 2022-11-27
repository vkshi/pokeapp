export type AsyncValue<T, E = string> =
    | {
          status: "pending",
      }
    | {
          status: "ready",
          value: T,
      }
    | {
          status: "error",
          message: E,
      };
