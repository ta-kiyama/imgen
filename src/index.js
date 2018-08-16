const rejectedSymbol = Symbol("rejected");

export default function imgen(gen, thisArg = this) {
  function create(result, history) {
    const createActor = (type) => (arg, onError, ...rest) => {
      const nextHistory = [...history, { type, arg, onError, rest }];
      const itr = gen.call(thisArg, nextHistory[0].arg, nextHistory[0].onError, ...nextHistory[0].rest);
      let result = {};

      for(let i=0;i<nextHistory.length;++i) {
        const isAsync = result instanceof Promise;

        if(!isAsync) {
          if(result.done) break;

          result = itr[nextHistory[i].type](nextHistory[i].arg);
        }
        else {
          result = result.then((result) => {
            if(result.done) return result;
            
            return itr[nextHistory[i].type](nextHistory[i].arg)
              .catch((err) => ({ done: true, value: undefined, [rejectedSymbol]: err }));
          });
        }
      }

      return create(result, nextHistory);
    };

    const isAsync = result instanceof Promise;

    if(!isAsync) return Object.assign(
      {},
      result,
      {
        next: createActor("next"),
        throw: createActor("throw"),
        return: createActor("return"),
      },
    );

    return {
      done: result.then((r) => r.done),
      value: result.then((r) => r.value),
      next: createActor("next"),
      throw: createActor("throw"),
      return: createActor("return"),
      async toPromise() {
        const error = (await result)[rejectedSymbol];

        if(error) throw error;

        return result;
      },
    };
  }

  return create(undefined, []);
}
