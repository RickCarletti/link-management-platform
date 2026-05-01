import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export default function Map({ points }: { points: any[] }) {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const buildGeoJSON = () => ({
    type: "FeatureCollection" as const,
    features: points
      .filter(
        (p) =>
          p.lat !== null &&
          p.lon !== null &&
          p.lat !== undefined &&
          p.lon !== undefined
      )
      .map((p) => ({
        type: "Feature" as const,
        properties: {
          id: p.id,
          city: p.city,
          country: p.country,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [Number(p.lon), Number(p.lat)],
        },
      })),
  })

  useEffect(() => {
    if (!containerRef.current) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-43.2, -22.9],
      zoom: 2,
    })

    mapRef.current = map

    map.on("load", () => {
      map.addSource("accesses", {
        type: "geojson",
        data: buildGeoJSON(),
      })

      map.addLayer({
        id: "heatmap",
        type: "heatmap",
        source: "accesses",
        maxzoom: 9,
        paint: {
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            1,
            9,
            3,
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0,0,0,0)",
            0.2,
            "#3b82f6",
            0.4,
            "#22c55e",
            0.6,
            "#eab308",
            0.8,
            "#f97316",
            1,
            "#ef4444",
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 4, 9, 30],
          "heatmap-opacity": 0.9,
        },
      })

      map.addLayer({
        id: "points",
        type: "circle",
        source: "accesses",
        minzoom: 7,
        paint: {
          "circle-radius": 6,
          "circle-color": "#FB5A00",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1,
        },
      })

      const geojson = buildGeoJSON()

      if (geojson.features.length) {
        const bounds = new mapboxgl.LngLatBounds()

        geojson.features.forEach((feature) => {
          bounds.extend(feature.geometry.coordinates as [number, number])
        })

        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 5,
        })
      }
    })

    return () => map.remove()
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    const source = mapRef.current.getSource(
      "accesses"
    ) as mapboxgl.GeoJSONSource

    if (!source) return

    source.setData(buildGeoJSON())
  }, [points])

  return <div ref={containerRef} className="h-[350px] w-full rounded-md" />
}
