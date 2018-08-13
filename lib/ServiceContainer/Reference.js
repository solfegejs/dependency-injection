const _id = Symbol();

module.exports = class Reference {
  constructor(id) {
    if (typeof id !== "string") {
      throw new TypeError(`${id} is not a string, it cannot be used as service identifier`);
    }

    this[_id] = id;
  }

  getId() {
    return this[_id];
  }
};
