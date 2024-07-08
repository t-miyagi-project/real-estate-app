import React, { useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import MarkerItem from '@/app/_components/MarkerItem';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '80vh',
  //丸み
  borderRadius:10
};

function GoogleMapSection({coordinates,listing}) {
  
  const [center,setCenter]=useState(null)
  const [map, setMap] = React.useState(null)
  // const { isLoaded } = useJsApiLoader({
  //   id: 'google-map-script',
  //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY
  // })

  useEffect(()=>{
    if (coordinates) {
      setCenter(coordinates);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error getting current position: ', error);
            // デフォルトの場所を設定する（エラー処理）
            setCenter({
              lat: -3.745,
              lng: -38.523,
            });
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        // デフォルトの場所を設定する（エラー処理）
        setCenter({
          lat: -3.745,
          lng: -38.523,
        });
      }
    }
  },[coordinates])

  // const onLoad = React.useCallback(function callback(map) {
  //   // This is just an example of getting and using the map instance!!! don't just blindly copy!
  //   const bounds = new window.google.maps.LatLngBounds(center);
  //   map.fitBounds(bounds);

  //   setMap(map)
  // }, [])

  const onLoad = React.useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(currentCenter);
          map && map.panTo(currentCenter);
        },
        (error) => {
          console.error('Error getting current position: ', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };
  
  return (
    <div>
      <Button className="flex gap-2"
          onClick={getCurrentLocation}
        >
          <Search className='h-4 w-4' />
          現在地を取得
      </Button>
      {center && (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        onLoad={onLoad}
        onUnmount={onUnmount}
        gestureHandling="greedy"
      >
        { /* Child components, such as markers, info windows, etc. */ }
        {listing.map((item,index)=>(
          <MarkerItem
          key={index}
          item={item}
          />
        ))}
      </GoogleMap>
      )}
    </div>
  )
}

export default GoogleMapSection