import { createTransform } from 'redux-persist';
interface ExpireConfig<PS> {
  persistAt: string;
  secondUntilExpire: number;
  stateAfterExpire: PS;
}

interface InboundStructure<PS> {
  state: PS;
  persistTime: number;
}

/**
 * Transforms the redux-persist data to keep the time reference
 * If the expiration time criteria has been met, it returns the empty/default state
 * @example   
 * persistExpire({
    persistAt: 'betSlip',
    secondUntilExpire: 30,
    stateAfterExpire: betSlipInitialState
  })
 */
export function persistExpire<PS>({
  persistAt,
  secondUntilExpire,
  stateAfterExpire,
}: ExpireConfig<PS>) {
  return createTransform<PS, InboundStructure<PS>>(
    (inboundState) => ({
      state: inboundState,
      persistTime: new Date().getTime(),
    }),
    ({ state, persistTime }) => {
      const endTime = new Date().getTime();
      const durationInSeconds = (endTime - persistTime) / 1000;

      if (durationInSeconds > secondUntilExpire) {
        return stateAfterExpire;
      }
      return state;
    },
    { whitelist: [persistAt] }
  );
}
