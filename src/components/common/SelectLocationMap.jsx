import React, { useCallback, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

const SelectLocationMap = ({ onLocationSelect }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "YOUR_API_KEY", // replace with your key
  });

  const [selected, setSelected] = useState(null);

  const handleMapClick = useCallback(
    (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setSelected({ lat, lng });
      onLocationSelect({ lat, lng });
    },
    [onLocationSelect]
  );

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading maps...</p>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={5}
      center={defaultCenter}
      onClick={handleMapClick}
    >
      {selected && <Marker position={selected} />}
    </GoogleMap>
  );
};

export default SelectLocationMap;
