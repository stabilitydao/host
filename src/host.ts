/**
 Host prototype.
*/

import { ChainName, chains, getChainByName } from "./chains";
import { IAgent } from "./agents";
import { IBuilderActivity } from "./activity/builder";
import { Activity } from "./activity";
import { IDAOAPIDataV2 } from "./api";
import { getTokenData, TokenData } from "./assets";
import { Validation } from "./validation";
import { IOSSettings, UnitStatus, UnitType } from "./host/types";

export const HOST_DESCRIPTION = "Where True DAOs Live & Work";
export const DAO_FEATURES: string[] = [
  "True DAO: only holders owns, manage and earn whole value",
  "Inter-chain setup with bridging",
  "Decentralized fundraising",
  "Self-developing via Builder activity",
  "Tokenomics constructor",
  "Proper token launch flow to get cg/cmc and wallets listings",
  "Deterministic managed contract addresses",
];
export const STATIC_BASE_URL: `https://${string}` =
  "https://raw.githubusercontent.com/stabilitydao/.github/main";

/**
 Represents a DAO running on Host.

 host-contracts: `IHost.DAOData`

 @version 0.3.0
 @alpha
 @interface
 */
export interface IDAOData {
  /** SEGMENT 1: ON-CHAIN on all chains where Host deployed */

  /**
   * Tradeable interchain ERC-20 token symbol.
   * Lowercased used as slug.
   * While token symbol is SYM then additional DAO tokens symbols are:
   * seedSYM, saleSYM, xSYM, SYM_DAO
   *
   * host-contracts: HostLib.OsStorage.usedSymbols
   */
  symbol: string;

  /** SEGMENT 2: ON-CHAIN on chains where DAO bridged */

  /** Unique ID of DAO */
  uid?: string;

  /** Name of the DAO, used in token names. Without DAO word. */
  name: string;

  /**
   DAO lifecycle phase.
   Changes permissionless when next phase start timestamp reached.
   */
  phase: LifecyclePhase;

  /**
   Deployed smart-contracts.
   host-contracts: deployments of current instance chain only.
  */
  deployments: IDAODeployments;

  /**
   Settings of DAO for chains.
   host-contracts: settings of current instance chain only. This is the only place to save settings of DAO for chains.
   */
  chainSettings: IDAOChainSettings;

  /** IDs of Units running on current chain */
  unitIds?: string[];

  /** On-chain DAO parameters for tokenomics and revenue sharing */
  params: IDAOParameters;

  /** SEGMENT 3: ON-CHAIN on initial chain of DAO */

  /** Where initial deployment became */
  initialChain: ChainName;

  /** Community socials. Update by `Host.updateSocials` */
  socials: string[];

  /** Activities of the organization. */
  activity: Activity[];

  /** Images of tokens. Absolute or relative from stabilitydao/.github repo /os/ folder.  */
  images: IDAOImages;

  /** Revenue generating units owned by the organization. */
  units: IUnit[];

  /** Fundraising */
  funding: IFunding[];

  /** Vesting allocations  */
  vesting: IVesting[];

  /** Settings of DAO Governance */
  governanceSettings: IGovernanceSettings;

  /** Deployer of a DAO have power only at DRAFT phase. */
  deployer: string;

  salts: {
    [chainId: string]: {
      [index in ContractIndices]?: string;
    };
  };

  /** DAO custom metadata stored off-chain. */
  daoMetaDataLocation?: string; // "local","https://..."

  /** SEGMENT 4: OFF-CHAIN emitted data */

  unitsMetaData: IUnitMetaData[];

  /** SEGMENT 5: OFF-CHAIN custom data managed by DAO */

  /** Storage for BUILDER activity and Agents data. */
  daoMetaData?: IDAOMetaData;

  /** SEGMENT 6: API data of DAO */

  /** Hot data updates each minute */
  api?: IDAOAPIDataV2;
}

export interface IDAOMetaData {
  /** DAOs engaging BUILDER activity settings  */
  builderActivity?: IBuilderActivity;

  /** Operating agents managed by the organization. */
  agents?: IAgent[];
}

/** Images of tokens. Absolute or relative from stabilitydao/.github repo /os/ folder.  */
export interface IDAOImages {
  seedToken?: string;
  tgeToken?: string;
  token?: string;
  xToken?: string;
  daoToken?: string;
}

/**
 Lifecycle phase represents DAO tokenomics stage.
 */
export enum LifecyclePhase {
  /** Created */
  DRAFT = "DRAFT",

  /**
   Initial funding. DAO project passed requirements.
   Since SEED started a DAO become real DAO:
   - noncustodial
   - tokenized share holdings
   - collective management via voting
   */
  SEED = "SEED",

  /** Seed was not success. Raised funds sent back to seeders. */
  SEED_FAILED = "SEED_FAILED",

  /** Using SEED funds to launch MVP / Unit generating */
  DEVELOPMENT = "DEVELOPMENT",

  /** TGE is funding event for token liquidity and DAO developments (optionally) */
  TGE = "TGE",

  /** Delay before any vesting allocation started */
  LIVE_CLIFF = "LIVE_CLIFF",

  /** Vesting period active */
  LIVE_VESTING = "LIVE_VESTING",

  /** Vesting ended - token fully distributed */
  LIVE = "LIVE",
}

/**
 Parameters of VE-tokenomics and revenue sharing.
 @interface
 */
export interface IDAOParameters {
  /** Vested Escrow period, days. */
  vePeriod: number;
  /** Instant exit fee, percent */
  pvpFee: number;
  /** Minimal power (min stake amount) to be a holder of DAO */
  minPower?: number;
  /** Share of total DAO revenue going to accidents compensations, percent */
  recoveryShare?: number;
  /** Total supply of DAO token. This value can be changed before start of TGE*/
  totalSupply: number;
}

export interface IDAOChainSettings {
  [chainId: string]: {
    bbRate: number;
  };
}

export interface IGovernanceSettings {
  /** Minimal total voting power (self and delegated) need to create a proposal */
  proposalThreshold?: number;
  /** Bribe share for Tokenomics Transactions (vested funds spending), percent */
  ttBribe?: number;
}

export interface IFunding {
  type: FundingType;
  start: number;
  end: number;
  minRaise: number;
  maxRaise: number;
  raised: number;

  /** Date of DAO launching (after TGE finishing, DAO token is deployed, etc) */
  claim?: number;
}

export enum FundingType {
  SEED = "SEED",
  TGE = "TGE",
}

/**
 Vesting allocation data
 @interface
 */
export interface IVesting {
  /** Short name of vesting allocation */
  name: string;
  /** How must be spent */
  description?: string;
  /** Vesting supply. 10 == 10e18 TOKEN */
  allocation: number;
  /** Start timestamp */
  start: number;
  /** End timestamp */
  end: number;
  address?: `0x${string}`;
}

/// @notice Indices of all contracts that can be deployed by a DAO. The indices are used to pre-set salts
export enum ContractIndices {
  NOT_USED_0,
  SEED_TOKEN_1,
  TGE_TOKEN_2,
  TOKEN_3,
  X_TOKEN_4,
  DAO_TOKEN_5,
  STAKING_6,
  RECOVERY_7,
  TOKEN_BRIDGE_8,
  X_TOKEN_BRIDGE_9,
  DAO_TOKEN_BRIDGE_10,
  VESTING_1_11,
  VESTING_2_12,
  VESTING_3_13,
  VESTING_4_14,
  VESTING_5_15,
  VESTING_6_16,
  VESTING_7_17,
  VESTING_8_18,
  VESTING_9_19,
  VESTING_10_20,
  REVENUE_ROUTER_21,

  // add new indices here if necessary

  COUNT_CONTRACT_INDICES,
}

export interface IContractIndex {
  name: string;
  description?: string;
}

export const daoContractIndices: {
  [index in ContractIndices]?: IContractIndex;
} = {
  [ContractIndices.SEED_TOKEN_1]: {
    name: "Seed token",
    description: "Seed round receipt token",
  },
  [ContractIndices.TGE_TOKEN_2]: {
    name: "Presale token",
    description: "TGE pre-sale receipt token",
  },
  [ContractIndices.TOKEN_3]: {
    name: "Token",
    description: "Main tradable DAO token",
  },
  [ContractIndices.X_TOKEN_4]: {
    name: "VE-token",
    description: "VE-tokenomics entry token",
  },
  [ContractIndices.DAO_TOKEN_5]: {
    name: "DAO token",
    description: "Governance token",
  },
  [ContractIndices.STAKING_6]: {
    name: "Staking",
    description: "Staking contract",
  },
  [ContractIndices.RECOVERY_7]: {
    name: "Recovery",
    description: "Accident recovery system contract",
  },
  [ContractIndices.TOKEN_BRIDGE_8]: {
    name: "Token bridge",
    description: "Bridge for main token",
  },
  [ContractIndices.X_TOKEN_BRIDGE_9]: {
    name: "VE-token bridge",
    description: "Bridge for VE-token",
  },
  [ContractIndices.DAO_TOKEN_BRIDGE_10]: {
    name: "DAO token bridge",
    description: "Bridge for Governance token",
  },
  [ContractIndices.VESTING_1_11]: {
    name: "Vesting 1",
  },
  [ContractIndices.VESTING_2_12]: {
    name: "Vesting 2",
  },
  [ContractIndices.VESTING_3_13]: {
    name: "Vesting 3",
  },
  [ContractIndices.VESTING_4_14]: {
    name: "Vesting 4",
  },
  [ContractIndices.VESTING_5_15]: {
    name: "Vesting 5",
  },
  [ContractIndices.VESTING_6_16]: {
    name: "Vesting 6",
  },
  [ContractIndices.VESTING_7_17]: {
    name: "Vesting 7",
  },
  [ContractIndices.VESTING_8_18]: {
    name: "Vesting 8",
  },
  [ContractIndices.VESTING_9_19]: {
    name: "Vesting 9",
  },
  [ContractIndices.VESTING_10_20]: {
    name: "Vesting 10",
  },
  [ContractIndices.REVENUE_ROUTER_21]: {
    name: "Revenue Router",
    description: "Revenue collector and utilizer contract",
  },
};

/**
 Deployments of running DAO on blockchains.

 @interface
 */
export interface IDAODeployments {
  [chainId: string]: {
    [index in ContractIndices]?: `0x${string}`;
  };
}

/**
 Revenue generating unit owned by a DAO.
 @interface
*/
export interface IUnit {
  /** Unique unit string id. For DeFi protocol its defiOrg:protocolKey. */
  unitId: string;
  /** Blockchains where Unit deployed. Filled only for initial DAO chain Host instance. */
  chainIds?: string[];
  /** DAO UID of Unit Developer (Pool tasks solver) */
  developerUid?: string;
}

/** Unit data that emitted, indexed and saved, translated by Host API later. */
export interface IUnitMetaData {
  /** Short name of the unit */
  name: string;
  /** Status of unit changes appear when unit starting to work and starting earning revenue */
  status: UnitStatus;
  /** Supported type of the Unit */
  type: UnitType;
  /** The share of a Unit's profit received by the DAO to which it belongs. 100 - 100%. */
  revenueShare: number;
  /** A unique emoji for the shortest possible representation of a Unit. */
  emoji?: string;
  /** Frontend endpoints of Unit */
  ui?: IUnitUILink[];
  /** Links to API of the Unit */
  api?: string[];
  /** Components of the Unit. */
  //components?: { [category in UnitComponentCategory]?: UnitComponent[] };
}

export interface IUnitUILink {
  href: `https://${string}`;
  title: string;
}

//export type UnitComponent = StrategyShortId | ChainName | LendingEngine;

/**
 Typescript implementation of the Host
 Object of this class is Host instance deployed on a single blockchain.

 @class
 */
export class Host {
  /** Chain ID where instance deployed */
  chainId: string;

  /** Chain block timestamp */
  blockTimestamp: number = Math.floor(new Date().getTime() / 1000);

  /** Local DAOs storage (in form of a mapping) */
  daos: { [symbol: string]: IDAOData } = {};

  /** Actual DAO symbols at all blockchains */
  usedSymbols: { [name: string]: boolean } = {};

  /** All emitted events */
  events: string[] = [];

  /** Governance proposals. Can be created only at initialChain of DAO. */
  proposals: { [proposalId: string]: IProposal } = {};

  /** Current user address */
  from: string = "0x00";

  settings: IOSSettings = {
    priceDao: 1000,
    priceUnit: 1000,
    priceOracle: 1000,
    priceBridge: 1000,
    minNameLength: 1,
    maxNameLength: 20,
    minSymbolLength: 1,
    maxSymbolLength: 7,
    minVePeriod: 14,
    maxVePeriod: 365 * 4,
    minPvPFee: 10,
    maxPvPFee: 100,
    minFundingDuration: 1,
    maxFundingDuration: 180,
    minFundingRaise: 1000,
    maxFundingRaise: 1e12,
    minVestingNameLen: 1,
    maxVestingNameLen: 20,
    minCliff: 15,
    minVestingDuration: 10,
    maxVestingDuration: 365,
  };

  constructor(chainId: string) {
    this.chainId = chainId;
  }

  static getTokensNaming(name: string, symbol: string) {
    return {
      seedName: `${name} SEED`,
      seedSymbol: `seed${symbol}`,
      tgeName: `${name} PRESALE`,
      tgeSymbol: `sale${symbol}`,
      tokenName: name,
      tokenSymbol: symbol,
      xName: `x${name}`,
      xSymbol: `x${symbol}`,
      daoName: `${name} DAO`,
      daoSymbol: `${symbol}_DAO`,
    };
  }

  static isLiveDAO(phase: LifecyclePhase) {
    return [
      LifecyclePhase.LIVE_CLIFF,
      LifecyclePhase.LIVE_VESTING,
      LifecyclePhase.LIVE,
    ].includes(phase);
  }

  /**
   * Create new DAO
   * @throws Error
   */
  createDAO(
    name: string,
    symbol: string,
    activity: Activity[],
    params: IDAOParameters,
    funding: IFunding[],
    metaDataLocation?: string,
  ): IDAOData {
    const dao: IDAOData = {
      phase: LifecyclePhase.DRAFT,
      name,
      symbol,
      activity,
      socials: [],
      images: {},
      deployments: {},
      units: [],
      params,
      chainSettings: {
        [this.chainId]: {
          bbRate: 50,
        },
      },
      initialChain: chains[this.chainId].name,
      funding,
      vesting: [],
      governanceSettings: {},
      deployer: this.from,
      salts: {},
      daoMetaDataLocation: metaDataLocation,
      unitsMetaData: [],
    };

    this.validate(dao);

    this.daos[dao.symbol] = dao;
    this.usedSymbols[dao.symbol] = true;
    this._emit("DAO created");
    this._sendCrossChainMessage(CROSS_CHAIN_MESSAGE.NEW_DAO_SYMBOL, {
      symbol,
    });
    return dao;
  }

  /** Add live compatible DAO */
  addLiveDAO(dao: IDAOData) {
    // todo _onlyVerifier
    this.validate(dao);
    this.daos[dao.symbol] = dao;
    this.usedSymbols[dao.symbol] = true;
    this._emit("DAO created");
    this._sendCrossChainMessage(CROSS_CHAIN_MESSAGE.NEW_DAO_SYMBOL, {
      symbol: dao.symbol,
    });
  }

  getDAOMetaData(
    daoMetaData: { [symbolLowerCase: string]: IDAOMetaData },
    symbol: string,
  ): IDAOMetaData {
    const dao = this.getDAO(symbol);
    if (dao.daoMetaDataLocation === "local") {
      return daoMetaData[symbol.toLowerCase()] as IDAOMetaData;
    }
    return {};
  }

  /** Change lifecycle phase of a DAO */
  changePhase(symbol: string) {
    // anybody can call this

    const dao = this.getDAO(symbol);
    const currentTasks = this.tasks(symbol);
    if (currentTasks.length > 0) {
      throw new Error("SolveTasksFirst");
    }

    if (dao.phase === LifecyclePhase.DRAFT) {
      const seed = dao.funding[this.getFundingIndex(symbol, FundingType.SEED)];
      if (seed.start > this.blockTimestamp) {
        throw new Error("WaitFundingStart");
      }
      // SEED can be started not later than 1 week after must start
      // todo settings.maxSeedStartDelay
      if (
        seed.start < this.blockTimestamp &&
        this.blockTimestamp - seed.start > 7 * 86400
      ) {
        throw new Error("TooLateSoSetupFundingAgain");
      }
      /*// SEED can be started not later than 1 week before end
      if (seed.end - this.blockTimestamp < 7 * 86400) {
        throw new Error("TooLateSoSetupFundingAgain")
      }*/

      // deploy seedToken
      this.daos[symbol].deployments[this.chainId] = {
        [ContractIndices.SEED_TOKEN_1]: "0xProxyDeployed",
      };

      this.daos[symbol].phase = LifecyclePhase.SEED;
    } else if (dao.phase === LifecyclePhase.SEED) {
      const seed = dao.funding[this.getFundingIndex(symbol, FundingType.SEED)];
      if (seed.end > this.blockTimestamp) {
        throw new Error("WaitFundingEnd");
      }

      const sucess = seed.raised >= seed.minRaise;

      if (sucess) {
        this.daos[symbol].phase = LifecyclePhase.DEVELOPMENT;
      } else {
        // send all raised back to seeders

        this.daos[symbol].phase = LifecyclePhase.SEED_FAILED;
      }
    } else if (dao.phase === LifecyclePhase.DEVELOPMENT) {
      const tge = dao.funding[this.getFundingIndex(symbol, FundingType.TGE)];
      if (tge.start > this.blockTimestamp) {
        throw new Error("WaitFundingStart");
      }

      // deploy tgeToken
      this.daos[symbol].deployments[this.chainId][ContractIndices.TGE_TOKEN_2] =
        "0xProxyDeployedTge";

      this.daos[symbol].phase = LifecyclePhase.TGE;
    } else if (dao.phase === LifecyclePhase.TGE) {
      const tge = dao.funding[this.getFundingIndex(symbol, FundingType.TGE)];

      if (tge.end > this.blockTimestamp) {
        throw new Error("WaitFundingEnd");
      }

      const success = tge.raised >= tge.minRaise;

      if (success) {
        // deploy token, xToken, staking, daoToken
        this.daos[symbol].deployments[this.chainId][ContractIndices.TOKEN_3] =
          "0xProxyToken";
        this.daos[symbol].deployments[this.chainId][ContractIndices.X_TOKEN_4] =
          "0xProxyXToken";
        this.daos[symbol].deployments[this.chainId][ContractIndices.STAKING_6] =
          "0xProxyStaking";
        this.daos[symbol].deployments[this.chainId][
          ContractIndices.DAO_TOKEN_5
        ] = "0xProxyDAOToken";

        // todo deploy vesting contracts and allocate token

        // todo seedToken holders became xToken holders by predefined rate

        // todo deploy v2 liquidity from TGE funds at predefined price

        this.daos[symbol].phase = LifecyclePhase.LIVE_CLIFF;
      } else {
        // send all raised TGE funds back to funders

        this.daos[symbol].phase = LifecyclePhase.DEVELOPMENT;
      }
    } else if (dao.phase === LifecyclePhase.LIVE_CLIFF) {
      // if any vesting started then phase changed
      const isVestingStarted = !!dao.vesting?.filter(
        (v) => v.start < this.blockTimestamp,
      ).length;
      if (!isVestingStarted) {
        throw new Error("WaitVestingStart");
      }

      this.daos[symbol].phase = LifecyclePhase.LIVE_VESTING;
    } else if (dao.phase === LifecyclePhase.LIVE_VESTING) {
      // if any vesting started then phase changed
      const isVestingEnded = !dao.vesting?.filter(
        (v) => v.end > this.blockTimestamp,
      ).length;
      if (!isVestingEnded) {
        throw new Error("WaitVestingEnd");
      }

      this.daos[symbol].phase = LifecyclePhase.LIVE;
    } else {
      // nothing to change
      throw new Error("ForeverLive");
    }
  }

  /** @throws Error */
  updateImages(symbol: string, images: IDAOImages) {
    // check DAO symbol
    const dao = this.getDAO(symbol);

    // instant execute for DRAFT
    if (dao.phase === LifecyclePhase.DRAFT) {
      this._onlyOwnerOf(symbol);
      this._updateImages(symbol, images);
      return true;
    }

    // create proposal for other phases
    return this._proposeAction(symbol, DAOAction.UPDATE_IMAGES, {
      images,
    });
  }

  /** @throws Error */
  updateSocials(symbol: string, socials: string[]) {
    // check DAO symbol
    const dao = this.getDAO(symbol);

    // instant execute for DRAFT
    if (dao.phase === LifecyclePhase.DRAFT) {
      this._onlyOwnerOf(symbol);
      this._updateSocials(symbol, socials);
      return true;
    }

    // create proposal for other phases
    return this._proposeAction(symbol, DAOAction.UPDATE_SOCIALS, {
      socials,
    });
  }

  /** @throws Error */
  updateUnits(
    symbol: string,
    units: IUnit[],
    unitsMetaData: IUnitMetaData[],
  ): string | true {
    // check DAO symbol
    const dao = this.getDAO(symbol);

    // instant execute for DRAFT
    if (dao.phase === LifecyclePhase.DRAFT) {
      this._onlyOwnerOf(symbol);
      this._updateUnits(symbol, units, unitsMetaData);
      return true;
    }

    // create proposal for other phases
    return this._proposeAction(symbol, DAOAction.UPDATE_UNITS, {
      units,
      unitsMetaData,
    });
  }

  /** @throws Error */
  updateFunding(symbol: string, funding: IFunding): string | true {
    // check DAO symbol
    const dao = this.getDAO(symbol);

    // validate payload
    this._validateFunding(dao.phase, [funding]);

    // instant execute for DRAFT
    if (dao.phase === LifecyclePhase.DRAFT) {
      this._onlyOwnerOf(symbol);
      this._updateFunding(symbol, funding);
      return true;
    }

    // create proposal for other phases
    return this._proposeAction(symbol, DAOAction.UPDATE_FUNDING, {
      funding,
    });
  }

  private _updateSocials(symbol: string, socials: string[]) {
    this.daos[symbol].socials = socials;
    this._emit(`Action ${DAOAction.UPDATE_SOCIALS}`);
  }

  private _updateUnits(
    symbol: string,
    units: IUnit[],
    unitsMetaData: IUnitMetaData[],
  ) {
    this.daos[symbol].units = units;
    this.daos[symbol].unitsMetaData = unitsMetaData;
    this._emit(`Action ${DAOAction.UPDATE_UNITS}`);
  }

  private _updateFunding(symbol: string, funding: IFunding) {
    const dao = this.getDAO(symbol);

    const fundingExist =
      dao.funding.filter((f) => f.type === funding.type).length === 1;
    if (fundingExist) {
      const fundingIndex = this.getFundingIndex(symbol, funding.type);
      this.daos[symbol].funding[fundingIndex] = funding;
    } else {
      this.daos[symbol].funding.push(funding);
    }

    this._emit(`Action ${DAOAction.UPDATE_FUNDING}`);
  }

  updateVesting(symbol: string, vestings: IVesting[]) {
    // check DAO symbol
    const dao = this.getDAO(symbol);

    // validate
    this._validateVesting(dao.phase, vestings, this.getTgeData(dao));

    // instant execute for DRAFT
    if (dao.phase === LifecyclePhase.DRAFT) {
      this._onlyOwnerOf(symbol);
      this._updateVesting(symbol, vestings);
      return true;
    }

    // create proposal for other phases
    return this._proposeAction(symbol, DAOAction.UPDATE_VESTING, {
      vestings,
    });
  }

  fund(symbol: string, amount: number) {
    // todo settings.minFunding
    const dao = this.getDAO(symbol);
    if (dao.phase === LifecyclePhase.SEED) {
      const seedIndex = this.getFundingIndex(symbol, FundingType.SEED);
      const seed = dao.funding[seedIndex];
      if (seed.raised + amount >= seed.maxRaise) {
        throw new Error("RaiseMaxExceed");
      }

      // transfer amount of exchangeAsset to seedToken contract
      this.daos[symbol].funding[seedIndex].raised += amount;

      // mint seedToken to user

      return;
    }

    if (dao.phase === LifecyclePhase.TGE) {
      const tgeIndex = this.getFundingIndex(symbol, FundingType.TGE);
      const tge = dao.funding[tgeIndex];
      if (tge.raised + amount >= tge.maxRaise) {
        throw new Error("RaiseMaxExceed");
      }

      // transfer amount of exchangeAsset to tgeToken contract

      this.daos[symbol].funding[tgeIndex].raised += amount;

      // mint tgeToken to user

      return;
    }

    throw new Error("NotFundingPhase");
  }

  receiveVotingResults(proposalId: string, succeed: boolean) {
    const proposal = this.proposals[proposalId];
    if (!proposal) {
      throw new Error("IncorrectProposal");
    }
    if (proposal.status !== VotingStatus.VOTING) {
      throw new Error("AlreadyReceived");
    }
    this.proposals[proposalId].status = succeed
      ? VotingStatus.APPROVED
      : VotingStatus.REJECTED;

    if (succeed) {
      if (proposal.action === DAOAction.UPDATE_IMAGES) {
        this._updateImages(proposal.symbol, proposal.payload.images);
      }
      if (proposal.action === DAOAction.UPDATE_SOCIALS) {
        this._updateSocials(proposal.symbol, proposal.payload.socials);
      }
      if (proposal.action === DAOAction.UPDATE_UNITS) {
        this._updateUnits(
          proposal.symbol,
          proposal.payload.units,
          proposal.payload.unitsMetaData,
        );
      }
      if (proposal.action === DAOAction.UPDATE_FUNDING) {
        this._updateFunding(proposal.symbol, proposal.payload.funding);
      }
      if (proposal.action === DAOAction.UPDATE_VESTING) {
        this._updateVesting(proposal.symbol, proposal.payload.vestings);
      }
      // todo other actions
    }
  }

  /** OFF-CHAIN only **/
  /** @throws Error */
  roadmap(symbol: string): IRoadmapItem[] {
    const dao: IDAOData = this.getDAO(symbol);
    const r: IRoadmapItem[] = [];
    let tgeRun = 0;

    for (const funding of dao.funding) {
      if (funding.type === FundingType.SEED) {
        r.push({
          phase: LifecyclePhase.SEED,
          start: funding.start,
          end: funding.end,
        });
      }
      if (funding.type === FundingType.TGE) {
        // if SEED was done
        if (r.length > 0) {
          r.push({
            phase: LifecyclePhase.DEVELOPMENT,
            start: (r[0].end as number) + 1,
            end: funding.start - 1,
          });
        }

        tgeRun = funding.claim || funding.end;
        r.push({
          phase: LifecyclePhase.TGE,
          start: funding.start,
          end: tgeRun,
        });
      }
    }

    if (dao.vesting.length > 0) {
      let vestingStart = this.blockTimestamp;
      let vestingEnd = this.blockTimestamp;
      for (const vesting of dao.vesting) {
        if (vesting.start < vestingStart) {
          vestingStart = vesting.start;
        }
        if (vesting.end > vestingEnd) {
          vestingEnd = vesting.end;
        }
      }
      r.push({
        phase: LifecyclePhase.LIVE_CLIFF,
        start: tgeRun + 1,
        end: vestingStart - 1,
      });
      r.push({
        phase: LifecyclePhase.LIVE_VESTING,
        start: vestingStart,
        end: vestingEnd,
      });
      r.push({
        phase: LifecyclePhase.LIVE,
        start: vestingEnd + 1,
      });
    }

    return r;
  }

  /** @throws Error */
  tasks(symbol: string): ITask[] {
    const dao: IDAOData = this.getDAO(symbol);
    const r: ITask[] = [];

    if (dao.phase === LifecyclePhase.DRAFT) {
      // images
      if (!dao.images.seedToken || !dao.images.token) {
        r.push({
          name: "Need images of token and seedToken",
        });
      }

      // socials
      if (dao.socials.length < 2) {
        r.push({
          name: "Need at least 2 socials",
        });
      }

      // units projected
      if (dao.units.length === 0) {
        r.push({
          name: "Need at least 1 projected unit",
        });
      }
    } else if (dao.phase === LifecyclePhase.SEED) {
      const seedIndex = this.getFundingIndex(symbol, FundingType.SEED);
      if (
        dao.funding[seedIndex].raised < dao.funding[seedIndex].minRaise &&
        dao.funding[seedIndex].end > this.blockTimestamp
      ) {
        r.push({
          name: "Need attract minimal seed funding",
        });
      }
    } else if (dao.phase === LifecyclePhase.DEVELOPMENT) {
      // check funding
      const tgeExist =
        dao.funding.filter((f) => f.type === FundingType.TGE).length === 1;
      if (!tgeExist) {
        r.push({
          name: "Need add pre-TGE funding",
        });
      }

      // images
      if (!dao.images.tgeToken || !dao.images.xToken || !dao.images.daoToken) {
        r.push({
          name: "Need images of all DAO tokens",
        });
      }

      // setup vesting allocations
      if (!dao.vesting?.length) {
        r.push({
          name: "Need vesting allocations",
        });
      }

      if (
        dao.unitsMetaData?.filter(
          (unitMetaData) => unitMetaData.status === UnitStatus.LIVE,
        ).length === 0
      ) {
        r.push({
          name: "Run revenue generating units",
        });
      }
    } else if (dao.phase === LifecyclePhase.TGE) {
      const tgeIndex = this.getFundingIndex(symbol, FundingType.TGE);
      if (
        dao.funding[tgeIndex].raised < dao.funding[tgeIndex].minRaise &&
        dao.funding[tgeIndex].end > this.blockTimestamp
      ) {
        r.push({
          name: "Need attract minimal TGE funding",
        });
      }
    } else if (dao.phase === LifecyclePhase.LIVE_CLIFF) {
      // establish and improve
      // build money markets
      // bridge to chains
    } else if (dao.phase === LifecyclePhase.LIVE_VESTING) {
      // distribute vesting funds to leverage token
    }

    /*if (dao.phase === LifecyclePhase.LIVE)*/
    // lifetime revenue generating for DAO holders (till ABSORBED proposed feature)

    return r;
  }

  /** Strict on-chain validation */
  /** @throws Error */
  validate(dao: IDAOData) {
    this._validateName(dao.name);
    this._validateSymbol(dao.symbol);
    if (
      dao.params.vePeriod < this.settings.minVePeriod ||
      dao.params.vePeriod > this.settings.maxVePeriod
    ) {
      throw new Error(`VePeriod(${dao.params.vePeriod})`);
    }
    this._validatePvpFee(dao.params.pvpFee);
    if (!dao.funding.length) {
      throw new Error("NeedFunding");
    }

    // check activity are correct
    this._validateActivity(dao.activity);

    // todo: check funding array has unique funding types
    // todo: check funding dates
    // todo: check funding raise goals
  }

  /** @throws Error */
  getDAO(symbol: string): IDAOData {
    if (this.daos[symbol]) {
      return this.daos[symbol];
    }
    throw new Error("DAONotFound");
  }

  getDaoOwner(symbol: string): string {
    const dao = this.getDAO(symbol);

    if (dao.phase === LifecyclePhase.DRAFT) {
      return dao.deployer;
    }

    if (
      [
        LifecyclePhase.SEED,
        LifecyclePhase.DEVELOPMENT,
        LifecyclePhase.TGE,
      ].includes(dao.phase)
    ) {
      return dao.deployments[getChainByName(dao.initialChain).chainId][
        ContractIndices.SEED_TOKEN_1
      ] as string;
    }

    return dao.deployments[this.chainId][ContractIndices.DAO_TOKEN_5] as string;
  }

  getTgeData(dao: IDAOData): IFunding | undefined {
    const fundingExist =
      dao.funding.filter((f) => f.type === FundingType.TGE).length === 1;
    if (fundingExist) {
      const fundingIndex = this.getFundingIndex(dao.symbol, FundingType.TGE);
      return dao.funding[fundingIndex];
    }
  }

  getFundingIndex(symbol: string, type: FundingType) {
    const dao = this.getDAO(symbol);
    for (let i = 0; i < dao.funding.length; i++) {
      if (type === dao.funding[i].type) {
        return i;
      }
    }
    throw new Error("FundingNotFound");
  }

  warpDays(days: number = 7) {
    this.blockTimestamp += days * 86400;
  }

  /** @throws Error */
  private _onlyOwnerOf(symbol: string) {
    if (this.from != this.getDaoOwner(symbol)) {
      throw new Error(`YouAreNotOwnerOf(${symbol})`);
    }
  }

  private _emit(event: string) {
    this.events.push(event);
  }

  private _validateName(name: string) {
    if (
      name.length < this.settings.minNameLength ||
      name.length > this.settings.maxNameLength
    ) {
      throw new Error(`NameLength(${name.length})`);
    }
  }

  private _validateSymbol(symbol: string) {
    if (
      symbol.length < this.settings.minSymbolLength ||
      symbol.length > this.settings.maxSymbolLength
    ) {
      throw new Error(`SymbolLength(${symbol.length})`);
    }
    if (this.usedSymbols[symbol]) {
      throw new Error(`SymbolNotUnique(${symbol})`);
    }
  }

  private _validatePvpFee(pvpFee: number) {
    if (pvpFee < this.settings.minPvPFee || pvpFee > this.settings.maxPvPFee) {
      throw new Error(`PvPFee(${pvpFee})`);
    }
  }

  private _validateFunding(daoPhase: LifecyclePhase, fundings: IFunding[]) {
    Validation.validateFunding(daoPhase, fundings, this.settings);
  }

  private _validateActivity(activity: Activity[]) {
    Validation.validateActivity(activity);
  }

  private _validateVesting(
    daoPhase: LifecyclePhase,
    vestings: IVesting[],
    tge?: IFunding,
  ) {
    Validation.validateVesting(daoPhase, vestings, this.settings, tge);
  }

  private _sendCrossChainMessage(type: CROSS_CHAIN_MESSAGE, payload: any) {
    // todo some stub
  }

  private _proposeAction(
    symbol: string,
    action: DAOAction,
    payload: any,
  ): string {
    const dao = this.getDAO(symbol);

    // todo check for initial chain
    // todo get user power
    // todo check proposalThreshold
    // todo validate payload

    const proposalId = Math.round(Math.random() * Math.random()).toString();

    this.proposals[proposalId] = {
      id: proposalId,
      created: this.blockTimestamp,
      action,
      symbol,
      payload,
      status: VotingStatus.VOTING,
    };

    return proposalId;
  }

  private _updateImages(symbol: string, images: IDAOImages) {
    this.daos[symbol].images = images;
    this._emit(`Action ${DAOAction.UPDATE_IMAGES}`);
  }

  private _updateVesting(symbol: string, vestings: IVesting[]) {
    this.daos[symbol].vesting = vestings;
    this._emit(`Action ${DAOAction.UPDATE_VESTING}`);
  }
}

export enum DAOAction {
  UPDATE_IMAGES = 0,
  UPDATE_SOCIALS,
  UPDATE_NAMING,
  UPDATE_UNITS,
  UPDATE_FUNDING,
  UPDATE_VESTING,
}

enum VotingStatus {
  VOTING = 0,
  APPROVED,
  REJECTED,
}

enum CROSS_CHAIN_MESSAGE {
  NEW_DAO_SYMBOL = 0,
  DAO_RENAME_SYMBOL,
  DAO_BRIDGED,
}

interface ITask {
  name: string;
}

interface IProposal {
  id: string;
  created: number;
  symbol: string;
  action: DAOAction;
  payload: any;
  status: VotingStatus;
}

interface IRoadmapItem {
  phase: LifecyclePhase;
  start: number;
  end?: number;
}

export function getUnit(daos: IDAOData[], unitId: string): IUnit | undefined {
  for (const dao of daos) {
    for (const unit of dao.units) {
      if (unit.unitId === unitId) {
        return unit;
      }
    }
  }
}

export function getDAOUnit(
  daos: IDAOData[],
  symbol: string,
  unitId: string,
): IUnit | undefined {
  for (const dao of daos) {
    if (dao.symbol.toLowerCase() === symbol.toLowerCase()) {
      for (const unit of dao.units) {
        if (unit.unitId === unitId) {
          return unit;
        }
      }
    }
  }
}

export function getDAOUnitMetaData(
  daos: IDAOData[],
  symbol: string,
  unitId: string,
): IUnitMetaData | undefined {
  for (const dao of daos) {
    if (dao.symbol.toLowerCase() === symbol.toLowerCase()) {
      for (let i = 0; i < dao.units.length; i++) {
        const unit = dao.units[i];
        if (unit.unitId === unitId) {
          return dao.unitsMetaData[i];
        }
      }
    }
  }
}

export function getUnitMetaData(
  daos: IDAOData[],
  unitId: string,
): IUnitMetaData | undefined {
  for (const dao of daos) {
    for (let i = 0; i < dao.units.length; i++) {
      const unit = dao.units[i];
      if (unit.unitId === unitId) {
        return dao.unitsMetaData[i];
      }
    }
  }
}

export interface IBridgingTokens {
  [chainId: string]: {
    tokenData: TokenData;
    bridge: `0x${string}`;
  }[];
}

export function getBridgeTokens(daos: IDAOData[]): IBridgingTokens {
  const r: IBridgingTokens = {};
  for (const dao of daos) {
    const deploymentChainIds = Object.keys(dao.deployments);
    if (deploymentChainIds.length > 1) {
      for (const chainId of deploymentChainIds) {
        const tokenAddress = dao.deployments[chainId][ContractIndices.TOKEN_3];
        const tokenBridge =
          dao.deployments[chainId][ContractIndices.TOKEN_BRIDGE_8];
        const xTokenAddress =
          dao.deployments[chainId][ContractIndices.X_TOKEN_4];
        const xTokenBridge =
          dao.deployments[chainId][ContractIndices.X_TOKEN_BRIDGE_9];

        if (tokenAddress && tokenBridge) {
          const tokenData = getTokenData(chainId, tokenAddress);
          if (tokenData) {
            if (!r[chainId]) {
              r[chainId] = [];
            }

            r[chainId].push({
              tokenData,
              bridge: tokenBridge,
            });
          }
        }

        if (xTokenAddress && xTokenBridge) {
          const tokenData = getTokenData(chainId, xTokenAddress);
          if (tokenData) {
            r[chainId].push({
              tokenData,
              bridge: xTokenBridge,
            });
          }
        }
      }
    }
  }
  return r;
}
