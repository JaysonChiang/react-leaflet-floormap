import React, { Component } from 'react';
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Map, ImageOverlay } from 'react-leaflet';

class App extends Component {

  constructor(props) {
    super(props);

    const iniBounds = L.latLngBounds(null, null);

    this.state = {
      currentZoomLevel: 0,
      url: 'https://dl.dropbox.com/s/yhrpnftsuis15z6/Topkapi_Palace_plan.svg',
      bounds: iniBounds
    };
  }

  componentDidMount() {
    const leafletMap = this.map.leafletElement;

    leafletMap.on('zoomend', () => {
      const updatedZoomLevel = leafletMap.getZoom();
      this.handleZoomLevelChange(updatedZoomLevel);
    });

    const w = 1280 * 2,
      h = 806 * 2;

    var southWest = leafletMap.unproject([0, h], leafletMap.getMaxZoom() - 1);
    var northEast = leafletMap.unproject([w, 0], leafletMap.getMaxZoom() - 1);

    var bounds = new L.LatLngBounds(southWest, northEast);
    this.setState({ bounds: bounds });
    leafletMap.setMaxBounds(bounds);
  }

  handleZoomLevelChange(newZoomLevel) {
    this.setState({ currentZoomLevel: newZoomLevel });
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
           url={this.state.url} 
           bounds={this.state.bounds} />

        </Map>
      </div>
    );
  }
}

export default App;
