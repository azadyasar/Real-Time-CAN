import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import mapboxgl from "mapbox-gl";
const turf = require("@turf/turf");

const istCoord = {
  latitude: 40.967905,
  longitude: 29.103301
};

export default class MapChart extends Component {
  constructor(props) {
    super(props);
    console.debug("MapChart constructor");
    this.MAPBOX_ACCESS_TOKEN =
      "pk.eyJ1IjoiYXphZHlhc2FyIiwiYSI6ImNqeTdhMnhvbDBvc2ozY3EweHBnMXhhcTAifQ.eD4ZHxvtoY49nVcJ_K8gPg";
    this.routeCoordsGEO = null;

    this.currentLocationMarkerEl = document.createElement("i");
    this.currentLocationMarkerEl.className = "fa fa-2x fa-map-marker";
    this.currentLocationMarker = new mapboxgl.Marker(
      this.currentLocationMarkerEl,
      {
        draggable: false
      }
    );

    if (props.routeCoords.length > 0)
      this.currentLocationMarker.setLngLat([
        props.routeCoords[props.routeCoords.length - 1][0],
        props.routeCoords[props.routeCoords.length - 1][1]
      ]);
  }

  componentDidMount() {
    console.debug("MapChart mounted");
    mapboxgl.accessToken = this.MAPBOX_ACCESS_TOKEN;
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v10",
      center: [istCoord.longitude, istCoord.latitude],
      width: window.innerWidth,
      height: window.innerHeight,
      zoom: 10
    });

    const ctrlPoint = new MapboxGLButtonControl({
      className: "fa fa-2x fa-map-marker",
      title: "Locate",
      eventHandler: this.onCustomBtClick
    });

    this.map.addControl(ctrlPoint, "top-right");
    this.map.addControl(new mapboxgl.FullscreenControl());
    this.map.addControl(new mapboxgl.GeolocateControl());
    this.map.addControl(
      new mapboxgl.NavigationControl({ showZoom: true }),
      "top-left"
    );
    this.map.addControl(new mapboxgl.ScaleControl(), "top-right");

    this.map.on("style.load", this.onMapStyleLoad);
  }

  onCustomBtClick = event => {
    const routeCoordsLength = this.props.routeCoords.length;
    if (routeCoordsLength > 0) {
      this.map.flyTo({
        center: [
          this.props.routeCoords[routeCoordsLength - 1][0],
          this.props.routeCoords[routeCoordsLength - 1][1]
        ],
        zoom: 12
      });
    }
  };

  componentWillReceiveProps(newProps) {
    if (newProps.routeCoords.length > 1) {
      this.routeCoordsGEO = turf.lineString(newProps.routeCoords);
      if (this.map.getSource("route-source")) {
        this.map.getSource("route-source").setData(this.routeCoordsGEO);
      }
      this.currentLocationMarker.setLngLat([
        newProps.routeCoords[newProps.routeCoords.length - 1][0],
        newProps.routeCoords[newProps.routeCoords.length - 1][1]
      ]);
    }
    if (this.currentLocationMarker) {
      this.currentLocationMarker.addTo(this.map);
    }
  }

  componentWillUnmount() {
    if (this.currentLocationMarkerEl) {
      this.currentLocationMarkerEl.remove();
      this.currentLocationMarker.remove();
    }
    if (this.map) this.map.remove();
  }

  onMapStyleLoad = event => {
    this.map.addSource("route-source", {
      type: "geojson",
      data: this.routeCoordsGEO
    });

    this.map.addLayer({
      id: "mainRoute",
      type: "line",
      source: "route-source",
      layout: {
        "line-join": "round",
        "line-cap": "round"
      },
      paint: {
        "line-color": "#179dbe",
        "line-width": 4
      }
    });

    if (this.props.routeCoords.length > 2) {
      this.routeCoordsGEO = turf.lineString(this.routeCoords);
      this.map.getSource("route-source").setData(this.routeCoordsGEO);
    }

    if (this.currentLocationMarker) {
      this.currentLocationMarker.addTo(this.map);
    }
  };

  onHookBtnClick = event => {
    if (this.props.isHooked)
      // eslint-disable-next-line no-undef
      $(`#${this.props.target}`).modal("hide");
    // eslint-disable-next-line no-undef
    else $(`#${this.props.target}`).modal();
    event.preventDefault();
    event.graphTarget = this.props.graphTarget;
    event.isAlreadyHooked = this.props.isHooked;
    this.props.onHookBtnClick(event);
  };

  render() {
    return (
      <div className="card chart-card h-100">
        <div className="card-header">{this.props.title}</div>

        <div className="card-body p-0">
          <div
            id="map"
            // ref={el => (this.mapContainer = el)}
            className="map"
          />
        </div>

        <div className="card-footer p-0 py-1">
          <button
            className={classNames("btn m-2", {
              "btn-outline-primary": this.props.dataFlowPause,
              "btn-outline-secondary": !this.props.dataFlowPause
            })}
            name={this.props.graphName}
            onClick={this.props.onGraphFlowBtnClick}
          >
            {this.getContinuePauseText(this.props.dataFlowPause)}
          </button>
          <button
            className={classNames("btn m-2", {
              "btn-outline-success": !this.props.isHooked,
              "btn-outline-danger": this.props.isHooked
            })}
            name={this.props.title}
            // data-toggle="modal"
            data-target={`#${this.props.target}`}
            onClick={this.onHookBtnClick}
          >
            {this.getHookDetachText(this.props.isHooked)}
          </button>
          <button
            type="button"
            className="btn m-2 btn-outline-primary"
            name={this.props.graphTarget}
            onClick={this.props.onCleanChartDataBtnClick}
          >
            {" "}
            <i className="fa  fa-trash" name={this.props.graphTarget} />
          </button>
        </div>
      </div>
    );
  }

  /**
   *
   * @param {boolean} isFlowPaused
   */
  getContinuePauseText(isFlowPaused) {
    return isFlowPaused ? "Continue" : "Pause";
  }

  getHookDetachText(isHooked) {
    return isHooked ? "Detach" : "Hook";
  }
}

MapChart.propTypes = {
  routeCoords: PropTypes.array.isRequired,
  options: PropTypes.object,
  onGraphFlowBtnClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  graphName: PropTypes.string.isRequired,
  dataFlowPause: PropTypes.bool.isRequired,
  target: PropTypes.string.isRequired,
  onHookBtnClick: PropTypes.func.isRequired,
  graphTarget: PropTypes.string.isRequired,
  isHooked: PropTypes.bool.isRequired,
  onCleanChartDataBtnClick: PropTypes.func.isRequired
};

class MapboxGLButtonControl {
  constructor({ className = "", title = "", eventHandler }) {
    this._classname = className;
    this._title = title;
    this._eventHandler = eventHandler;
  }

  onAdd(map) {
    this._btn = document.createElement("button");
    this._btn.className = "mapboxgl-ctrl-icon " + this._classname;
    this._btn.type = "button";
    this._btn.title = this._title;
    this._btn.onclick = this._eventHandler;

    this._icn = document.createElement("i");
    this._icn.className = this._classname;
    this._btn.appendChild(this._icn);

    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this._container.appendChild(this._btn);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
