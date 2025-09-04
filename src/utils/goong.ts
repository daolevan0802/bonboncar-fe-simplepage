// Goong Maps API configuration
const GOONG_API_KEY = import.meta.env.VITE_GOONG_API_KEY || 'DYB1aOQjlALvQtRrA6UYbkNoR6ZlaetTHybNSGb4'
const GOONG_BASE_URL = 'https://rsapi.goong.io'

// Types for Goong API responses
interface GeocodingResponse {
  results: Array<{
    geometry: {
      location: {
        lat: number
        lng: number
      }
    }
  }>
}

interface AutocompleteResponse {
  predictions: Array<{
    description: string
    place_id: string
    structured_formatting: {
      main_text: string
      secondary_text: string
    }
  }>
}

// Get coordinates from address
export const getLatLng = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const response = await fetch(
      `${GOONG_BASE_URL}/geocode?address=${encodeURIComponent(address)}&api_key=${GOONG_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error('Geocoding request failed')
    }

    const data: GeocodingResponse = await response.json()

    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location
      return {
        lat: location.lat,
        lng: location.lng,
      }
    }

    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

// Get autocomplete suggestions
export const getAutocompleteSuggestions = async (
  input: string,
): Promise<
  Array<{
    description: string
    place_id: string
    main_text: string
    secondary_text: string
  }>
> => {
  try {
    const response = await fetch(
      `${GOONG_BASE_URL}/Place/AutoComplete?input=${encodeURIComponent(input)}&location=10.7758439,106.7017555&radius=50000&api_key=${GOONG_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error('Autocomplete request failed')
    }

    const data: AutocompleteResponse = await response.json()

    return data.predictions.map((prediction) => ({
      description: prediction.description,
      place_id: prediction.place_id,
      main_text: prediction.structured_formatting.main_text,
      secondary_text: prediction.structured_formatting.secondary_text,
    }))
  } catch (error) {
    console.error('Autocomplete error:', error)
    return []
  }
}

// Debounce function for search inputs
export const debounce = <T extends (...args: Array<any>) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}
