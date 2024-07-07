import MarkerListingItem from '@/app/_components/MarkerListingItem';
import { MarkerF, OverlayView } from '@react-google-maps/api'
import React, { useEffect, useState } from 'react'

function MarkerItem({item}) {
  const [selectedListing,setSelectedListing]=useState();
  return (
    <div>
      <MarkerF
        position={item.coordinates}
        onClick={()=>setSelectedListing(item)}
        icon={{
          url:'/next.svg',
          scaledSize:{
            width:60,
            height:60
          }
        }}
      >
        {selectedListing&& <OverlayView
        position={selectedListing.coordinates}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div>
            <MarkerListingItem 
            closeHandler={()=>setSelectedListing(null)}
            item={selectedListing}/>
          </div>

        </OverlayView>}
        
      </MarkerF>
    </div>
  )
}

export default MarkerItem