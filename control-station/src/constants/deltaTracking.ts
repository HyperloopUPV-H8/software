/**
 * Global constants for delta tracking functionality
 */

// Sample period in milliseconds - time between delta checks
export const DELTA_SAMPLE_PERIOD = 2000;

// Grace period in milliseconds - time to wait after no change before marking as stale
export const DELTA_GRACE_PERIOD = 1000;

// Grace period for slow-changing values (like position)
export const DELTA_GRACE_PERIOD_LONG = 1000;
