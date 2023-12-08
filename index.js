// based on nanoevents
// https://github.com/ai/nanoevents

// size: exporting as e instead of `createNanoEvents` to reduce size
// js module syntax allows to rename on import e.g. { e as emitter }
// size: encapsulation to avoid `this`
// size: renamed from `event` to `e`
// size: shadowing the variable
// size: declaring the variables in the function signature
export let e = (e = {}) => ({
  e,
  // size: instead of ...args, allow a single object to be passed
  emit(name, arg) {
    // size: changed to a `let of` instead of a traditional for loop
    for (let fn of e[name] || []) {
      // conditional call to avoid calling 0 (see below)
      fn && fn(arg);
    }
  },
  // note: nanoevents leaked memory by never removing the event listener name
  // we're extending that to the array of listeners as well by overwriting the
  // entry in the array
  //
  // size: declaring the variables in the function signature
  on(name, fn, n = (e[name] ||= []), i = n.length) {
    // size: changed to an array assignment instead of pushing to the array
    n[i] = fn;
    return () => (
      // size: zeroing out the entry instead of filtering the array to a new assignment
      n[i] = 0
    );
  },
});

// see index.min.js for the minified version of this file
// it's manually minified to optimize for size