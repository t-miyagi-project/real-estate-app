import AgentDetail from '@/app/(routes)/view-listing/_components/AgentDetail'
import GoogleMapSection from '@/app/_components/GoogleMapSection'
import { Button } from '@/components/ui/button'
import { MapPin, Share } from 'lucide-react'
import React from 'react'

function Details({ listingDetail }) {
  return listingDetail && (
    <div className='my-6 flex gap-2 flex-col'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='font-bold text-3xl'>${listingDetail?.price}</h2>
          <h2 className='text-gray-500 text-lg flex gap-2'>
            <MapPin />
            {listingDetail?.address}
          </h2>
        </div>
        <Button className="flex gap-2"><Share />Share</Button>
      </div>
      <div>
        <h2 className='font-bold text-2xl'>Find on Map</h2>
        <GoogleMapSection
        coordinates={listingDetail.coordinates}
        listing={[listingDetail]}
        />
      </div>
      <div>
        <h2 className='font-bold text-2xl'>Contact</h2>
        <AgentDetail listingDetail={listingDetail}/>
      </div>
    </div>
  )
}

export default Details