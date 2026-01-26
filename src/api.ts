import { IBuildersMemory, IBuildersMemoryV2 } from "./activity/builder";

export interface IAgentMemory {
  /** When generated */
  timestamp: number;

  /** Private memory data allow to show only overview by agent API */
  private: boolean;

  /** Memory data overview */
  overview: {
    [title: string]: string;
  };

  /** Timestamp when agent instance launched */
  started: number;

  /** EVM transaction sender */
  txSender?: {
    /** EOA */
    account: `0x${string}`;
    /** Coin balances */
    balance: {
      [chainId: string]: {
        coin: string;
        usd: number;
      };
    };
    /** Spent for gas */
    spent: {
      [date: string]: {
        txs: number;
        usd: {
          [chainId: string]: number;
        };
      };
    };
  };

  /** Data specific for agent */
  data: any;
}

export interface IHostAgentMemory extends IAgentMemory {
  data: {
    /** Prices of assets */
    prices: Prices;

    /** Total Value Locked in blockchains */
    chainTvl: { [chainId: string]: number };

    /** DAO runtime data. Updates each minute or faster. */
    daos: {
      [symbol: string]: IDAOAPIDataV2;
    };

    /** Instant Updates by subscribing to github application webhooks */
    builders: IBuildersMemoryV2;
  };
}

export interface IDAOAPIDataV2 {
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
          pendingRevenueAssetSymbol?: string;
          pendingRevenueAssetAmount?: number;
        };
      };
    };
  };
  /** Users / followers in tracked socials */
  socialUsers: {
    [socialLink: string]: number;
  };
}

/**
 Hot memory with indexed and aggregated data. OS API reply.
 @deprecated
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

/** @deprecated */
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
    priceUsd: string;
    priceChange: number;
  };
};

export type RevenueChart = Record<number, string>;
