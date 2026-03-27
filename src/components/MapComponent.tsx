import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { getIcon } from './MapIcons';
import type { Mosque } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icon issue in react
import L from 'leaflet';
import { DefaultIcon } from './MapIcons';
L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  mosques: Mosque[];
  selectedMosque: Mosque | null;
}

// Map Updater Component to center map on selected mosque
const MapUpdater = ({ selectedMosque }: { selectedMosque: Mosque | null }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedMosque) {
      map.flyTo([selectedMosque.lat, selectedMosque.lon], 16, {
        animate: true,
        duration: 1.5
      });
    }
  }, [selectedMosque, map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ mosques, selectedMosque }) => {
  // Center roughly on Turkey
  const center: [number, number] = [39.0, 35.0];

  return (
    <div className="h-full w-full z-0 flex-1 relative">
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: '100%', width: '100%', zIndex: 10 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup
          chunkedLoading
        >
          {mosques.map((mosque) => (
            <Marker
              key={mosque.id}
              position={[mosque.lat, mosque.lon]}
              icon={getIcon(mosque.type)}
            >
              <Popup>
                <div className="text-sm p-1">
                  <h3 className="font-bold text-lg mb-1">{mosque.name}</h3>
                  <p><strong>Tür:</strong> {mosque.type}</p>
                  <p><strong>Yapım Yılı:</strong> {mosque.buildYear}</p>
                  <p className="mt-2 text-gray-600 border-t pt-2 max-w-[200px] whitespace-normal break-words">
                    {mosque.description}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        <MapUpdater selectedMosque={selectedMosque} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
