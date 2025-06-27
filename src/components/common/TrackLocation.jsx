// TrackLocation.jsx
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import ambulanceImg from "../../data/images/ambulance.png"; 
import patientImg from "../../data/images/patient.png"; 



// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Routing = ({ from, to }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !from || !to) return;

    // Initialize the routing control
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.long), L.latLng(to.lat, to.long)],
      lineOptions: {
        styles: [{ color: "#0077ff", weight: 6 }]  // Route line style
      },
      createMarker: () => null,  // Prevent markers from being added
      show: true,  // Make sure the route is shown
      addWaypoints: false,  // No additional waypoints
      draggableWaypoints: false,  // Do not allow dragging the route waypoints
      fitSelectedRoutes: true,  // Automatically adjust map zoom to fit the route
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',  // Use the correct OSRM URL
      }),
    }).addTo(map);

    // Clean up routing control on component unmount
    return () => map.removeControl(routingControl);
  }, [map, from, to]);

  return null;
};



const TrackLocation = ({ patientCoords, driverCoords }) => {

    const ambulanceIcon = new L.Icon({
        iconUrl: ambulanceImg,
        iconSize: [40, 40],       // Width, Height (adjust based on your image)
        iconAnchor: [20, 40],     // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -40],    // Where popup opens relative to icon
    });

    const patientIcon = new L.Icon({
        iconUrl: patientImg,
        iconSize: [40, 40],       // Width, Height (adjust based on your image)
        iconAnchor: [20, 40],     // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -40],    // Where popup opens relative to icon
    });

  return (
    <div style={{ height: "500px", width: "100%", marginTop: "2rem" }}>
      <MapContainer
        center={[patientCoords.lat, patientCoords.long]}
        zoom={13}
        style={{ height: "100%", width: "100%", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.2)" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={[patientCoords.lat, patientCoords.long]}  icon={patientIcon}/>
        {/* <Marker position={[driverCoords.lat, driverCoords.long]} /> */}
        <Marker position={[driverCoords.lat, driverCoords.long]} icon={ambulanceIcon}>
            <Popup>🚑 Driver</Popup>
         </Marker>

        <Polyline
          positions={[
            [patientCoords.lat, patientCoords.long],
            [driverCoords.lat, driverCoords.long],
          ]}
          pathOptions={{ color: "red" }}
        />
        <Routing from={driverCoords} to={patientCoords} />
      </MapContainer>
    </div>
  );
};

export default TrackLocation;
