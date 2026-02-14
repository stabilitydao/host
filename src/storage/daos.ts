import {
  ContractIndices,
  FundingType,
  HOST_DESCRIPTION,
  IDAOData,
  LifecyclePhase,
} from "../host";
import { ChainName } from "../chains";
import { Activity } from "../activity";
import { UnitStatus, UnitType } from "../host/types";

export const daos: IDAOData[] = [
  {
    phase: LifecyclePhase.DRAFT,
    name: "DAO Host",
    symbol: "HOST",
    socials: ["https://x.com/dao__host", "https://t.me/dao_host"],
    activity: [Activity.BUILDER, Activity.DEFI],
    images: {
      token: "/HOST.png",
    },
    deployments: {},
    chainSettings: {
      ["1"]: {
        bbRate: 20,
      },
    },
    initialChain: ChainName.ETHEREUM,
    units: [
      {
        unitId: "core",
      },
    ],
    params: {
      vePeriod: 180,
      pvpFee: 100,
      totalSupply: 10_000_000e18,
    },
    funding: [
      {
        type: FundingType.SEED,
        start: 1775001600, // Wednesday, 1 April 2026
        end: 1780272000, // Monday, 1 June 2026
        minRaise: 40000,
        maxRaise: 500000,
        raised: 0,
      },
      {
        type: FundingType.TGE,
        start: 1793577600, // Monday, 2 November 2026
        end: 1794182399, // Sunday, 8 November 2026, 23:59:59
        claim: 1794268800, // Tuesday, 10 November 2026
        minRaise: 400000,
        maxRaise: 1200000,
        raised: 0,
      },
    ],
    vesting: [],
    governanceSettings: {},
    deployer: "0x0",
    salts: {},
    metaDataLocation: "local",
    unitEmitData: [
      {
        name: "dao.host",
        description: HOST_DESCRIPTION,
        status: UnitStatus.BUILDING_PROTOTYPE,
        revenueShare: 100,
        type: UnitType.DEFI_PROTOCOL,
        emoji: "🍀",
        ui: [
          {
            href: "https://dao.host",
            title: "dao.host",
          },
        ],
        pool: {
          repos: [
            "stabilitydao/host",
            "stabilitydao/host-contracts",
            "stabilitydao/host-agent",
            "stabilitydao/host-ui",
          ],
          label: {
            name: "HOST:dao.host",
            description: "Building Host",
            color: "#00b243",
          },
        },
      },
    ],
  },
  {
    phase: LifecyclePhase.LIVE_VESTING,
    name: "Stability",
    symbol: "STBL",
    socials: [
      "https://x.com/stabilitydao",
      "https://discord.com/invite/R3nnetWzC9",
      "https://t.me/stabilitydao",
      "https://github.com/stabilitydao",
    ],
    activity: [Activity.DEFI],
    images: {
      tgeToken: "/saleSTBL.png",
      token: "/stbl.svg",
      xToken: "/xstbl.png",
      daoToken: "/STBL_DAO.png",
    },
    deployments: {
      ["146"]: {
        [ContractIndices.TGE_TOKEN_2]:
          "0x4D61CB8553bB5Db02DF3bdc6CDa88AA85b32224b",
        [ContractIndices.TOKEN_3]: "0x78a76316F66224CBaCA6e70acB24D5ee5b2Bd2c7",
        [ContractIndices.X_TOKEN_4]:
          "0x902215dd96a291b256a3aef6c4dee62d2a9b80cb",
        [ContractIndices.STAKING_6]:
          "0x17a7cf838a7c91de47552a9f65822b547f9a6997",
        [ContractIndices.DAO_TOKEN_5]:
          "0x77773Cb473aD1bfE991bA299a127F64b45C17777",
        [ContractIndices.REVENUE_ROUTER_21]:
          "0x23b8cc22c4c82545f4b451b11e2f17747a730810",
        [ContractIndices.RECOVERY_7]:
          "0xB8d6019eD82a9e6216c9Bf87cAf145fFe4439b40",
        // Investors
        [ContractIndices.VESTING_1_11]:
          "0x1a125ff7efdB54dc9EFB4Ad90C552C4C8822b212",
        // Foundation
        [ContractIndices.VESTING_2_12]:
          "0x8C42C261A3104cEEFBb388CFd6C1f0E7c9F22062",
        // Community
        [ContractIndices.VESTING_3_13]:
          "0xEF2CE83527FAE22E0012Efc4d64987C1a51448c5",
        // Team
        [ContractIndices.VESTING_4_14]:
          "0xe6C2AA6e67EF1B806B9Daec7147b113051a445E8",
        [ContractIndices.TOKEN_BRIDGE_8]:
          "0xD6a8b05f08834Ed2f205E3d591CD6D1A84b7C19B",
        [ContractIndices.X_TOKEN_BRIDGE_9]:
          "0x533A0c7869e36D1640D4058Bac4604DB6b4d7AD5",
      },
      ["9745"]: {
        [ContractIndices.TOKEN_3]: "0xfdf91362B7E9330F232e500c0236a02B0DE3e492",
        [ContractIndices.X_TOKEN_4]:
          "0xF40D0724599282CaF9dfb66feB630e936bC0CFBE",
        [ContractIndices.STAKING_6]:
          "0x601572b91DC054Be500392A6d3e15c690140998D",
        [ContractIndices.REVENUE_ROUTER_21]:
          "0xAf95468B1a624605bbFb862B0FB6e9C73Ad847b8",
        [ContractIndices.DAO_TOKEN_5]:
          "0x87C51aa090587790A5298ea4C2d0DBbcCD0026A6",
        [ContractIndices.TOKEN_BRIDGE_8]:
          "0xfdf91362B7E9330F232e500c0236a02B0DE3e492",
        [ContractIndices.X_TOKEN_BRIDGE_9]:
          "0x4E3F0A27bbF443Ba81FCf17E28F4100f35b1b51B",
      },
    },
    chainSettings: {
      ["137"]: {
        bbRate: 100,
        multisig: "0x36780E69D38c8b175761c6C5F8eD42E61ee490E9",
      },
      ["146"]: {
        bbRate: 100,
        multisig: "0xF564EBaC1182578398E94868bea1AbA6ba339652",
      },
      ["9745"]: {
        bbRate: 0,
        multisig: "0xE929438B5B53984FdBABf8562046e141e90E8099",
      },
      ["43114"]: {
        bbRate: 50,
        multisig: "0x06111E02BEb85B57caebEf15F5f90Bc82D54da3A",
      },
    },
    initialChain: ChainName.SONIC,
    units: [
      {
        unitId: "xstbl",
      },
      {
        unitId: "stability:stabilityFarm",
      },
      {
        unitId: "stability:stabilityMarket",
      },
    ],
    params: {
      vePeriod: 180,
      pvpFee: 80,
      minPower: 4000,
      recoveryShare: 20,
      totalSupply: 100_000_000e18,
    },
    funding: [
      {
        type: FundingType.TGE,
        start: 1740700800,
        end: 1741132800,
        minRaise: 250000,
        maxRaise: 500000,
        raised: 500000,
        claim: 1741167300,
      },
    ],
    vesting: [
      {
        name: "Investors",
        allocation: 20000000,
        start: 1756954800,
        end: 1788490800,
        address: "0x1a125ff7efdB54dc9EFB4Ad90C552C4C8822b212",
      },
      {
        name: "Foundation",
        allocation: 30000000,
        start: 1756954800,
        end: 1883098800,
        address: "0x8C42C261A3104cEEFBb388CFd6C1f0E7c9F22062",
      },
      {
        name: "Community",
        allocation: 19972000,
        start: 1756954800,
        end: 1883098800,
        address: "0xEF2CE83527FAE22E0012Efc4d64987C1a51448c5",
      },
      {
        name: "Team",
        allocation: 20000000,
        start: 1756954800,
        end: 1883098800,
        address: "0xe6C2AA6e67EF1B806B9Daec7147b113051a445E8",
      },
    ],
    governanceSettings: {
      proposalThreshold: 100_000,
      ttBribe: 10,
    },
    deployer: "0x0",
    salts: {},
    metaDataLocation: "local",
    unitEmitData: [
      {
        name: "PVP",
        description: "xSTBL exit fees",
        status: UnitStatus.LIVE,
        revenueShare: 100,
        type: UnitType.PVP,
      },
      {
        name: "VaaS",
        description: "DeFi Vault as a Service platform",
        status: UnitStatus.LIVE,
        revenueShare: 100,
        type: UnitType.DEFI_PROTOCOL,
        emoji: "🧊",
        ui: [
          {
            href: "https://stability.farm/vaults",
            title: "All Vaults",
          },
          {
            href: "https://stability.farm/metavaults",
            title: "Meta Vaults",
          },
          {
            href: "https://stability.farm/leverage-vaults",
            title: "Leverage Vaults",
          },
        ],
        pool: {
          repos: [
            "stabilitydao/stability",
            "stabilitydao/stability-contracts",
            "stabilitydao/stability-ui",
            "stabilitydao/stability-subgraph",
            "stabilitydao/stability-node-pro",
          ],
          label: {
            // symbol:unitName
            name: "STBL:VaaS",
            description: "New Stability VaaS product request / feature",
            color: "#02a3fc",
          },
        },
      },
      {
        name: "Sonic Markets",
        description: "Stability Money Markets on Sonic network (ex-Vicuna)",
        status: UnitStatus.LIVE,
        revenueShare: 25,
        type: UnitType.DEFI_PROTOCOL,
        emoji: "🏦",
        ui: [
          {
            href: "https://stability.farm/lending",
            title: "Markets",
          },
        ],
        pool: {
          repos: ["stabilitydao/lending-deploy", "stabilitydao/stability-ui"],
          label: {
            name: "STBL:Lending",
            description:
              "Lending feature, product request or maintenance issue",
            color: "#3b15d2",
          },
        },
      },
    ],
  },
  {
    phase: LifecyclePhase.DRAFT,
    name: "MEV Bot",
    symbol: "MEVBOT",
    socials: [],
    activity: [Activity.BUILDER, Activity.MEV],
    images: {
      token: "/MEVBOT.png",
    },
    deployments: {},
    chainSettings: {
      ["1"]: {
        bbRate: 50,
      },
    },
    initialChain: ChainName.ETHEREUM,
    units: [
      {
        unitId: "mevbot:ethereum",
      },
    ],
    params: {
      vePeriod: 120,
      pvpFee: 100,
      totalSupply: 1_000_000e18,
    },
    funding: [
      {
        type: FundingType.SEED,
        start: 1777593600, // Friday, 1 May 2026
        end: 1782864000, // Wednesday, 1 July 2026
        minRaise: 50000,
        maxRaise: 250000,
        raised: 0,
      },
    ],
    vesting: [],
    governanceSettings: {},
    deployer: "0x0",
    salts: {},
    metaDataLocation: "local",
    unitEmitData: [
      {
        name: "EthereumBot",
        description: "Ethereum MEV Searcher machine",
        status: UnitStatus.BUILDING_PROTOTYPE,
        revenueShare: 100,
        type: UnitType.MEV_SEARCHER,
        emoji: "🧙",
        pool: {
          repos: ["stabilitydao/mevbot"],
          label: {
            name: "MEVBOT:Ethereum",
            description: "Building MEVBOT for Ethereum chain",
            color: "#4cbaff",
          },
        },
      },
    ],
  },
];
