/*
 * Agent is highly abstract and high-level entity that follow role directives.
 * Agents are owned by DAOs built on Host.
 */

export interface IAgent {
  api: string[];
  roles: AgentRole[];
  name: string;
  unitIds: string[];
  directives?: string[];
  image?: string;
  telegram?: `@${string}`;
}

export const enum AgentRole {
  API_OPERATOR = "API_OPERATOR",
  TX_SENDER = "TX_SENDER",
  MEV_SEARCHER = "MEV_SEARCHER",
}
