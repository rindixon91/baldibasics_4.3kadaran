/**
 * Proximity-Based Detection & Final Chase State Machine for Baldi
 *
 * Before 7/7 notebooks:
 * - Uses actual Euclidean distance in Phaser world / game units between Baldi and the player.
 * - Initial detection radius defaults to 500 game units and is dynamically adjustable.
 * - Chases immediately when `distance <= detectionRadius`, tracking live player coordinates.
 * - Stops immediately and clears any target when `distance > detectionRadius` (returns to IDLE,
 *   never pursuing a last-known position).
 * - Reactivates immediately whenever the player re-enters `detectionRadius`.
 *
 * At 7/7 notebooks (Final Chase Mode):
 * - Activates immediately and only once per run.
 * - Completely disables the proximity detection radius regardless of distance across the school map.
 * - Continuously tracks the player's live current position and never returns to IDLE.
 */

export const BALDI_INITIAL_DETECTION_RADIUS = 300;
export const BALDI_MIN_SLIDER_DETECTION_RADIUS = 150;
export const BALDI_MAX_SLIDER_DETECTION_RADIUS = 1200;
export const BALDI_DETECTION_HYSTERESIS_BUFFER = 40;

export type BaldiBehaviorState = 'ROAMING' | 'CHASING';

export interface BaldiProximityEvaluation {
  distance: number;
  detectionRadius: number;
  proximityDisabled: boolean;
  finalChaseActive: boolean;
  withinRange: boolean;
  behaviorState: BaldiBehaviorState;
  isChasing: boolean;
  justStartedChasing: boolean;
  justStoppedChasing: boolean;
  targetPosition: { x: number; y: number } | null;
}

export function sanitizeDetectionRadius(radius: number): number {
  if (!Number.isFinite(radius) || radius < 0) {
    return BALDI_INITIAL_DETECTION_RADIUS;
  }
  return radius;
}

export function computeActualDistance(
  baldiX: number,
  baldiY: number,
  playerX: number,
  playerY: number
): number {
  return Math.hypot(playerX - baldiX, playerY - baldiY);
}

export function isWithinDetectionRadius(distance: number, detectionRadius: number): boolean {
  return distance <= detectionRadius;
}

export class BaldiProximityTracker {
  private detectionRadius: number;
  private behaviorState: BaldiBehaviorState = 'ROAMING';
  private lastDistance = Number.POSITIVE_INFINITY;
  private finalChaseActive = false;
  private finalChaseActivationCount = 0;
  private pendingFinalChaseStart = false;

  constructor(initialRadius: number = BALDI_INITIAL_DETECTION_RADIUS) {
    this.detectionRadius = sanitizeDetectionRadius(initialRadius);
  }

  public getDetectionRadius(): number {
    return this.detectionRadius;
  }

  public setDetectionRadius(radius: number): number {
    this.detectionRadius = sanitizeDetectionRadius(radius);
    return this.detectionRadius;
  }

  public getBehaviorState(): BaldiBehaviorState {
    return this.finalChaseActive ? 'CHASING' : this.behaviorState;
  }

  public isChasing(): boolean {
    return this.finalChaseActive || this.behaviorState === 'CHASING';
  }

  public isFinalChaseActive(): boolean {
    return this.finalChaseActive;
  }

  public getFinalChaseActivationCount(): number {
    return this.finalChaseActivationCount;
  }

  public getLastDistance(): number {
    return this.lastDistance;
  }

  /**
   * Transitions Baldi into Final Chase Mode (7/7 notebooks) immediately and at most once per run.
   * Returns `true` on the single initial activation, and `false` on any subsequent calls.
   */
  public activateFinalChase(): boolean {
    if (this.finalChaseActive) {
      return false;
    }
    const wasAlreadyChasing = this.behaviorState === 'CHASING';
    this.finalChaseActive = true;
    this.finalChaseActivationCount += 1;
    this.behaviorState = 'CHASING';
    this.pendingFinalChaseStart = !wasAlreadyChasing;
    return true;
  }

  public reset(): void {
    this.behaviorState = 'ROAMING';
    this.lastDistance = Number.POSITIVE_INFINITY;
    this.finalChaseActive = false;
    this.finalChaseActivationCount = 0;
    this.pendingFinalChaseStart = false;
  }

  public evaluate(
    baldiX: number,
    baldiY: number,
    playerX: number,
    playerY: number,
    pursuitStateAllowed = true,
    isFinalEscape = false
  ): BaldiProximityEvaluation {
    const distance = computeActualDistance(baldiX, baldiY, playerX, playerY);
    this.lastDistance = distance;

    if (isFinalEscape || this.finalChaseActive) {
      const activatedHere = !this.finalChaseActive ? this.activateFinalChase() : false;
      this.behaviorState = 'CHASING';
      const justStartedChasing =
        pursuitStateAllowed && (activatedHere || this.pendingFinalChaseStart);
      if (pursuitStateAllowed) {
        this.pendingFinalChaseStart = false;
      }
      return {
        distance,
        detectionRadius: this.detectionRadius,
        proximityDisabled: true,
        finalChaseActive: true,
        withinRange: true,
        behaviorState: 'CHASING',
        isChasing: true,
        justStartedChasing,
        justStoppedChasing: false,
        targetPosition: { x: playerX, y: playerY },
      };
    }

    // Apply hysteresis: when already chasing, require distance to exceed (detectionRadius + buffer)
    // before abandoning the chase. When roaming, player must cross detectionRadius to trigger chase.
    const effectiveExitThreshold = this.detectionRadius + BALDI_DETECTION_HYSTERESIS_BUFFER;
    const shouldChase = pursuitStateAllowed && (
      this.behaviorState === 'CHASING'
        ? distance <= effectiveExitThreshold
        : distance <= this.detectionRadius
    );

    if (shouldChase) {
      const justStartedChasing = this.behaviorState !== 'CHASING';
      this.behaviorState = 'CHASING';
      return {
        distance,
        detectionRadius: this.detectionRadius,
        proximityDisabled: false,
        finalChaseActive: false,
        withinRange: true,
        behaviorState: 'CHASING',
        isChasing: true,
        justStartedChasing,
        justStoppedChasing: false,
        targetPosition: { x: playerX, y: playerY },
      };
    }

    const justStoppedChasing = this.behaviorState === 'CHASING';
    this.behaviorState = 'ROAMING';
    return {
      distance,
      detectionRadius: this.detectionRadius,
      proximityDisabled: false,
      finalChaseActive: false,
      withinRange: false,
      behaviorState: 'ROAMING',
      isChasing: false,
      justStartedChasing: false,
      justStoppedChasing,
      targetPosition: null,
    };
  }
}
