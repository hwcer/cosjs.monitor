"use strict";

const monitor = require('../index');
const options = {"secret":"123456","port":3000,"namespace":["test"] };
let io = monitor.server(options);
