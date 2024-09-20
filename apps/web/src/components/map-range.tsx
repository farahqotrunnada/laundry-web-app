import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import * as React from 'react';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { DEFAULT_LOCATION } from '@/lib/constant';
import { Icon } from 'leaflet';
import { Location } from '@/types/location';
import { cn } from '@/lib/utils';

interface MapProps {
  center?: Location;
  points?: Array<{
    latitude: number;
    longitude: number;
    name: string;
  }>;
  className?: string;
}

const UserIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapRange: React.FC<MapProps> = ({ center = DEFAULT_LOCATION, points = [], className }) => {
  const [map, setMap] = React.useState<any>(null);

  React.useEffect(() => {
    if (map) map.flyTo([center.latitude, center.longitude, 15]);
  }, [map, center]);

  return (
    <MapContainer
      zoom={15}
      ref={setMap}
      scrollWheelZoom={false}
      center={[center.latitude, center.longitude]}
      className={cn('w-full border rounded-lg z-0', className)}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={[center.latitude, center.longitude]} icon={UserIcon}>
        <Popup>Your Location</Popup>
      </Marker>
      {points.map((point, index) => (
        <Marker key={index} position={[point.latitude, point.longitude]}>
          <Popup>{point.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapRange;
