/** Supported unit types */
export enum UnitType {
  /** VE-token early exit fees */
  PVP = "PVP",
  /** Decentralized finance protocol */
  DEFI_PROTOCOL = "DEFI_PROTOCOL",
  /** Maximum Extractable Value opportunities searcher and submitter. */
  MEV_SEARCHER = "MEV_SEARCHER",
  /** Software as a Service business */
  //SAAS = "SAAS",
}

/** Unit status can be changed manually by DAO holders. Revenue of a unit matter. */
/** Unit status can be changed manually by DAO holders. Revenue of a unit matter. */
export enum UnitStatus {
  RESEARCH = "RESEARCH",
  BUILDING_PROTOTYPE = "BUILDING_PROTOTYPE",
  PROTOTYPE = "PROTOTYPE",
  BUILDING = "BUILDING",
  LIVE = "LIVE",
}

/** Supported categories of running units. */
export enum UnitComponentCategory {
  CHAIN_SUPPORT = "CHAIN_SUPPORT",
  ENGINE_SUPPORT = "ENGINE_SUPPORT",
  DEFI_STRATEGY = "DEFI_STRATEGY",
  MEV_STRATEGY = "MEV_STRATEGY",
}

export interface IOSSettings {
  priceDao: number;
  priceUnit: number;
  priceOracle: number;
  priceBridge: number;
  minNameLength: number;
  maxNameLength: number;
  minSymbolLength: number;
  maxSymbolLength: number;
  minVePeriod: number;
  maxVePeriod: number;
  minPvPFee: number;
  maxPvPFee: number;
  /** Min funding duration in days */
  minFundingDuration: number;
  /** Max funding duration in days */
  maxFundingDuration: number;
  /** Min allowed funding amount to raise in terms of exchange asset */
  minFundingRaise: number;
  /** Max allowed funding amount to raise in terms of exchange asset */
  maxFundingRaise: number;
  /** Min length of a vesting name  */
  minVestingNameLen: number;
  /** Max length of a vesting name */
  maxVestingNameLen: number;
  /** Min vesting duration in days*/
  minVestingDuration: number;
  /** Max vesting duration in days*/
  maxVestingDuration: number;

  /** Min allowed interval days between vesting.start and tge.claim */
  minCliff: number;
}
