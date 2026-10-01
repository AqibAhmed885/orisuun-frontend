'use client';
import React, { useEffect, useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import axios from 'axios';

interface MapComponentProps {
    address: string;
}

const MAPBOX_TOKEN = 'pk.eyJ1Ijoib3Jpc3V1biIsImEiOiJjbTE2eXZsdWYwY2V2MmltejFlbjJzajFpIn0.5a8sMLj2eWcJykZrKji8jg';

const MapComponent: React.FC<MapComponentProps> = ({ address }) => {
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    console.log('📍 MapComponent received address:', address);

    useEffect(() => {
        const fetchCoordinates = async () => {
            try {
                setLoading(true);
                setError(null);

                // Encode the address for URL
                const encodedAddress = encodeURIComponent(address);
                const response = await axios.get(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json`,
                    {
                        params: {
                            access_token: MAPBOX_TOKEN,
                            limit: 1
                        },
                    }
                );

                if (response.data.features.length === 0) {
                    throw new Error('Address not found');
                }

                const [lng, lat] = response.data.features[0].center;
                setCoordinates({ lat, lng });
            } catch (error) {
                console.error('Error fetching coordinates:', error);
                setError('Could not find location for the provided address');
            } finally {
                setLoading(false);
            }
        };

        if (address) {
            fetchCoordinates();
        }
    }, [address]);

    if (loading) return <div className="h-[400px] flex items-center justify-center">Loading map...</div>;
    if (error) return <div className="h-[400px] flex items-center justify-center text-red-500">{error}</div>;
    if (!coordinates) return <div className="h-[400px] flex items-center justify-center">No location data</div>;

    return (
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
            <Map
                mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={{
                    longitude: coordinates.lng,
                    latitude: coordinates.lat,
                    zoom: 12, // Adjusted zoom level
                    bearing: 0,
                    pitch: 0
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                reuseMaps
            >
                <NavigationControl position="top-left" />
                <Marker
                    longitude={coordinates.lng}
                    latitude={coordinates.lat}
                    anchor="bottom" // This helps with marker positioning
                >
                    <div className="relative">
                        <svg
                            width="40" // Reduced size
                            height="40"
                            viewBox="0 0 60 60"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M30.4705 17.7245C30.4705 22.4021 21.9999 34.7441 21.9999 34.7441C21.9999 34.7441 13.5293 22.4014 13.5293 17.7245C13.5293 13.0476 17.3215 9.25391 21.9999 9.25391C26.6783 9.25391 30.4705 13.0461 30.4705 17.7245Z"
                                fill="#2357C6"
                            />
                            <path
                                d="M24.8145 20.1647C26.3692 18.61 26.3692 16.0892 24.8145 14.5345C23.2597 12.9797 20.739 12.9797 19.1843 14.5345C17.6295 16.0892 17.6295 18.61 19.1843 20.1647C20.739 21.7195 23.2597 21.7195 24.8145 20.1647Z"
                                fill="white"
                            />
                        </svg>
                    </div>
                </Marker>
            </Map>
        </div>
    );
};

export default MapComponent;