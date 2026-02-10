import { IDAOMetaData } from "../host";
import { ArtifactType } from "../activity/builder";
import { AgentRole, emptyRuntime } from "../agents";
import { UnitComponentCategory } from "../host/types";

export const daoMetaData: { [symbol: string]: IDAOMetaData } = {
  host: {
    builderActivity: {
      multisig: [
        "137:0x36780E69D38c8b175761c6C5F8eD42E61ee490E9",
        "146:0xF564EBaC1182578398E94868bea1AbA6ba339652",
        "43114:0x06111E02BEb85B57caebEf15F5f90Bc82D54da3A",
        "9745:0xE929438B5B53984FdBABf8562046e141e90E8099",
      ],
      repo: [
        "stabilitydao/stability",
        "stabilitydao/stability-contracts",
        "stabilitydao/stability-ui",
        "stabilitydao/stability-subgraph",
        "stabilitydao/lending-deploy",
        "stabilitydao/stability-node-pro",
        "stabilitydao/host",
        "stabilitydao/host-contracts",
        "stabilitydao/host-agent",
        "stabilitydao/host-ui",
      ],
      burnRate: [
        {
          period: "Sep, 2025",
          usdAmount: 32200,
        },
        {
          period: "Oct, 2025",
          usdAmount: 31100,
        },
        {
          period: "Nov, 2025",
          usdAmount: 31345,
        },
      ],
      workers: [
        {
          github: "a17",
          rate: 65,
        },
        {
          github: "iammrjude",
          rate: 20,
        },
        {
          github: "omriss",
          rate: 50,
        },
        {
          github: "DevTeaLeaf",
          rate: 25,
        },
        {
          github: "nikita-dogil",
          rate: 26,
        },
      ],
      conveyors: [
        {
          unitId: "stability:stabilityFarm",
          componentCategory: UnitComponentCategory.DEFI_STRATEGY,
          name: "Strategies",
          symbol: "📜",
          type: "Task",
          label: {
            name: "conveyor:STRATEGY",
            description:
              "Developing and deploying a new DeFi asset management strategy on the **Strategies** conveyor belt.",
            color: "#cc02ff",
          },
          issueTitleTemplate:
            "📜 %STRATEGY_SHORT_ID% | %STRATEGY_ID%: %STEP_NAME%",
          taskIdIs: "%STRATEGY_SHORT_ID%",
          description: "Implement and integrate new strategy smart contract",
          steps: [
            {
              name: "Prepare",
              issues: [
                {
                  repo: "stabilitydao/stability",
                  issueTemplate: "strategy.md",
                },
              ],
              artifacts: [ArtifactType.URL_RELEASE],
            },
            {
              name: "Contract",
              issues: [
                {
                  repo: "stabilitydao/stability-contracts",
                  generator: "yarn issue",
                },
              ],
              artifacts: [ArtifactType.CONTRACT_ADDRESS],
            },
            {
              name: "Integrate",
              issues: [
                {
                  repo: "stabilitydao/stability",
                  taskList: [
                    "Setup platform in chains",
                    "Add farms / strategy init params",
                    "Deploy vaults",
                    "Do post setup (toggleDistributorOperator, etc)",
                    "Add all necessary tokens to `src/stability.tokenlist.json`, `src/assets.ts`",
                    "Set status READY to strategy in `src/strategies.ts`",
                  ],
                },
              ],
              artifacts: [ArtifactType.URL_RELEASE],
            },
            {
              name: "Backend",
              issues: [
                {
                  repo: "stabilitydao/stability-node-pro",
                  taskList: ["Update library"],
                },
              ],
            },
            {
              name: "Frontend",
              issues: [
                {
                  repo: "stabilitydao/stability-ui",
                  taskList: [
                    "Update library",
                    "Generate and fill new vault OG images",
                  ],
                },
              ],
            },
          ],
        },
        {
          unitId: "stability:stabilityFarm",
          componentCategory: UnitComponentCategory.CHAIN_SUPPORT,
          name: "Chains",
          symbol: "⛓️",
          type: "Task",
          label: {
            name: "conveyor:CHAIN",
            description: "Chain integration by Chains conveyor",
            color: "#b1dc13",
          },
          issueTitleTemplate: "⛓️ %CHAIN_NAME% [%CHAIN_ID%]: %STEP_NAME%",
          taskIdIs: "%CHAIN_NAME%",
          description: "Add chain support",
          steps: [
            {
              name: "Prepare",
              issues: [
                {
                  repo: "stabilitydao/stability",
                  taskList: [
                    "Add chain image to static repo",
                    "add new chain to `src/chains.ts` with status `ChainStatus.DEVELOPMENT`",
                    "fill multisig",
                    "fill assets",
                    "fill integrations",
                  ],
                },
              ],
              artifacts: [ArtifactType.URL_RELEASE],
            },
            {
              name: "Contracts",
              issues: [
                {
                  repo: "stabilitydao/stability-contracts",
                  generator:
                    "🎇 Run `yarn issue` in library repo, fill issue id to `src/chains.ts`.",
                },
              ],
              artifacts: [ArtifactType.CONTRACT_ADDRESS],
            },
            {
              name: "Subgraph",
              issues: [
                {
                  repo: "stabilitydao/stability-subgraph",
                  taskList: ["add chain support", "deploy subgraph"],
                },
              ],
              result: "subgraph endpoint url",
            },
            {
              name: "Deployment",
              issues: [
                {
                  repo: "stabilitydao/stability",
                  taskList: ["Add chain to `src/deployments.ts`"],
                },
              ],
              artifacts: [ArtifactType.URL_RELEASE],
            },
            {
              name: "Backend",
              issues: [
                {
                  repo: "stabilitydao/stability-node-pro",
                  taskList: ["Show chain in API", "Setup TxSender"],
                },
              ],
              result: "API reply has chain data",
            },
            {
              name: "Frontend",
              issues: [
                {
                  repo: "stabilitydao/stability-ui",
                  taskList: [
                    "add chain support to dapp",
                    "show chain in vaults filter",
                  ],
                },
              ],
              result: "beta UI show chain",
            },
          ],
        },
      ],
      pools: [
        {
          unitIds: ["core"],
          name: "Host",
          label: {
            name: "HOST:dao.host",
            description: "Building Host",
            color: "#00b243",
          },
        },
        {
          // deprecated: Pool setup must be in `IUnitMetaData`
          unitIds: ["stability:stabilityFarm"],
          // deprecated
          name: "VaaS",
          label: {
            // symbol:unitName
            name: "STBL:VaaS",
            description: "New Stability VaaS product request / feature",
            color: "#02a3fc",
          },
          //description: "Build CVault, MetaVault, Lending market",
          artifacts: [ArtifactType.URL_UI],
        },
        {
          // deprecated
          unitIds: ["stability:stabilityMarket"],
          // deprecated
          name: "Lending",
          label: {
            name: "STBL:Lending",
            description:
              "Lending feature, product request or maintenance issue",
            color: "#3b15d2",
          },
        },
      ],
    },
    agents: [
      {
        roles: [AgentRole.OPERATOR],
        name: "Host Operator",
        image: "BUILDER.png",
        ...emptyRuntime,
        api: [],
      },
    ],
  },
  stbl: {
    agents: [
      {
        roles: [AgentRole.OPERATOR],
        name: "Stability Operator",
        telegram: "@stability_dao_bot",
        image: "OPERATOR.png",
        ...emptyRuntime,
        api: ["https://api.stability.farm", "https://api.stabilitydao.org"],
      },
    ],
  },
  mevbot: {
    builderActivity: {
      multisig: [],
      repo: ["stabilitydao/mevbot"],
      pools: [],
      conveyors: [],
      burnRate: [],
      workers: [
        {
          github: "a17",
        },
        {
          github: "iammrjude",
        },
      ],
    },
    agents: [
      {
        roles: [AgentRole.OPERATOR],
        name: "MEV Earner",
        ...emptyRuntime,
        api: [],
      },
    ],
  },
};
