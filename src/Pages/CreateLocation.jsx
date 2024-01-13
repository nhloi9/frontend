import React, { useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import GoogleMapReact from 'google-map-react'
import { set } from 'date-fns'
import { Tooltip } from 'antd'
import { CiLocationOn } from 'react-icons/ci'
import { FaLocationDot } from 'react-icons/fa6'
import { fitBounds } from 'google-map-react'
import toast from 'react-hot-toast'
import axios from 'axios'

function generateRandomPositions (
  centerLat,
  centerLon,
  numPositions,
  maxDistance
) {
  const randomPositions = []

  for (let i = 0; i < numPositions; i++) {
    // Generate random distance and angle
    const randomDistance = Math.random() * maxDistance
    const randomAngle = Math.random() * 2 * Math.PI // Full circle in radians

    // Calculate new latitude and longitude
    const latOffset = (randomDistance / 6371000) * (180 / Math.PI) // Convert meters to degrees
    const latNew = centerLat + latOffset * Math.sin(randomAngle)

    const lonOffset =
      (randomDistance / (6371000 * Math.cos(centerLat * (Math.PI / 180)))) *
      (180 / Math.PI)
    const lonNew = centerLon + lonOffset * Math.cos(randomAngle)

    randomPositions.push({ lat: latNew, lon: lonNew })
  }

  return randomPositions
}
console.log(generateRandomPositions(20.9774682, 105.8210171, 10, 10))

// function cacluteDistance (p1, p2) {
//   const p1Cord = new google.maps.LatLng(p1.lat, p1.lng)
//   const p2Cord = new google.maps.LatLng(p2.lat, p2.lng)
//   return google.maps.geometry.spherical.computeDistanceBetween(p1Cord, p2Cord)
// }
// console.log(cacluteDistance({ lat: 1, lng: 2 }, { lat: 3, lng: 4 }))

// const bounds = {
//   nw: {
//     lat: 50.01038826014866,
//     lng: -118.6525866875
//   },
//   se: {
//     lat: 32.698335045970396,
//     lng: -92.0217273125
//   }
// }

// Or

// const bounds = {
//   ne: {
//     lat: 50.01038826014866,
//     lng: -118.6525866875
//   },
//   sw: {
//     lat: 32.698335045970396,
//     lng: -92.0217273125
//   }

// };

// const size = {
//   width: 640, // Map width in pixels
//   height: 380 // Map height in pixels
// }
// const { center, zoom } = fitBounds(bounds, size)

const rad = function (x) {
  return (x * Math.PI) / 180
}

const getDistance = function (p1, p2) {
  var R = 6378137 // Earth’s mean radius in meter
  var dLat = rad(p2.lat - p1.lat)
  var dLong = rad(p2.lng - p1.lng)
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat)) *
      Math.cos(rad(p2.lat)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = R * c
  return d // returns the distance in meter
}

console.log(getDistance({ lat: 1, lng: 2 }, { lat: 3, lng: 4 }))

const AnyReactComponent = ({ text }) => (
  // <Tooltip title={'ldldlddddddddd'}>
  <div
    style={{
      position: 'absolute',
      transform: 'translate(-50%, -100%)'
    }}
  >
    <FaLocationDot size={38} color='red' className='' />
  </div> // </Tooltip>
)

const options = {
  enableHighAccuracy: true,
  timeout: 50000,
  maximumAge: 0
}

const CreateLocation = () => {
  const [draggable, setDraggable] = useState(true)

  function error (err) {
    console.warn(`ERROR(${err.code}): ${err.message}`)
  }

  const [location, setLocation] = useState(null)
  useEffect(() => {
    function success (pos) {
      const crd = pos.coords

      console.log('Your current position is:')
      console.log(`Latitude : ${crd.latitude}`)
      console.log(`Longitude: ${crd.longitude}`)
      console.log(`More or less ${crd.accuracy} meters.`)
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      })
      // setTimeout(() => {
      //   setInterval(() => {
      //     setDefaultZoom(pre => Math.min(pre + 1, 18))
      //   }, 40)
      // }, 1000)
    }

    navigator.geolocation.getCurrentPosition(success, error, options)
  }, [])

  useEffect(() => {
    axios
      .get(
        'https://api.tomtom.com/search/2/reverseGeocode/21.0277644,105.8341598.json?key=UB1JyOMM8IzEGrYwP2gNjM7mKxP07gaC&radius=100'
      )
      .then(response => console.log(response))
      .catch(error => console.log(error))
  }, [])

  if (location)
    console.log({
      incorect: getDistance(location, { lat: 20.9774614, lng: 105.8210328 })
    })

  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', width: '100%' }}>
      {location && (
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBZ1nIrsxL6R_NX1ATzKO8iLsWlU9C2aSA' }}
          defaultCenter={location}
          defaultZoom={18}
          // zoom={defaultZoom}
          yesIWantToUseGoogleMapApiInternals
          onClick={({ x, y, lat, lng, event }) => {
            console.log(x, y, lat, lng, event)
            // setLocation({ lat, lng })
          }}
          // draggable={draggable}
          // draggable={false}
          onChildMouseMove={(hoverKey, childProps, mouse) => {
            setLocation({ lat: mouse.lat, lng: mouse.lng })
          }}
          // onChildMouseDown={}
          // onChildClick={(a, b, c) => {
          //   console.log({ a, b, c })
          // }}

          onChildMouseDown={() => {
            setDraggable(false)
          }}
          onChildMouseUp={() => {
            setDraggable(true)
          }}
        >
          <AnyReactComponent
            lat={location.lat}
            lng={location.lng}
            text='My Marker'
          />
        </GoogleMapReact>
      )}
    </div>
  )
}

export default CreateLocation
