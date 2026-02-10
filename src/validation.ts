import { Activity } from "./activity";
import { FundingType, IFunding, IVesting, LifecyclePhase } from "./host";
import { IOSSettings } from "./host/types";

export class Validation {
  /**
   * Ensure that the activity array does not contain duplicate activities
   * and if builder activity exist one more other activity should exist too
   * @param activity
   */
  public static validateActivity(activity: Activity[]) {
    // ensure that the activity array does not contain duplicate activities
    let set: Set<Activity> = new Set();
    for (let a of activity) {
      if (set.has(a)) {
        throw new Error("InvalidActivityCombination");
      }
      set.add(a);
    }

    // if builder activity exist one more other activity should exist too
    if (activity.length === 1 && activity.includes(Activity.BUILDER)) {
      throw new Error("SingleBuilderActivityNotAllowed");
    }
  }

  public static validateFunding(
    daoPhase: LifecyclePhase,
    fundings: IFunding[],
    settings: IOSSettings,
  ) {
    const set = new Set<FundingType>();
    for (const funding of fundings) {
      // ----------------------- Check phase
      if (
        funding.type === FundingType.SEED &&
        daoPhase !== LifecyclePhase.DRAFT
      ) {
        throw new Error("TooLateToUpdateSuchFunding");
      }
      if (
        funding.type === FundingType.TGE &&
        ![
          LifecyclePhase.DRAFT,
          LifecyclePhase.SEED,
          LifecyclePhase.DEVELOPMENT,
        ].includes(daoPhase)
      ) {
        throw new Error("TooLateToUpdateSuchFunding");
      }
      // ----------------------- Check duplicate funding types
      if (set.has(funding.type)) {
        throw new Error("InvalidFundingArray");
      }
      set.add(funding.type);

      // ----------------------- Min/max round duration
      const duration = funding.end - funding.start;
      if (
        duration < settings.minFundingDuration * 24 * 3600 ||
        duration > settings.maxFundingDuration * 24 * 3600
      ) {
        throw new Error("InvalidFundingPeriod");
      }

      // ----------------------- Min/max raise
      if (
        funding.minRaise >= funding.maxRaise ||
        funding.minRaise < settings.minFundingRaise ||
        funding.maxRaise > settings.maxFundingRaise
      ) {
        throw new Error("InvalidFundingRaise");
      }

      // start date delay is not checked
    }
  }

  public static validateVesting(
    daoPhase: LifecyclePhase,
    vestings: IVesting[],
    settings: IOSSettings,
    tge?: IFunding,
  ) {
    if (
      [
        LifecyclePhase.LIVE_CLIFF,
        LifecyclePhase.LIVE_VESTING,
        LifecyclePhase.LIVE,
      ].includes(daoPhase)
    ) {
      throw new Error("TooLateToUpdateVesting");
    }

    if (!tge?.claim) {
      if (vestings.length !== 0) {
        throw new Error("VestingNotAllowed");
      }
    } else {
      let totalAllocation = 0;
      for (const vesting of vestings) {
        // check vesting consistency
        this._validateVesting(vesting, settings, tge);
        totalAllocation += vesting.allocation;
      }

      if (totalAllocation >= 100) {
        throw new Error("TotalAllocationTooHigh");
      }
    }
  }

  private static _validateVesting(
    vesting: IVesting,
    settings: IOSSettings,
    tge: IFunding,
  ) {
    if (
      vesting.name.length < settings.minVestingNameLen ||
      vesting.name.length > settings.maxVestingNameLen
    ) {
      throw new Error(`NameLength(${vesting.name.length})`);
    }

    if (vesting.allocation === 0) {
      throw new Error("ZeroValueNotAllowed");
    }

    if (vesting.start < (tge.claim ?? 0) + settings.minCliff * 24 * 3600) {
      throw new Error("IncorrectVestingStart");
    }

    const duration = vesting.end - vesting.start;
    if (
      duration < settings.minVestingDuration * 24 * 3600 ||
      duration > settings.maxVestingDuration * 24 * 3600
    ) {
      throw new Error("InvalidVestingPeriod");
    }
  }
}
