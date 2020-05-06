/**
 * A leaflet plugin for animating a moving marker along a polyline
 *
 * Original source: https://github.com/ewoken/Leaflet.MovingMarker/blob/master/MovingMarker.js
 * Plugin docs: https://github.com/Leaflet/Leaflet/blob/master/PLUGIN-GUIDE.md#plugin-api
 */

import * as L from "leaflet";

// Manually define marker icon b/c parcel doesn't know how to replace the url properly in the bundle
// See: https://stackoverflow.com/a/57093376/4668680
const markerIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  // specify the path here
  iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png",
});

enum State {
  NOT_STARTED = 0,
  ENDED = 1,
  PAUSED = 2,
  RUNNING = 3,
}

interface MovingMarkerOptions extends L.MarkerOptions {
  autostart?: boolean;
  loop?: boolean;
}

export default class MovingMarker extends L.Marker {
  private _latlngs: L.LatLng[];
  private _durations: number[];
  private _options: MovingMarkerOptions = { autostart: false, loop: false };

  private _state: State = State.NOT_STARTED;
  private _startTime: number = 0;
  private _startTimeStamp: number = 0;
  private _pauseStartTime: number = 0;
  private _animId: number = 0;
  private _animRequested: boolean = false;
  private _currentIndex: number = 0;
  private _currentLine: Array<L.LatLng> = [];
  private _currentDuration: number = 0;
  private _stations = {};

  constructor(
    latlngs: L.LatLngTuple[],
    durations: number | number[] = 5000,
    options?: MovingMarkerOptions
  ) {
    super(latlngs[0], options);

    // Manually set marker
    this.setIcon(markerIcon);

    this._latlngs = latlngs.map((e) => L.latLng(e));
    if (options !== undefined) {
      this._options = options;
    }

    // If duration options aren't generate them with a sensible default
    if (Array.isArray(durations)) {
      this._durations = durations;
    } else {
      this._durations = this._generateDurations(durations);
    }
  }

  _generateDurations(duration: number) {
    const lastIndex = this._latlngs.length - 1;
    const distances = [];
    let totalDistance = 0;

    for (let i = 0; i < lastIndex; i++) {
      const distance = this._latlngs[i + 1].distanceTo(this._latlngs[i]);
      distances.push(distance);
      totalDistance += distance;
    }

    const ratioDuration = duration / totalDistance;
    const durations = distances.map((distance) => distance * ratioDuration);

    return durations;
  }

  isRunning(): boolean {
    return this._state === State.RUNNING;
  }

  isEnded(): boolean {
    return this._state === State.ENDED;
  }

  isStarted = (): boolean => this._state !== State.NOT_STARTED;

  isPaused = (): boolean => this._state === State.PAUSED;

  start(): void {
    if (this.isRunning()) {
      return;
    }

    if (this.isPaused()) {
      this.resume();
    } else {
      this._loadLine(0);
      this._startAnimation();
      this.fire("start");
    }
  }

  resume() {
    if (!this.isPaused()) {
      return;
    }
    // update the current line
    this._currentLine[0] = this.getLatLng();
    this._currentDuration -= this._pauseStartTime - this._startTime;
    this._startAnimation();
  }

  pause() {
    if (!this.isRunning()) {
      return;
    }

    this._pauseStartTime = Date.now();
    this._state = State.PAUSED;
    this._stopAnimation();
    this._updatePosition();
  }

  stop(elapsedTime: number) {
    if (this.isEnded()) {
      return;
    }

    this._stopAnimation();

    if (typeof elapsedTime === "undefined") {
      // user call
      elapsedTime = 0;
      this._updatePosition();
    }

    this._state = State.ENDED;
    this.fire("end", { elapsedTime: elapsedTime });
  }

  _startAnimation(): void {
    this._state = State.RUNNING;
    this._animId = L.Util.requestAnimFrame(
      (timestamp) => {
        this._startTime = Date.now();
        this._startTimeStamp = timestamp;
        this._animate(timestamp);
      },
      this,
      true
    );
    this._animRequested = true;
  }

  _resumeAnimation() {
    if (!this._animRequested) {
      this._animRequested = true;
      this._animId = L.Util.requestAnimFrame(
        (timestamp) => this._animate(timestamp),
        this,
        true
      );
    }
  }

  _stopAnimation() {
    if (this._animRequested) {
      L.Util.cancelAnimFrame(this._animId);
      this._animRequested = false;
    }
  }

  _interpolatePosition(p1: L.LatLng, p2: L.LatLng, t: number): L.LatLng {
    const k = t / this._currentDuration;
    // k = k > 0 ? k : 0;
    // k = k > 1 ? 1 : k;

    // Clamp k b/t 0 and 1
    const kClamped = Math.min(Math.max(k, 0), 1);
    return L.latLng(
      p1.lat + kClamped * (p2.lat - p1.lat),
      p1.lng + kClamped * (p2.lng - p1.lng)
    );
  }

  _updatePosition() {
    const elapsedTime = Date.now() - this._startTime;
    this._animate(this._startTimeStamp + elapsedTime, true);
  }

  _loadLine(index: number): void {
    this._currentIndex = index;
    this._currentDuration = this._durations[index];
    this._currentLine = this._latlngs.slice(index, index + 2);
  }

  _updateLine(timestamp: number): number | null {
    // time elapsed since the last latlng
    let elapsedTime = timestamp - this._startTimeStamp;

    // not enough time to update the line
    if (elapsedTime <= this._currentDuration) {
      return elapsedTime;
    }

    let lineIndex = this._currentIndex;
    let lineDuration = this._currentDuration;
    let stationDuration;

    while (elapsedTime > lineDuration) {
      // substract time of the current line
      elapsedTime -= lineDuration;
      // stationDuration = this._stations[lineIndex + 1];

      // test if there is a station at the end of the line
      if (stationDuration !== undefined) {
        if (elapsedTime < stationDuration) {
          this.setLatLng(this._latlngs[lineIndex + 1]);
          return null;
        }
        elapsedTime -= stationDuration;
      }

      lineIndex++;

      // test if we have reached the end of the polyline
      if (lineIndex >= this._latlngs.length - 1) {
        if (this._options.loop) {
          lineIndex = 0;
          this.fire("loop", { elapsedTime });
        } else {
          // place the marker at the end, else it would be at
          // the last position
          this.setLatLng(this._latlngs[this._latlngs.length - 1]);
          this.stop(elapsedTime);
          return null;
        }
      }
      lineDuration = this._durations[lineIndex];
    }

    this._loadLine(lineIndex);
    this._startTimeStamp = timestamp - elapsedTime;
    this._startTime = Date.now() - elapsedTime;
    return elapsedTime;
  }

  _animate(timestamp: number, noRequestAnim: boolean = false): void {
    this._animRequested = false;

    // find the next line and compute the new elapsedTime
    const elapsedTime = this._updateLine(timestamp);

    if (this.isEnded()) {
      // no need to animate
      return;
    }

    if (elapsedTime != null) {
      // compute the position
      const p = this._interpolatePosition(
        this._currentLine[0],
        this._currentLine[1],
        elapsedTime
      );
      this.setLatLng(p);
    }

    if (!noRequestAnim) {
      this._animId = L.Util.requestAnimFrame(this._animate, this, false);
      this._animRequested = true;
    }
  }
}

L.movingMarker = (
  latLngs: L.LatLngTuple[],
  durations: number[],
  options: MovingMarkerOptions
) => new MovingMarker(latLngs, durations, options);
