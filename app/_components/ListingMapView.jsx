"use client"
import Listing from '@/app/_components/Listing'
import { supabase } from '@/utils/supabase/client'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

function ListingMapView({ type }) {

  const [listing, setListing] = useState([]);
  const [searchedAddress, setSearchedAddress] = useState();
  useEffect(() => {
    getLatestListing();
  }, [])

  const getLatestListing = async () => {
    const { data, error } = await supabase
      .from('listing')
      .select(`*,listingImages(
      url,
      listing_id
      )`)
      .eq('active', true)
      .eq('type', type)
      .order('id', { ascending: false })

    if (data) {
      setListing(data);
      console.log(data)
    }
    if (error) {
      toast('ServerError');
    }
  }

  const handlSearchClick = async () => {
    console.log(searchedAddress);
    const searchTerm=searchedAddress?.value?.structured_formatting?.main_text
    const { data, error } = await supabase
      .from('listing')
      .select(`*,listingImages(
      url,
      listing_id
      )`)
      .eq('active', true)
      .eq('type', type)
      .like('address', '%'+searchTerm+'%')
      .order('id', { ascending: false })

      if (data) {
        setListing(data);
        //console.log(data)
      }
      if (error) {
        toast('ServerError');
      }
  }
  return (
    <div className='grid grid-cols-1 md:grid-cols-2'>
      <div>
        <Listing listing={listing}
          handlSearchClick={handlSearchClick}
          searchedAddress={(v) => setSearchedAddress(v)} />
      </div>
      <div>
        Map
      </div>
    </div>
  )
}

export default ListingMapView