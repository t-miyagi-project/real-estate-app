"use client"
import Details from '@/app/(routes)/view-listing/_components/Details';
import Slider from '@/app/(routes)/view-listing/_components/Slider';
import { supabase } from '@/utils/supabase/client'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

function ViewListing({ params }) {

  const [listingDetail, setListingDetail] = useState();

  useEffect(() => {
    GetListingDetail();
  }, [])

  const GetListingDetail = async () => {
    const { data, error } = await supabase
      .from('listing')
      .select('*,listingImages(url,listing_id)')
      .eq('id', params.id)
      .eq('active', true);

    if (data) {
      setListingDetail(data[0])
      console.log(data)
    }
    if (error) {
      toast('エラー');
    }
  }
  return (
    <div className='px-4 md:px-32 lg:px-56 my-3'>
      <Slider imageList={listingDetail?.listingImages} />
      <Details listingDetail={listingDetail} />
    </div>
  )
}

export default ViewListing