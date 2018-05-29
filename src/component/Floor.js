import React, { Component } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Map, ImageOverlay, Marker, Popup } from 'react-leaflet'
import Control from 'react-leaflet-control';
import util from '../util/date.js'
import camera from '../image/icon/camera.png'
import f1 from '../image/floormap/1f.png'
import b1 from '../image/floormap/b1.png'

/* robinpowered */
class Floor extends Component {

    customPin = L.divIcon({
        className: 'location-pin',
        html: `<img src=${camera}><div class="pin"></div><div class="pulse"></div>`,
        iconSize: [40, 40],
        iconAnchor: [24, 40]
    });

    constructor(props) {
        super(props);

        const iniBounds = L.latLngBounds(null, null);

        this.state = {
            currentZoomLevel: 0,
            bounds: iniBounds,
            targetFloor: 'delta_f1',
            floors: {
                delta_f1: {
                    name: 'F1',
                    image: f1,
                    markers: []
                },
                delta_b1: {
                    name: 'B1',
                    image: b1,
                    markers: []
                }
            }
        };
    }

    componentDidMount() {
        const map = this.map.leafletElement;

        map.on('zoomend', () => {
            const updatedZoomLevel = map.getZoom();
            this.handleZoomLevelChange(updatedZoomLevel);
        });

        map.on('click', (e) => {
            this.handleAddMarker(e, map);
            //this.handleChangeFloor();
        });

        const w = 1280 * 2,
            h = 806 * 2;

        const southWest = map.unproject([0, h], map.getMaxZoom() - 1);
        const northEast = map.unproject([w, 0], map.getMaxZoom() - 1);

        const bounds = new L.LatLngBounds(southWest, northEast);
        this.setState({ bounds: bounds });
        map.setMaxBounds(bounds);
    }

    componentDidUpdate() {
        console.log(this.state);
    }

    handleZoomLevelChange(newZoomLevel) {
        this.setState({ currentZoomLevel: newZoomLevel });
    }

    handleChangeFloor(e) {
        this.setState({ targetFloor: e.target.dataset.floor });
    }

    handleAddMarker(e, map) {
        const cid = util.datetick();

        var _marker = {
            id: cid,
            lat: e.latlng.lat,
            lng: e.latlng.lng
        }

        // add Marker to state
        let _floors = Object.assign({}, this.state.floors);
        _floors[this.state.targetFloor].markers = [..._floors[this.state.targetFloor].markers, _marker];

        this.setState({
            floors: _floors
        })
    }

    updateMarkerPosition(e) {

        const { lat, lng } = e.target.getLatLng()

        let updatedMarkers = this.state.floors[this.state.targetFloor].markers.map(m => {
            if (m.id === e.target.options.id) {
                m.lat = lat
                m.lng = lng
            }
            return m;
        })

        // update Marker to state 
        this.setState({ markers: updatedMarkers });
    }

    render() {

        window.console.log('this.state.currentZoomLevel ->', this.state.currentZoomLevel);

        return (
            <div className="App">

                <Map ref={m => { this.map = m; }}
                    center={[0, 0]}
                    zoom={1}
                    minZoom={1}
                    maxZoom={4}
                    crs={L.CRS.Simple}
                    attributionControl={false}
                >

                    <ImageOverlay
                        url={this.state.floors[this.state.targetFloor].image}
                        bounds={this.state.bounds} >

                        {this.state.floors[this.state.targetFloor].markers.map(m =>
                            <Marker
                                key={m.id}
                                id={m.id}
                                draggable={true}
                                onDragend={this.updateMarkerPosition.bind(this)}
                                position={[m.lat, m.lng]}
                                icon={this.customPin}>
                                <Popup minWidth={90}>
                                    <span> Lat:{m.lat}, Lng:{m.lng} </span>
                                </Popup>
                            </Marker>

                        )}

                    </ImageOverlay>

                    <Control position="topright">
                        <div style={{ backgroundColor: 'black', padding: '5px', }}>
                            <button onClick={this.handleChangeFloor.bind(this)} data-floor="delta_f1">F1</button>
                            <button onClick={this.handleChangeFloor.bind(this)} data-floor="delta_b1">B1</button>
                        </div>
                    </Control>

                </Map>
                <ol>
                    {this.state.floors[this.state.targetFloor].markers.map(m => (
                        <li key={m.id}>{`[${m.id}] (${m.lat},${m.lng})`}</li>
                    ))}
                </ol>
            </div>
        );
    }
}


export default Floor;
