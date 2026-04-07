"use client"

import { useState, useEffect, useRef } from "react"
import { Cloud, Sun, CloudRain, Snowflake, Wind, MapPin, RefreshCw, AlertCircle, Search, ChevronDown } from "lucide-react"

interface WeatherData {
  temperature: number
  condition: string
  location: string
  humidity: number
  windSpeed: number
}

interface City {
  name: string
  lat: number
  lon: number
  country: string
}

type WeatherStatus = "loading" | "success" | "error" | "permission-denied"

const popularCities: City[] = [
  { name: "New York", lat: 40.7128, lon: -74.006, country: "US" },
  { name: "London", lat: 51.5074, lon: -0.1278, country: "UK" },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503, country: "JP" },
  { name: "Paris", lat: 48.8566, lon: 2.3522, country: "FR" },
  { name: "Sydney", lat: -33.8688, lon: 151.2093, country: "AU" },
  { name: "Beijing", lat: 39.9042, lon: 116.4074, country: "CN" },
  { name: "Singapore", lat: 1.3521, lon: 103.8198, country: "SG" },
  { name: "Dubai", lat: 25.2048, lon: 55.2708, country: "AE" },
]

export function WeatherCard() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [status, setStatus] = useState<WeatherStatus>("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [showCityPicker, setShowCityPicker] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<City[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowCityPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchWeather = async (lat: number, lon: number, cityName?: string) => {
    setStatus("loading")
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
      )
      if (!response.ok) throw new Error("Failed to fetch weather data")
      const data = await response.json()

      let locationName = cityName
      if (!locationName) {
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        )
        const geoData = await geoResponse.json()
        locationName = geoData.address?.city || geoData.address?.town || geoData.address?.county || "Unknown"
      }

      const weatherCode = data.current.weather_code
      let condition = "Clear"
      if (weatherCode >= 0 && weatherCode <= 3) condition = "Clear"
      else if (weatherCode >= 45 && weatherCode <= 48) condition = "Foggy"
      else if (weatherCode >= 51 && weatherCode <= 67) condition = "Rainy"
      else if (weatherCode >= 71 && weatherCode <= 77) condition = "Snowy"
      else if (weatherCode >= 80 && weatherCode <= 99) condition = "Stormy"

      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        condition,
        location: locationName,
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
      })
      setStatus("success")
      
      // Save selected city
      localStorage.setItem("weatherCity", JSON.stringify({ lat, lon, name: locationName }))
    } catch (error) {
      setErrorMessage("Unable to load weather")
      setStatus("error")
    }
  }

  const searchCities = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    try {
      // Using Open-Meteo Geocoding API
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      )
      const data = await response.json()
      if (data.results) {
        setSearchResults(data.results.map((r: { name: string; latitude: number; longitude: number; country: string }) => ({
          name: r.name,
          lat: r.latitude,
          lon: r.longitude,
          country: r.country,
        })))
      } else {
        setSearchResults([])
      }
    } catch {
      setSearchResults([])
    }
    setIsSearching(false)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => searchCities(value), 300)
  }

  const selectCity = (city: City) => {
    fetchWeather(city.lat, city.lon, city.name)
    setShowCityPicker(false)
    setSearchQuery("")
    setSearchResults([])
  }

  const getLocation = () => {
    setStatus("loading")
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation not supported")
      setStatus("error")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage("Location access denied")
          setStatus("permission-denied")
        } else {
          setErrorMessage("Unable to get location")
          setStatus("error")
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    )
  }

  useEffect(() => {
    // Check for saved city first
    const savedCity = localStorage.getItem("weatherCity")
    if (savedCity) {
      try {
        const city = JSON.parse(savedCity)
        fetchWeather(city.lat, city.lon, city.name)
        return
      } catch {}
    }
    getLocation()
  }, [])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="w-8 h-8 text-yellow-400" />
      case "rainy":
      case "stormy":
        return <CloudRain className="w-8 h-8 text-blue-400" />
      case "snowy":
        return <Snowflake className="w-8 h-8 text-blue-200" />
      default:
        return <Cloud className="w-8 h-8 text-gray-300" />
    }
  }

  if (status === "loading") {
    return (
      <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl w-full animate-fade-in">
        <div className="flex items-center justify-center h-28">
          <RefreshCw className="w-6 h-6 text-white/60 animate-spin" />
        </div>
      </div>
    )
  }

  if ((status === "error" || status === "permission-denied") && !weather) {
    return (
      <div ref={containerRef} className="relative p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl w-full animate-fade-in" style={{ zIndex: showCityPicker ? 100 : 1 }}>
        <div className="flex flex-col items-center gap-3">
          <AlertCircle className="w-8 h-8 text-white/60" />
          <p className="text-sm text-white/60 text-center">{errorMessage}</p>
          <div className="flex gap-2">
            <button
              onClick={getLocation}
              className="text-sm text-white/80 hover:text-white transition-colors px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
            >
              Retry
            </button>
            <button
              onClick={() => setShowCityPicker(true)}
              className="text-sm text-white/80 hover:text-white transition-colors px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20"
            >
              Select City
            </button>
          </div>
        </div>
        
        {showCityPicker && (
          <div className="absolute top-full left-0 right-0 mt-2 p-3 rounded-xl backdrop-blur-2xl bg-neutral-900/80 border border-white/20 shadow-2xl z-50 animate-slide-up">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                placeholder="Search city..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {searchResults.length > 0 ? (
                searchResults.map((city, i) => (
                  <button
                    key={i}
                    onClick={() => selectCity(city)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-white/90 hover:bg-white/20 transition-colors"
                  >
                    {city.name}, {city.country}
                  </button>
                ))
              ) : (
                popularCities.map((city, i) => (
                  <button
                    key={i}
                    onClick={() => selectCity(city)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-white/90 hover:bg-white/20 transition-colors"
                  >
                    {city.name}, {city.country}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (!weather) return null

  return (
    <div ref={containerRef} className="relative p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl w-full animate-fade-in" style={{ zIndex: showCityPicker ? 100 : 1 }}>
      <div className="flex items-start justify-between mb-3">
        <button 
          onClick={() => setShowCityPicker(!showCityPicker)}
          className="flex items-center gap-1 text-white/70 hover:text-white transition-colors group"
        >
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{weather.location}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${showCityPicker ? 'rotate-180' : ''}`} />
        </button>
        <button
          onClick={getLocation}
          className="text-white/50 hover:text-white transition-all hover:rotate-180 duration-500"
          title="Use current location"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-4 mb-3">
        {getWeatherIcon(weather.condition)}
        <div>
          <div className="text-3xl font-bold text-white">{weather.temperature}°C</div>
          <div className="text-sm text-white/70">{weather.condition}</div>
        </div>
      </div>

      <div className="flex gap-4 text-sm text-white/60">
        <div className="flex items-center gap-1">
          <Cloud className="w-4 h-4" />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-4 h-4" />
          <span>{weather.windSpeed} km/h</span>
        </div>
      </div>

      {showCityPicker && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 rounded-xl backdrop-blur-2xl bg-neutral-900/80 border border-white/20 shadow-2xl z-50 animate-slide-up">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              placeholder="Search city..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {isSearching ? (
              <div className="text-center py-2 text-white/50 text-sm">Searching...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((city, i) => (
                <button
                  key={i}
                  onClick={() => selectCity(city)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-white/90 hover:bg-white/20 transition-colors"
                >
                  {city.name}, {city.country}
                </button>
              ))
            ) : searchQuery ? (
              <div className="text-center py-2 text-white/50 text-sm">No results found</div>
            ) : (
              <>
                <div className="text-xs text-white/40 px-3 py-1">Popular Cities</div>
                {popularCities.map((city, i) => (
                  <button
                    key={i}
                    onClick={() => selectCity(city)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-white/90 hover:bg-white/20 transition-colors"
                  >
                    {city.name}, {city.country}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
