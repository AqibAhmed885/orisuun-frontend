"use client";
import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import { add2040ToProfileDetailsId } from "@/utils/profile.helpers";
import { useRouter } from "next/navigation";
import SearchResultCard from "../cards/search-result-card";

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoib3Jpc3V1biIsImEiOiJjbTE2eXZsdWYwY2V2MmltejFlbjJzajFpIn0.5a8sMLj2eWcJykZrKji8jg';

type HoverPlacement = "top" | "bottom" | "left" | "right";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const ProfileMapView = ({ results }) => {
    console.log('🔍 ProfileMapView received results:', results);
    const router = useRouter();
    const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
    const [coordinates, setCoordinates] = useState([]);
    const [hoveredProfile, setHoveredProfile] = useState(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0, placement: "top" as HoverPlacement });

    const getHoverPosition = React.useCallback((point: { x: number; y: number }, container: HTMLDivElement) => {
        const padding = 16;
        const estimatedCardHeight = 320;
        const estimatedCardWidth = Math.min(container.offsetWidth * 0.4, 420);

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

    const fetchAllCoordinates = React.useCallback(async () => {
        const allCoordinates = [];

        for (const profile of results) {
            if (profile.UserAddress && profile.UserAddress.trim() !== "") {
                try {
                    const response = await axios.get(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(profile.UserAddress)}.json?access_token=${mapboxgl.accessToken}`,
                        {}
                    );

                    if (response.data.features.length > 0) {
                        let [lng, lat] = response.data.features[0].center;

                        allCoordinates.push({
                            id: profile.ProfileDetailId || 0,
                            name: profile.PersonalProfileName || "",
                            lat: lat || 0,
                            lng: lng || 0,
                        });
                    }
                } catch (error) {
                    console.error("Error fetching geocode for:", profile.UserAddress, error);
                }
            }
        }

        setCoordinates(allCoordinates);
    }, [results]);

    useEffect(() => {
        fetchAllCoordinates();
    }, [fetchAllCoordinates]);

    useEffect(() => {
        const container = mapContainerRef.current;
        if (container) {
            const newMap = new mapboxgl.Map({
                container,
                style: "mapbox://styles/mapbox/streets-v11",
                center: coordinates.length > 0 ? [coordinates[0].lng, coordinates[0].lat] : [21.0936, 7.1881],
                zoom: coordinates.length > 0 ? 4 : 2,
            });

            newMap.on("load", async () => {
                const pointerSvg = `
                <svg width="19" height="34" viewBox="0 0 19 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.38889 21.0468V31.452L8.8416 33.6447C9.15497 34.1175 9.8457 34.1175 10.1591 33.6447L11.6111 31.452V21.0468C10.9257 21.1743 10.2217 21.25 9.5 21.25C8.77826 21.25 8.07434 21.1743 7.38889 21.0468ZM9.5 0C4.25323 0 0 4.28121 0 9.5625C0 14.8438 4.25323 19.125 9.5 19.125C14.7468 19.125 19 14.8438 19 9.5625C19 4.28121 14.7468 0 9.5 0ZM9.5 5.04688C7.02604 5.04688 5.01389 7.07227 5.01389 9.5625C5.01389 10.0021 4.65896 10.3594 4.22222 10.3594C3.78549 10.3594 3.43056 10.0021 3.43056 9.5625C3.43056 6.19371 6.15389 3.45312 9.5 3.45312C9.93674 3.45312 10.2917 3.81039 10.2917 4.25C10.2917 4.68961 9.93674 5.04688 9.5 5.04688Z" fill="#2357C6"/>
                </svg>`;
                const addPointerIcon = async () => {
                    if (newMap.hasImage("profile-pointer-icon")) {
                        return true;
                    }

                    try {
                        const svgBlob = new Blob([pointerSvg], { type: "image/svg+xml;charset=utf-8" });
                        const svgUrl = URL.createObjectURL(svgBlob);
                        const imageData = await new Promise<ImageData>((resolve, reject) => {
                            const img = new Image();
                            img.onload = () => {
                                try {
                                    const canvas = document.createElement("canvas");
                                    canvas.width = 19;
                                    canvas.height = 34;
                                    const ctx = canvas.getContext("2d");

                                    if (!ctx) {
                                        reject(new Error("Failed to get canvas context for pointer icon"));
                                        return;
                                    }

                                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                    resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
                                } catch (drawError) {
                                    reject(drawError);
                                } finally {
                                    URL.revokeObjectURL(svgUrl);
                                }
                            };

                            img.onerror = (loadError) => {
                                URL.revokeObjectURL(svgUrl);
                                reject(loadError);
                            };

                            img.src = svgUrl;
                        });

                        newMap.addImage("profile-pointer-icon", imageData, { pixelRatio: 2 });
                        return true;
                    } catch (error) {
                        console.error("Failed to create custom profile pointer icon", error);
                        return false;
                    }
                };

                const features: any[] = coordinates.map(({ lng, lat, name, id }) => ({
                    type: "Feature",
                    properties: {
                        id,
                        name,
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [lng, lat],
                    },
                }));

                newMap.addSource("profiles", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features,
                    },
                    cluster: true,
                    clusterMaxZoom: 13,
                    clusterRadius: 50,
                });

                newMap.addLayer({
                    id: "clusters",
                    type: "circle",
                    source: "profiles",
                    filter: ["has", "point_count"],
                    paint: {
                        "circle-color": "#2357C6",
                        "circle-radius": [
                            "step",
                            ["get", "point_count"],
                            18,
                            10,
                            22,
                            30,
                            28,
                        ],
                        "circle-opacity": 0.85,
                    },
                });

                newMap.addLayer({
                    id: "cluster-count",
                    type: "symbol",
                    source: "profiles",
                    filter: ["has", "point_count"],
                    layout: {
                        "text-field": ["get", "point_count_abbreviated"],
                        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                        "text-size": 12,
                    },
                    paint: {
                        "text-color": "#FFFFFF",
                    },
                });

                const hasCustomPointerIcon = await addPointerIcon();

                if (!newMap.getLayer("unclustered-point")) {
                    newMap.addLayer({
                        id: "unclustered-point",
                        type: "symbol",
                        source: "profiles",
                        filter: ["!", ["has", "point_count"]],
                        layout: {
                            "icon-image": hasCustomPointerIcon ? "profile-pointer-icon" : "marker-15",
                            "icon-size": hasCustomPointerIcon ? 1.35 : 1.5,
                            "icon-anchor": "bottom",
                            "icon-allow-overlap": true,
                            "icon-ignore-placement": true,
                        },
                    });
                }

                // Hide member names on first load and only show names on higher zoom levels.
                newMap.addLayer({
                    id: "unclustered-label",
                    type: "symbol",
                    source: "profiles",
                    filter: ["!", ["has", "point_count"]],
                    minzoom: 7,
                    layout: {
                        "text-field": ["get", "name"],
                        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                        "text-size": 12,
                        "text-offset": [0, 1.4],
                        "text-anchor": "top",
                    },
                    paint: {
                        "text-color": "#16357A",
                        "text-halo-color": "#FFFFFF",
                        "text-halo-width": 1,
                    },
                });

                if (coordinates.length === 1) {
                    const currentUserPoint = coordinates[0];
                    newMap.easeTo({
                        center: [currentUserPoint.lng, currentUserPoint.lat],
                        zoom: 14,
                        duration: 0,
                    });
                } else if (coordinates.length > 1) {
                    const bounds = new mapboxgl.LngLatBounds();
                    coordinates.forEach(({ lng, lat }) => {
                        bounds.extend([lng, lat]);
                    });

                    newMap.fitBounds(bounds, {
                        padding: 80,
                        maxZoom: 10,
                        duration: 0,
                    });
                }

                newMap.on("click", "clusters", (event: any) => {
                    const featuresAtPoint = newMap.queryRenderedFeatures(event.point, {
                        layers: ["clusters"],
                    });
                    const feature = featuresAtPoint[0];
                    if (!feature) {
                        return;
                    }

                    const source: any = newMap.getSource("profiles");
                    const clusterId = feature.properties?.cluster_id;

                    source.getClusterExpansionZoom(clusterId, (error: any, zoom: number) => {
                        if (error) {
                            return;
                        }

                        const [lng, lat] = (feature.geometry as any).coordinates;
                        newMap.easeTo({
                            center: [lng, lat],
                            zoom,
                            duration: 500,
                        });
                    });
                });

                newMap.on("click", "unclustered-point", (event: any) => {
                    const feature = event.features?.[0];
                    const profileId = feature?.properties?.id;
                    if (profileId) {
                        router.push(`/profile/${add2040ToProfileDetailsId(Number(profileId))}`);
                    }
                });

                newMap.on("mouseenter", "clusters", () => {
                    newMap.getCanvas().style.cursor = "pointer";
                });

                newMap.on("mouseleave", "clusters", () => {
                    newMap.getCanvas().style.cursor = "";
                });

                newMap.on("mouseenter", "unclustered-point", (event: any) => {
                    newMap.getCanvas().style.cursor = "pointer";
                    const feature = event.features?.[0];
                    const profileId = feature?.properties?.id;
                    const profile = results.find((item) => Number(item.ProfileDetailId) === Number(profileId));

                    if (profile && (container as HTMLDivElement)) {
                        const point = event.point;
                        const rel = getHoverPosition(point, container as HTMLDivElement);
                        const rect = container.getBoundingClientRect();
                        setHoverPosition({
                            x: rect.left + rel.x,
                            y: rect.top + rel.y,
                            placement: rel.placement,
                        });

                        setHoveredProfile(profile);
                    }
                });

                newMap.on("mouseleave", "unclustered-point", () => {
                    newMap.getCanvas().style.cursor = "";
                    setHoveredProfile(null);
                });
            });

            return () => {
                newMap.remove();
            };
        }
    }, [coordinates, results, router, getHoverPosition]);

    return (<>
        <div className="relative w-full overflow-visible" style={{ height: "700px" }}>
            <div
                id="map"
                ref={mapContainerRef}
                className="w-full h-full rounded"
            />
        </div>

        {hoveredProfile && (
            <div
                className="fixed z-[999999] w-2/5 bg-white"
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

export default ProfileMapView;