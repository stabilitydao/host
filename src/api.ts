import { IBuildersMemory } from "./activity/builder";

/**
 Hot memory with indexed and aggregated data. OS API reply.
 @interface
 */
export interface IOSMemory {
  /** Prices of assets */
  prices: Prices;

  /** Total Value Locked in blockchains */
  chainTvl: { [chainId: string]: number };

  /** DAO runtime data. Updates each minute or faster. */
  daos: {
    [symbol: string]: IDAOAPIData;
  };

  /** Instant Updates by subscribing to github application webhooks */
  builders: IBuildersMemory;
}

export interface IDAOAPIData {
  /** Price from Stability interchain oracle */
  oraclePrice: string;
  /** Coingecko price */
  coingeckoPrice?: string;
  /** Data for total revenue chart */
  revenueChart: RevenueChart;
  /** Extracted on-chain data */
  onChainData: {
    [chainId: string]: {
      stakingAPR: number;
      staked: number;
      units: {
        [unitId: string]: {
          pendingRevenue: number;
        };
      };
    };
  };
}

export type Prices = {
  [symbol: string]: {
    price: string;
    priceChange: number;
  };
};

export type RevenueChart = Record<number, string>;
