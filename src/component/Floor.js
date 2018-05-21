import React, { Component } from 'react';
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Map, ImageOverlay } from 'react-leaflet';
import util from '../util/date.js'

class Floor extends Component {

    customPin = L.divIcon({
        className: 'location-pin',
        html: '<img src="https://static.robinpowered.com/roadshow/robin-avatar.png"><div class="pin"></div><div class="pulse"></div>',
        iconSize: [30, 30],
        iconAnchor: [18, 30]
    });

    constructor(props) {
        super(props);

        const iniBounds = L.latLngBounds(null, null);

        this.state = {
            currentZoomLevel: 0,
            bounds: iniBounds,
            markers: []
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

    handleAddMarker(e, map) {
        const cid = util.datetick();
        var newMarker = new L.marker(e.latlng, {
            icon: this.customPin,
            draggable: true,
            id: cid
        }).addTo(map);

        newMarker.bindPopup(`<b>LatLng</b><br>( Lat:${e.latlng.lat}, Lng:${e.latlng.lng} )`);

        newMarker.on('dragend', function (e) {

            let updatedMarkers = this.state.markers.map(m => {
                if (e.target.options.id === m.id) {
                    m.lat = e.target._latlng.lat
                    m.lng = e.target._latlng.lng
                }
                return m;
            })

            // update Marker to state 
            this.setState({ markers: updatedMarkers });

        }.bind(this));

        var myMarkder = {
            id: cid,
            lat: e.latlng.lat,
            lng: e.latlng.lng
        }

        // add Marker to state
        this.setState((prevState) => (
            { markers: [...prevState.markers, myMarkder] }
        ));
    }

    updateMarker() {

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
                        url='https://dl.dropbox.com/s/yhrpnftsuis15z6/Topkapi_Palace_plan.svg'
                        bounds={this.state.bounds} />

                </Map>
                <ol>
                    {this.state.markers.map(m => (
                        <li key={m.id}>{`[${m.id}] (${m.lat},${m.lng})`}</li>
                    ))}
                </ol>
            </div>
        );
    }
}

export default Floor;
