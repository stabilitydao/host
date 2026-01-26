import {
  ChainName,
  getChainByName,
  chains,
  ChainStatus,
  chainStatusInfo,
  getChainImage,
  STATIC_BASE_URL,
} from "../src";

describe("testing chains", () => {
  test("getChainByName", () => {
    let s = getChainByName(ChainName.POLYGON);
    expect(s.name).toEqual("Polygon");
    const t = () => {
      s = getChainByName("incorrect" as ChainName);
    };
    expect(t).toThrow(Error);
  });
  test("chains, chainStatusInfo", () => {
    expect(chains["2046399126"].status).toEqual(ChainStatus.NOT_SUPPORTED);
    expect(chainStatusInfo[ChainStatus.SUPPORTED].title).toEqual("Supported");
  });
  test("getChainImage", () => {
    expect(getChainImage("204111116399126")).toEqual(
      `${STATIC_BASE_URL}/unknown.png`,
    );
    expect(getChainImage("1")).toEqual(
      `${STATIC_BASE_URL}/chains/ethereum.svg`,
    );
  });
});
