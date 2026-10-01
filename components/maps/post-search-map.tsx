"use client";
import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { add2040ToProfileDetailsId } from "@/utils/profile.helpers";
import { useRouter } from "next/navigation";
import SearchResultCard from "../cards/post-search-result-card";

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoib3Jpc3V1biIsImEiOiJjbTE2eXZsdWYwY2V2MmltejFlbjJzajFpIn0.5a8sMLj2eWcJykZrKji8jg';

type HoverPlacement = "top" | "bottom" | "left" | "right";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const PostMapView = ({ results }) => {
    const router = useRouter();
    const [map, setMap] = useState(null);
    const [coordinates, setCoordinates] = useState([]);
    const [hoveredProfile, setHoveredProfile] = useState(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0, placement: "top" as HoverPlacement });

    const getHoverPosition = React.useCallback((point: { x: number; y: number }, container: HTMLDivElement) => {
        const padding = 16;
        const estimatedCardHeight = 320;
        const estimatedCardWidth = Math.min(container.offsetWidth * 0.33, 420);

        const topSpace = point.y;
        const bottomSpace = container.offsetHeight - point.y;
        const leftSpace = point.x;
        const rightSpace = container.offsetWidth - point.x;
        const fitsTop = topSpace >= estimatedCardHeight + padding;
        const fitsBottom = bottomSpace >= estimatedCardHeight + padding;
        const fitsLeft = leftSpace >= estimatedCardWidth + padding;
        const fitsRight = rightSpace >= estimatedCardWidth + padding;

        let placement: HoverPlacement = "top";

        if (fitsTop || fitsBottom) {
            placement = fitsTop && (!fitsBottom || topSpace >= bottomSpace) ? "top" : "bottom";
        } else if (fitsLeft || fitsRight) {
            placement = fitsRight && (!fitsLeft || rightSpace >= leftSpace) ? "right" : "left";
        } else {
            placement = topSpace >= bottomSpace ? "top" : "bottom";
        }

        const x =
            placement === "top" || placement === "bottom"
                ? clamp(point.x, padding + estimatedCardWidth / 2, container.offsetWidth - padding - estimatedCardWidth / 2)
                : point.x;
        const y =
            placement === "left" || placement === "right"
                ? clamp(point.y, padding + estimatedCardHeight / 2, container.offsetHeight - padding - estimatedCardHeight / 2)
                : point.y;

        return { x, y, placement };
    }, []);

    const fetchAllCoordinates = async () => {
        const allCoordinates = [];

        for (const post of results) {
            if (post.BusinessLocation && post.BusinessLocation.length > 0) {
                for (const loc of post.BusinessLocation) {
                    const locationValue = loc?.name || loc?.value;
                    if (locationValue) {
                        try {
                            const response = await axios.get(
                                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationValue)}.json`,
                                {
                                    params: {
                                        access_token: mapboxgl.accessToken,
                                    },
                                }
                            );

                            if (response.data.features.length > 0) {
                                let [lng, lat] = response.data.features[0].center;
                                const coordsExist = (latCheck, lngCheck) =>
                                    allCoordinates.some(coord => coord.lat === latCheck && coord.lng === lngCheck);
                                const randomOffset = () => {
                                    const sign = Math.random() < 0.5 ? -1 : 1;
                                    return sign * (0.05 + Math.random() * 0.4);
                                };

                                // If exact lat,lng exists, add random decimal offset between 0.5 and 0.9
                                while (coordsExist(lat, lng)) {
                                    lat += randomOffset();
                                    lng += randomOffset();
                                }

                                allCoordinates.push({
                                    id: post.Id || 0,
                                    name: (post.Title ? post.Title : post.RoleSought) || 'N/A',
                                    lat: lat || 0,
                                    lng: lng || 0,
                                });
                            }
                        } catch (error) {
                            console.error("Error fetching geocode for:", locationValue, error);
                        }
                    }
                }
            }
        }

        setCoordinates(allCoordinates);
    };

    useEffect(() => {
        fetchAllCoordinates();
    }, [results]);

    useEffect(() => {
        const container = document.getElementById("map") as HTMLDivElement;
        if (container) {
            const newMap = new mapboxgl.Map({
                container: "map",
                style: "mapbox://styles/mapbox/streets-v11",
                center: coordinates.length > 0 ? [coordinates[0].lng, coordinates[0].lat] : [21.0936, 7.1881],
                zoom: 10,
            });

            coordinates.forEach(({ lng, lat, name, id }) => {
                const el = document.createElement("div");
                el.style.cursor = "pointer";
                el.innerHTML = `<div style="position: relative; display: inline-block;">
                                    <svg width="19" height="34" viewBox="0 0 19 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.38889 21.0468V31.452L8.8416 33.6447C9.15497 34.1175 9.8457 34.1175 10.1591 33.6447L11.6111 31.452V21.0468C10.9257 21.1743 10.2217 21.25 9.5 21.25C8.77826 21.25 8.07434 21.1743 7.38889 21.0468ZM9.5 0C4.25323 0 0 4.28121 0 9.5625C0 14.8438 4.25323 19.125 9.5 19.125C14.7468 19.125 19 14.8438 19 9.5625C19 4.28121 14.7468 0 9.5 0ZM9.5 5.04688C7.02604 5.04688 5.01389 7.07227 5.01389 9.5625C5.01389 10.0021 4.65896 10.3594 4.22222 10.3594C3.78549 10.3594 3.43056 10.0021 3.43056 9.5625C3.43056 6.19371 6.15389 3.45312 9.5 3.45312C9.93674 3.45312 10.2917 3.81039 10.2917 4.25C10.2917 4.68961 9.93674 5.04688 9.5 5.04688Z" fill="#2357C6"/>
                                    </svg>
                                    <div style="
                                    position: absolute;
                                    top: 50%;
                                    left: 22px;
                                    transform: translateY(-50%);
                                    background: none;
                                    padding: 0px;
                                    font-size: 15px;
                                    color: #16357A;
                                    font-weight: 700;
                                    white-space: nowrap;
                                    ">${name}</div>
                                </div>`;

                const marker = new mapboxgl.Marker(el)
                    .setLngLat([lng, lat])
                    .addTo(newMap);

                // Add a click event to the element used in the marker
                const matchedItem = results.find(item => item.Id == id);
                const matchType = matchedItem ? matchedItem.MatchType : null;

                el.addEventListener('click', () => {
                    if (!matchType) return;
                    const routeBase = matchType === 1 ? 'business-development' : 'cofounder-and-board-matcher';
                    router.push(`/${routeBase}/${add2040ToProfileDetailsId(Number(id))}`);
                });

                // Create and attach popup on hover
                el.addEventListener("mouseenter", () => {
                    const profile = results.find(r => r.Id === id);
                    if (profile && (container as HTMLDivElement)) {
                        const markerPoint = newMap.project([lng, lat]);
                        const rel = getHoverPosition(markerPoint, container as HTMLDivElement);
                        const rect = container.getBoundingClientRect();
                        setHoverPosition({
                            x: rect.left + rel.x,
                            y: rect.top + rel.y,
                            placement: rel.placement,
                        });

                        setHoveredProfile(profile);
                    }
                });
                el.addEventListener("mouseleave", () => {
                    setHoveredProfile(null);
                });
            });

            setMap(newMap);
        }

    }, [coordinates]);

    return (
        <>
            <div className="relative w-full overflow-visible" style={{ height: "700px" }}>
                <div
                    id="map"
                    className="w-full h-full rounded"
                />
            </div>
            {hoveredProfile && (
                <div
                    className="fixed z-50 w-1/3 bg-white"
                    style={{
                        left: hoverPosition.placement === "left" ? 'auto' : `${hoverPosition.x}px`,
                        right: hoverPosition.placement === "right" ? `${typeof window !== 'undefined' ? window.innerWidth - hoverPosition.x : 0}px` : 'auto',
                        top: `${hoverPosition.y}px`,
                        transform:
                            hoverPosition.placement === "top"
                                ? 'translate(-50%, calc(-100% - 12px))'
                                : hoverPosition.placement === "bottom"
                                    ? 'translate(-50%, 12px)'
                                    : hoverPosition.placement === "right"
                                        ? 'translate(-12px, -50%)'
                                        : 'translate(calc(-100% + 12px), -50%)',
                        pointerEvents: 'none',
                        maxWidth: 'calc(100vw - 32px)',
                    }}
                >
                    <SearchResultCard
                        index={hoveredProfile.id}
                        data={hoveredProfile}
                        results={results}
                    />
                </div>
            )}
        </>
    );
};

export default PostMapView;
