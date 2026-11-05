import Phaser from 'phaser';
import { AudioManager } from './AudioManager';
import {
  BALDI_INITIAL_DETECTION_RADIUS,
  BaldiBehaviorState,
  BaldiProximityTracker,
} from './baldiProximity';
import { BALDI_INITIAL_SPEED, computeBaldiMoveSpeedPx, GameStateManager } from './GameState';
import { BALDI_START_UNITS, SchoolNavGrid, UNIT_PX } from './MapLayout';

// Corridor and accessible hallway/room waypoints for natural school-wide roaming
export const BALDI_ROAM_WAYPOINTS: readonly { x: number; y: number }[] = [
  { x: 74, y: 54 },   // North-Central Hallway (Baldi start)
  { x: 64, y: 54 },   // Central-North corridor junction
  { x: 46, y: 32 },   // Canteen West Aisle
  { x: 24, y: 38 },   // West Corridor (North)
  { x: 24, y: 86 },   // West Corridor (Mid)
  { x: 50, y: 86 },   // Central Vending Hallway (West)
  { x: 74, y: 112 },  // Ruang Legar Utama (Foyer)
  { x: 56, y: 119 },  // Classroom A corridor approach
  { x: 38, y: 134 },  // South-West Corridor
  { x: 74, y: 134 },  // Lobi Pintu Masuk Selatan
  { x: 92, y: 119 },  // Classroom B corridor approach
  { x: 104, y: 134 }, // South-East Corridor
  { x: 136, y: 106 }, // East Wing Corridor (South)
  { x: 117, y: 91 },  // Classroom C corridor approach
  { x: 136, y: 42 },  // East Wing Corridor (North)
  { x: 117, y: 39 },  // Classroom D corridor approach
  { x: 104, y: 36 },  // Upper East Hallway
  { x: 82, y: 32 },   // Canteen East Aisle
];

export class BaldiAI {
  public readonly sprite: Phaser.Physics.Arcade.Sprite;
  private rageAura: Phaser.GameObjects.Graphics;
  private navGrid: SchoolNavGrid;
  private gameState: GameStateManager;
  private audio: AudioManager;
  private proximity: BaldiProximityTracker;

  private path: { x: number; y: number }[] = [];
  private repathTimer = 0;
  private minDynamicRepathCooldown = 0;
  private slapTimer = 0.12;
  private postAttackPauseTimer = 0;
  private pushVx = 0;
  private pushVy = 0;

  // Roaming patrol state
  private roamWaypointIdx = 0;
  private roamWaitTimer = 0;
  private wasChasingBefore = false;

  // Player direction & goal tracking for reactive live path updates
  private lastGoalUnitsX = -999;
  private lastGoalUnitsY = -999;
  private prevPlayerX = -999;
  private prevPlayerY = -999;
  private lastPlannedPlayerDirX = 0;
  private lastPlannedPlayerDirY = 0;
  private lastLockedCount = -1;

  // Stuck detection & recovery
  private sampleAnchorX = 0;
  private sampleAnchorY = 0;
  private sampleTimer = 0;
  private recoverySlideTimer = 0;
  private recoveryVx = 0;
  private recoveryVy = 0;

  // Furious 7/7 visual state & applied movement speed tracking
  private isFuriousVisual = false;
  private auraPulse = 0;
  private currentMoveSpeedPx = computeBaldiMoveSpeedPx(BALDI_INITIAL_SPEED);

  constructor(
    scene: Phaser.Scene,
    navGrid: SchoolNavGrid,
    gameState: GameStateManager,
    audio: AudioManager,
    initialDetectionRadius: number = gameState.getBaldiDetectionRadius() ?? BALDI_INITIAL_DETECTION_RADIUS
  ) {
    this.navGrid = navGrid;
    this.gameState = gameState;
    this.audio = audio;
    this.proximity = new BaldiProximityTracker(initialDetectionRadius);

    this.rageAura = scene.add.graphics().setDepth(15);

    this.sprite = scene.physics.add.sprite(
      BALDI_START_UNITS.x * UNIT_PX,
      BALDI_START_UNITS.y * UNIT_PX,
      'enemy_baldi'
    );
    this.sprite.setDepth(16);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    // Compact centered 16x16 body prevents snagging on doorway jambs and corners
    body.setSize(16, 16);
    body.setOffset(16, 19);

    this.sampleAnchorX = this.sprite.x;
    this.sampleAnchorY = this.sprite.y;
  }

  private clearChaseMemory(): void {
    this.path = [];
    this.repathTimer = 0;
    this.minDynamicRepathCooldown = 0;
    this.lastGoalUnitsX = -999;
    this.lastGoalUnitsY = -999;
    this.prevPlayerX = -999;
    this.prevPlayerY = -999;
    this.lastPlannedPlayerDirX = 0;
    this.lastPlannedPlayerDirY = 0;
    this.lastLockedCount = -1;
    this.sampleTimer = 0;
    this.recoverySlideTimer = 0;
    this.recoveryVx = 0;
    this.recoveryVy = 0;
  }

  public reset(): void {
    this.sprite.setPosition(BALDI_START_UNITS.x * UNIT_PX, BALDI_START_UNITS.y * UNIT_PX);
    this.sprite.setTexture('enemy_baldi');
    this.sprite.setScale(1, 1);
    this.isFuriousVisual = false;
    this.rageAura.clear();

    this.roamWaypointIdx = 0;
    this.roamWaitTimer = 0;
    this.wasChasingBefore = false;

    this.proximity.setDetectionRadius(this.gameState.getBaldiDetectionRadius());
    this.proximity.reset();
    this.clearChaseMemory();

    this.slapTimer = 0.12;
    this.postAttackPauseTimer = 0;
    this.pushVx = 0;
    this.pushVy = 0;

    this.sampleAnchorX = this.sprite.x;
    this.sampleAnchorY = this.sprite.y;
    this.currentMoveSpeedPx = computeBaldiMoveSpeedPx(this.gameState.getBaldiSpeed());

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    if (body) body.setVelocity(0, 0);
  }

  private pickNearestRoamWaypoint(currentUnitsX: number, currentUnitsY: number): number {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < BALDI_ROAM_WAYPOINTS.length; i++) {
      const wp = BALDI_ROAM_WAYPOINTS[i];
      const d = Math.hypot(wp.x - currentUnitsX, wp.y - currentUnitsY);
      if (d > 2 && d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    return bestIdx;
  }

  public getDetectionRadius(): number {
    return this.proximity.getDetectionRadius();
  }

  public setDetectionRadius(radius: number): number {
    const next = this.proximity.setDetectionRadius(radius);
    this.gameState.setBaldiDetectionRadius(next);
    return next;
  }

  public isChasing(): boolean {
    return this.proximity.isChasing();
  }

  public isFinalChaseActive(): boolean {
    return this.proximity.isFinalChaseActive();
  }

  public isProximityDetectionDisabled(): boolean {
    return this.proximity.isFinalChaseActive();
  }

  public getFinalChaseActivationCount(): number {
    return this.proximity.getFinalChaseActivationCount();
  }

  public getBehaviorState(): BaldiBehaviorState {
    return this.proximity.getBehaviorState();
  }

  public getLastDistancePx(): number {
    return this.proximity.getLastDistance();
  }

  public getCurrentMoveSpeedPx(): number {
    return this.currentMoveSpeedPx;
  }

  /**
   * Immediately activates Final Chase Mode (7/7 notebooks) once and only once per run:
   * - Completely disables the proximity detection radius regardless of distance.
   * - Sets Baldi's movement speed immediately to fixed 160 (overriding previous speed progression).
   * - Computes an immediate full-school path toward the player's current position and begins pursuit.
   */
  public activateFinalChaseMode(
    playerX?: number,
    playerY?: number,
    lockedDoors: ReadonlySet<string> = new Set()
  ): boolean {
    const activatedNow = this.proximity.activateFinalChase();
    if (!activatedNow) {
      return false;
    }

    if (!this.isFuriousVisual) {
      this.isFuriousVisual = true;
      this.sprite.setTexture('enemy_baldi_furious');
    }

    // Override previous speed progression with Final Chase speed (160 -> 220.8 px/s)
    this.currentMoveSpeedPx = computeBaldiMoveSpeedPx(this.gameState.getBaldiSpeed());
    this.repathTimer = 0;
    this.minDynamicRepathCooldown = 0;

    if (playerX !== undefined && playerY !== undefined) {
      const body = this.sprite.body as Phaser.Physics.Arcade.Body | null;
      const bx = body ? body.center.x : this.sprite.x;
      const by = body ? body.center.y : this.sprite.y;
      const bUnitsX = bx / UNIT_PX;
      const bUnitsY = by / UNIT_PX;
      const playerUnitsX = playerX / UNIT_PX;
      const playerUnitsY = playerY / UNIT_PX;
      this.proximity.evaluate(bx, by, playerX, playerY, true, true);
      this.lastGoalUnitsX = playerUnitsX;
      this.lastGoalUnitsY = playerUnitsY;
      this.lastLockedCount = lockedDoors.size;
      this.path = this.navGrid.findPathOrClosestApproach(
        bUnitsX,
        bUnitsY,
        playerUnitsX,
        playerUnitsY,
        lockedDoors
      );

      if (
        body &&
        this.gameState.isBaldiPursuitActive() &&
        this.postAttackPauseTimer <= 0 &&
        Math.hypot(this.pushVx, this.pushVy) <= 15
      ) {
        let targetX = bx;
        let targetY = by;
        if (this.navGrid.hasWalkableLine(bUnitsX, bUnitsY, playerUnitsX, playerUnitsY, 0.58, lockedDoors)) {
          targetX = playerX;
          targetY = playerY;
        } else if (this.path.length > 0) {
          targetX = this.path[0].x * UNIT_PX;
          targetY = this.path[0].y * UNIT_PX;
        }
        const dx = targetX - bx;
        const dy = targetY - by;
        const dLen = Math.hypot(dx, dy);
        if (dLen > 2) {
          body.setVelocity(
            (dx / dLen) * this.currentMoveSpeedPx,
            (dy / dLen) * this.currentMoveSpeedPx
          );
        }
      }
    }

    return true;
  }

  public syncSpeedFromState(): number {
    const nextMoveSpeed = computeBaldiMoveSpeedPx(this.gameState.getBaldiSpeed());
    this.currentMoveSpeedPx = nextMoveSpeed;
    const body = this.sprite.body as Phaser.Physics.Arcade.Body | null;
    if (
      body &&
      this.proximity.isChasing() &&
      this.gameState.isBaldiPursuitActive() &&
      this.postAttackPauseTimer <= 0 &&
      Math.hypot(this.pushVx, this.pushVy) <= 15
    ) {
      const curMag = Math.hypot(body.velocity.x, body.velocity.y);
      if (curMag > 0.01) {
        body.setVelocity(
          (body.velocity.x / curMag) * nextMoveSpeed,
          (body.velocity.y / curMag) * nextMoveSpeed
        );
      }
    }
    return nextMoveSpeed;
  }

  public applyBSodaPush(vx: number, vy: number): void {
    this.pushVx = vx;
    this.pushVy = vy;
  }

  public pauseAfterAttack(seconds = 2.1, awayFromX?: number, awayFromY?: number): void {
    const isFurious = this.gameState.isFinalEscapeActive();
    this.postAttackPauseTimer = isFurious ? Math.min(seconds, 1.35) : seconds;
    if (awayFromX !== undefined && awayFromY !== undefined) {
      const dx = this.sprite.x - awayFromX;
      const dy = this.sprite.y - awayFromY;
      const len = Math.hypot(dx, dy) || 1;
      this.pushVx = (dx / len) * 250;
      this.pushVy = (dy / len) * 250;
    }
  }

  public update(
    dt: number,
    playerX: number,
    playerY: number,
    lockedDoors: ReadonlySet<string>
  ): { caughtPlayer: boolean; distanceUnits: number } {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const bx = body.center.x;
    const by = body.center.y;

    // Sync adjustable detection radius from game state (active before 7/7; bypassed in Final Chase Mode)
    this.proximity.setDetectionRadius(this.gameState.getBaldiDetectionRadius());

    const isFurious = this.gameState.isFinalEscapeActive();
    if (isFurious && !this.proximity.isFinalChaseActive()) {
      this.activateFinalChaseMode(playerX, playerY, lockedDoors);
    }

    const baldiSpeed = this.gameState.getBaldiSpeed();
    const speedMultiplier = this.gameState.getBaldiSpeedMultiplier();
    const moveSpeed = computeBaldiMoveSpeedPx(baldiSpeed);
    this.currentMoveSpeedPx = moveSpeed;

    // Update Baldi's Final Aggressive Form visual texture & crimson rage aura
    if (isFurious && !this.isFuriousVisual) {
      this.isFuriousVisual = true;
      this.sprite.setTexture('enemy_baldi_furious');
      this.repathTimer = 0;
    } else if (!isFurious && this.isFuriousVisual) {
      this.isFuriousVisual = false;
      this.sprite.setTexture('enemy_baldi');
    }

    this.rageAura.clear();
    if (isFurious) {
      this.auraPulse += dt * 7.5;
      const radius = 24 + Math.sin(this.auraPulse) * 4;
      this.rageAura.lineStyle(3, 0xef4444, 0.85);
      this.rageAura.strokeCircle(this.sprite.x, this.sprite.y + 4, radius);
      this.rageAura.fillStyle(0xdc2626, 0.22);
      this.rageAura.fillCircle(this.sprite.x, this.sprite.y + 4, radius * 0.85);
    }

    // Evaluate distance & chase state:
    // - Before 7/7: proximity detection radius applies (IDLE outside radius, CHASING inside radius).
    // - At 7/7 (Final Chase Mode): proximity radius is completely disabled; Baldi continuously chases
    //   the player's live position across the entire school map and never returns to IDLE.
    const pursuitAllowed = this.gameState.isBaldiPursuitActive();
    const prox = this.proximity.evaluate(bx, by, playerX, playerY, pursuitAllowed, isFurious);
    const distPx = prox.distance;
    const distUnits = distPx / UNIT_PX;

    if (!pursuitAllowed) {
      body.setVelocity(0, 0);
      return { caughtPlayer: false, distanceUnits: distUnits };
    }

    // Always tick post-attack cooldown timer during active gameplay
    if (this.postAttackPauseTimer > 0) {
      this.postAttackPauseTimer = Math.max(0, this.postAttackPauseTimer - dt);
    }

    // Preserve BSoda pushback wave physics
    if (Math.hypot(this.pushVx, this.pushVy) > 15) {
      body.setVelocity(this.pushVx, this.pushVy);
      this.pushVx *= Math.exp(-3.2 * dt);
      this.pushVy *= Math.exp(-3.2 * dt);
      this.sampleAnchorX = bx;
      this.sampleAnchorY = by;
      this.sampleTimer = 0;
      if (prox.isChasing) {
        this.repathTimer = 0;
      } else {
        this.clearChaseMemory();
      }
      return { caughtPlayer: false, distanceUnits: distUnits };
    }

    if (this.postAttackPauseTimer > 0) {
      body.setVelocity(0, 0);
      this.sampleAnchorX = bx;
      this.sampleAnchorY = by;
      if (prox.isChasing) {
        this.repathTimer = 0;
      } else {
        this.clearChaseMemory();
      }
      return { caughtPlayer: false, distanceUnits: distUnits };
    }

    // =========================================================================
    // ROAMING BEHAVIOUR (strictly before 7/7 when outside detection radius):
    // Baldi roams around the school naturally between hallways & accessible areas
    // using his existing pathfinding instead of standing still.
    // =========================================================================
    if (!prox.isChasing || !prox.targetPosition) {
      if (this.wasChasingBefore) {
        this.clearChaseMemory();
        this.wasChasingBefore = false;
        this.roamWaypointIdx = this.pickNearestRoamWaypoint(bx / UNIT_PX, by / UNIT_PX);
        this.roamWaitTimer = 0;
      }

      this.roamWaitTimer = Math.max(0, this.roamWaitTimer - dt);
      const curWp = BALDI_ROAM_WAYPOINTS[this.roamWaypointIdx];
      const distToRoamWpUnits = Math.hypot(curWp.x - bx / UNIT_PX, curWp.y - by / UNIT_PX);

      // Reached current roaming waypoint -> advance to next waypoint
      if (distToRoamWpUnits < 1.8) {
        this.roamWaypointIdx = (this.roamWaypointIdx + 1) % BALDI_ROAM_WAYPOINTS.length;
        this.path = [];
        this.repathTimer = 0;
      }

      const activeGoal = BALDI_ROAM_WAYPOINTS[this.roamWaypointIdx];
      this.repathTimer -= dt;

      if (this.repathTimer <= 0 || this.path.length === 0) {
        this.repathTimer = 0.55;
        this.path = this.navGrid.findPathOrClosestApproach(
          bx / UNIT_PX,
          by / UNIT_PX,
          activeGoal.x,
          activeGoal.y,
          lockedDoors
        );
        if (this.path.length === 0) {
          // If waypoint unreachable (e.g. locked door), skip to next waypoint
          this.roamWaypointIdx = (this.roamWaypointIdx + 1) % BALDI_ROAM_WAYPOINTS.length;
        }
      }

      // Safe waypoint advancement for roaming path
      const bUnitsX = bx / UNIT_PX;
      const bUnitsY = by / UNIT_PX;
      while (this.path.length > 0) {
        const wp = this.path[0];
        const distToWpPx = Math.hypot(wp.x * UNIT_PX - bx, wp.y * UNIT_PX - by);
        if (distToWpPx < 14 && this.path.length > 1) {
          this.path.shift();
          continue;
        }
        if (this.path.length >= 2) {
          const nextWp = this.path[1];
          if (this.navGrid.hasWalkableLine(bUnitsX, bUnitsY, nextWp.x, nextWp.y, 0.58, lockedDoors)) {
            this.path.shift();
            continue;
          }
        }
        break;
      }

      let roamTargetX = bx;
      let roamTargetY = by;
      if (this.navGrid.hasWalkableLine(bUnitsX, bUnitsY, activeGoal.x, activeGoal.y, 0.58, lockedDoors)) {
        roamTargetX = activeGoal.x * UNIT_PX;
        roamTargetY = activeGoal.y * UNIT_PX;
      } else if (this.path.length > 0) {
        roamTargetX = this.path[0].x * UNIT_PX;
        roamTargetY = this.path[0].y * UNIT_PX;
      } else {
        const rec = this.navGrid.findRecoveryPoint(bUnitsX, bUnitsY, lockedDoors);
        roamTargetX = rec.x * UNIT_PX;
        roamTargetY = rec.y * UNIT_PX;
      }

      // Roaming ruler slap cadence (natural pacing matching Baldi movement)
      const roamSlapInterval = Math.max(0.48, 0.88 / speedMultiplier);
      this.slapTimer -= dt;
      if (this.slapTimer <= 0) {
        this.slapTimer = roamSlapInterval;
        this.audio.playBaldiRulerSnap(distUnits, false);
        this.sprite.setScale(1.08, 0.94);
      } else {
        this.sprite.scaleX += (1 - this.sprite.scaleX) * Math.min(1, dt * 10);
        this.sprite.scaleY += (1 - this.sprite.scaleY) * Math.min(1, dt * 10);
      }

      // Roaming stuck detection
      this.sampleTimer += dt;
      if (this.sampleTimer >= 0.42) {
        const movedPx = Math.hypot(bx - this.sampleAnchorX, by - this.sampleAnchorY);
        this.sampleAnchorX = bx;
        this.sampleAnchorY = by;
        this.sampleTimer = 0;

        if (movedPx < 8.0) {
          const rec = this.navGrid.findRecoveryPoint(bUnitsX, bUnitsY, lockedDoors);
          const rdx = rec.x * UNIT_PX - bx;
          const rdy = rec.y * UNIT_PX - by;
          const rLen = Math.hypot(rdx, rdy);
          if (rLen > 1) {
            const step = Math.min(6, rLen);
            this.sprite.setPosition(
              this.sprite.x + (rdx / rLen) * step,
              this.sprite.y + (rdy / rLen) * step
            );
          }
          this.roamWaypointIdx = (this.roamWaypointIdx + 1) % BALDI_ROAM_WAYPOINTS.length;
          this.path = [];
          this.repathTimer = 0;
        }
      }

      const rdx = roamTargetX - bx;
      const rdy = roamTargetY - by;
      const rdLen = Math.hypot(rdx, rdy);
      if (rdLen > 2) {
        body.setVelocity((rdx / rdLen) * moveSpeed, (rdy / rdLen) * moveSpeed);
      } else {
        body.setVelocity(0, 0);
      }

      return { caughtPlayer: distPx < 30, distanceUnits: distUnits };
    }

    // =========================================================================
    // CHASING BEHAVIOUR (within detection radius before 7/7, OR map-wide in 7/7 Final Chase Mode):
    // =========================================================================
    this.wasChasingBefore = true;
    const livePlayerX = prox.targetPosition.x;
    const livePlayerY = prox.targetPosition.y;

    if (prox.justStartedChasing) {
      this.repathTimer = 0;
      this.minDynamicRepathCooldown = 0;
    }

    // Detect player movement direction changes for reactive live path updates
    let playerChangedDir = false;
    if (this.prevPlayerX > -900) {
      const pvx = livePlayerX - this.prevPlayerX;
      const pvy = livePlayerY - this.prevPlayerY;
      const plen = Math.hypot(pvx, pvy);
      if (plen > 1.0) {
        const ndx = pvx / plen;
        const ndy = pvy / plen;
        const dot = ndx * this.lastPlannedPlayerDirX + ndy * this.lastPlannedPlayerDirY;
        if (dot < 0.45) {
          playerChangedDir = true;
        }
      }
    }
    const curPdx = this.prevPlayerX > -900 ? livePlayerX - this.prevPlayerX : 0;
    const curPdy = this.prevPlayerY > -900 ? livePlayerY - this.prevPlayerY : 0;
    this.prevPlayerX = livePlayerX;
    this.prevPlayerY = livePlayerY;

    const playerUnitsX = livePlayerX / UNIT_PX;
    const playerUnitsY = livePlayerY / UNIT_PX;
    const goalShiftUnits = Math.hypot(
      playerUnitsX - this.lastGoalUnitsX,
      playerUnitsY - this.lastGoalUnitsY
    );
    const isBodyBlocked = !body.blocked.none;
    const lockedChanged = lockedDoors.size !== this.lastLockedCount;

    this.repathTimer -= dt;
    this.minDynamicRepathCooldown = Math.max(0, this.minDynamicRepathCooldown - dt);

    const shouldRepath =
      prox.justStartedChasing ||
      this.repathTimer <= 0 ||
      this.path.length === 0 ||
      lockedChanged ||
      (this.minDynamicRepathCooldown <= 0 &&
        (isBodyBlocked || playerChangedDir || goalShiftUnits > 0.5));

    if (shouldRepath) {
      this.repathTimer = isFurious ? 0.08 : 0.12;
      this.minDynamicRepathCooldown = 0.04;
      this.lastGoalUnitsX = playerUnitsX;
      this.lastGoalUnitsY = playerUnitsY;
      this.lastLockedCount = lockedDoors.size;
      const plen = Math.hypot(curPdx, curPdy);
      if (plen > 0.5) {
        this.lastPlannedPlayerDirX = curPdx / plen;
        this.lastPlannedPlayerDirY = curPdy / plen;
      }
      this.path = this.navGrid.findPathOrClosestApproach(
        bx / UNIT_PX,
        by / UNIT_PX,
        playerUnitsX,
        playerUnitsY,
        lockedDoors
      );
    }

    // Safe waypoint advancement with line-of-clearance smoothing
    const bUnitsX = bx / UNIT_PX;
    const bUnitsY = by / UNIT_PX;
    while (this.path.length > 0) {
      const wp = this.path[0];
      const distToWpPx = Math.hypot(wp.x * UNIT_PX - bx, wp.y * UNIT_PX - by);
      if (distToWpPx < 14 && this.path.length > 1) {
        this.path.shift();
        continue;
      }
      if (this.path.length >= 2) {
        const nextWp = this.path[1];
        if (this.navGrid.hasWalkableLine(bUnitsX, bUnitsY, nextWp.x, nextWp.y, 0.58, lockedDoors)) {
          this.path.shift();
          continue;
        }
      }
      break;
    }

    // Steer directly at live player position whenever walkable line is clear (or on final approach segment)
    let targetX = bx;
    let targetY = by;
    if (this.navGrid.hasWalkableLine(bUnitsX, bUnitsY, playerUnitsX, playerUnitsY, 0.58, lockedDoors)) {
      targetX = livePlayerX;
      targetY = livePlayerY;
    } else if (this.path.length === 1 && Math.hypot(livePlayerX - this.path[0].x * UNIT_PX, livePlayerY - this.path[0].y * UNIT_PX) < 28) {
      targetX = livePlayerX;
      targetY = livePlayerY;
    } else if (this.path.length > 0) {
      targetX = this.path[0].x * UNIT_PX;
      targetY = this.path[0].y * UNIT_PX;
    } else {
      const rec = this.navGrid.findRecoveryPoint(bUnitsX, bUnitsY, lockedDoors);
      targetX = rec.x * UNIT_PX;
      targetY = rec.y * UNIT_PX;
    }

    // Iconic ruler-slap visual & audio cadence while actively chasing
    const slapInterval = isFurious
      ? Math.max(0.22, 0.46 / speedMultiplier)
      : Math.max(0.36, 0.72 / speedMultiplier);
    this.slapTimer -= dt;
    if (this.slapTimer <= 0) {
      this.slapTimer = slapInterval;
      this.audio.playBaldiRulerSnap(distUnits, baldiSpeed >= 120 || isFurious);
      this.sprite.setScale(isFurious ? 1.2 : 1.14, isFurious ? 0.86 : 0.9);
    } else {
      this.sprite.scaleX += (1 - this.sprite.scaleX) * Math.min(1, dt * 11);
      this.sprite.scaleY += (1 - this.sprite.scaleY) * Math.min(1, dt * 11);
    }

    // Stuck detection & automatic recovery while actively chasing
    this.sampleTimer += dt;
    if (this.sampleTimer >= 0.32) {
      const movedPx = Math.hypot(bx - this.sampleAnchorX, by - this.sampleAnchorY);
      this.sampleAnchorX = bx;
      this.sampleAnchorY = by;
      this.sampleTimer = 0;

      const distToImmediateTargetPx = Math.hypot(targetX - bx, targetY - by);
      if (movedPx < 8.5 && distPx > 28 && distToImmediateTargetPx > 14) {
        const rec = this.navGrid.findRecoveryPoint(bUnitsX, bUnitsY, lockedDoors);
        const rxPx = rec.x * UNIT_PX;
        const ryPx = rec.y * UNIT_PX;
        const rdx = rxPx - bx;
        const rdy = ryPx - by;
        const rLen = Math.hypot(rdx, rdy);
        if (rLen > 1) {
          const step = Math.min(6, rLen);
          this.sprite.setPosition(
            this.sprite.x + (rdx / rLen) * step,
            this.sprite.y + (rdy / rLen) * step
          );
          this.recoveryVx = (rdx / rLen) * moveSpeed;
          this.recoveryVy = (rdy / rLen) * moveSpeed;
          this.recoverySlideTimer = 0.18;
        }
        const blockedAheadX = (bx + (targetX - bx) * 0.35) / UNIT_PX;
        const blockedAheadY = (by + (targetY - by) * 0.35) / UNIT_PX;
        const detour = this.navGrid.findDetourPath(
          rec.x,
          rec.y,
          playerUnitsX,
          playerUnitsY,
          blockedAheadX,
          blockedAheadY,
          lockedDoors
        );
        this.path =
          detour.length > 0
            ? detour
            : this.navGrid.findPathOrClosestApproach(
                rec.x,
                rec.y,
                playerUnitsX,
                playerUnitsY,
                lockedDoors
              );
      }
    }

    if (this.recoverySlideTimer > 0) {
      this.recoverySlideTimer = Math.max(0, this.recoverySlideTimer - dt);
      const recLen = Math.hypot(this.recoveryVx, this.recoveryVy);
      if (recLen > 0.01) {
        body.setVelocity(
          (this.recoveryVx / recLen) * moveSpeed,
          (this.recoveryVy / recLen) * moveSpeed
        );
      } else {
        body.setVelocity(0, 0);
      }
    } else {
      const dx = targetX - bx;
      const dy = targetY - by;
      const dLen = Math.hypot(dx, dy);
      if (dLen > 2) {
        body.setVelocity((dx / dLen) * moveSpeed, (dy / dLen) * moveSpeed);
      } else {
        body.setVelocity(0, 0);
      }
    }

    const caughtPlayer = distPx < 30;
    return { caughtPlayer, distanceUnits: distUnits };
  }
}
