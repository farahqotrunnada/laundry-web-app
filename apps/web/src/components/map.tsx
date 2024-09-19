import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import * as React from 'react';

import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

import { DEFAULT_LOCATION } from '@/lib/constant';
import { Location } from '@/types/location';
import { cn } from '@/lib/utils';

interface MapProps {
  location?: Location;
  setLocation: (location: Location) => void;
  className?: string;
}

type LatLng = {
  lat: number;
  lng: number;
  alt?: number;
};

interface MapEventProps {
  handleClick: (lngLat: LatLng) => void;
  handleLocationFound: (lngLat: LatLng) => void;
}

const MapEvent: React.FC<MapEventProps> = ({ handleClick, handleLocationFound }) => {
  useMapEvents({
    click: (e) => {
      handleClick(e.latlng);
    },
    update: (e) => {
      handleLocationFound(e.target.getCenter());
    },
  });

  return null;
};

const Map: React.FC<MapProps> = ({ location = DEFAULT_LOCATION, setLocation, className }) => {
  const [mapRef, setMapRef] = React.useState<any>(null);

  const handleClick = (latlng: LatLng) => {
    setLocation({
      latitude: latlng.lat,
      longitude: latlng.lng,
    });
  };

  React.useEffect(() => {
    if (mapRef) mapRef.flyTo([location.latitude, location.longitude], 15);
  }, [mapRef, location]);

  return (
    <MapContainer
      zoom={15}
      ref={setMapRef}
      scrollWheelZoom={false}
      center={[location.latitude, location.longitude]}
      className={cn('w-full border rounded-lg z-0', className)}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker position={[location.latitude, location.longitude]}></Marker>
      <MapEvent handleClick={handleClick} handleLocationFound={handleClick} />
    </MapContainer>
  );
};

export default Map;
