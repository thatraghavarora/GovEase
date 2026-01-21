import centers from "./centers.json";

export const getCenterById = (id) =>
  centers.find((center) => center.id === id);

export default centers;
