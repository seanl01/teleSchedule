import Bull from "bull";

const queue = new Bull<Action>("actions");

export default queue;
