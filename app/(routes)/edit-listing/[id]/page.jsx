"use client"
import React, { useEffect, useState } from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Formik } from 'formik'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'
import FileUpload from '@/app/(routes)/edit-listing/_components/FileUpload'
import { Loader } from 'lucide-react'


function EditListing({ params }) {

  const { user } = useUser();
  const router = useRouter();
  const [listing, setListing] = useState([]);
  const [images, setImages] = useState([]);
  const [loading,setLoading]=useState(false);

  useEffect(() => {
    user && verifyUserRecord();
  }, [user]);

  const verifyUserRecord = async () => {
    const { data, error } = await supabase
      .from('listing')
      .select('*,listingImages(listing_id,url)')
      .eq('createdBy', user?.primaryEmailAddress.emailAddress)
      .eq('id', params.id);

    if (data) {
      console.log(data);
      setListing(data[0]);
    }

    if (data?.length <= 0) {
      router.replace('/');
    }
  };

  //formの情報から、同一のIDのレコードを更新する
  const onSubmitHandler = async (formValue) => {
    setLoading(true);

    const { data, error } = await supabase
      .from('listing')
      .update(formValue)
      .eq('id', params.id)
      .select();

    if (data) {
      toast('更新完了');
    }

    for (const image of images) {
      const file = image;
      const fileName = Date.now().toString();
      const fileExt = fileName.split('.').pop();
      const { data, error } = await supabase.storage
        .from('listingImages')
        .upload(`${fileName}`, file, {
          contentType: `image/${fileExt}`,
          upsert: false
        });
      if (error) {
        setLoading(false);
        toast('error')
      } else {
        const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName;
        const { data, error } = await supabase
          .from('listingImages')
          .insert([
            { url: imageUrl,listing_id:params?.id }
          ])
          .select();

          if(error){
            setLoading(false);
          }
      }
      setLoading(false);
    }
  };

  return (
    <div className='px-10 md:px-36 my-10'>
      <h2 className='font-bold text-xl'>Enter some more details</h2>
      <Formik
        initialValues={{
          type: '',
          propertyType: '',
          profileImage: user?.imageUrl,
          fullName: user?.fullName
        }}
        onSubmit={(values) => {
          onSubmitHandler(values);
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className='p-8 rounded-lg shadow-md'>
              <div className='grid grid-cols-1 md:grid-cols-3'>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-lg text-slate-500'>Rent or Sell?</h2>
                  <RadioGroup
                    onValueChange={(v) => values.type = v}
                    defaultValue={listing?.type}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Rent" id="Rent" />
                      <Label htmlFor="Rent">Rent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sell" id="Sell" />
                      <Label htmlFor="Sell">Sell</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-lg text-slate-500'>Property Type</h2>
                  <Select
                    onValueChange={(e) => values.propertyType = e}
                    name="propertyType"
                    defaultValue={listing?.propertyType}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={listing?.propertyType ? listing?.propertyType : "Select Property Type"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single Family House">Single Family House</SelectItem>
                      <SelectItem value="Town House">Town House</SelectItem>
                      <SelectItem value="Condo">Condo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                <div className='flex gap-2 flex-col'>
                  <h2 className='text-gray-500'>Bedroom</h2>
                  <Input type="number" placeholder="Ex.2"
                    defaultValue={listing?.bedroom}
                    name="bedroom" onChange={handleChange}
                  />
                </div>
                <div className='flex gap-2 flex-col'>
                  <h2 className='text-gray-500'>Bathroom</h2>
                  <Input type="number" placeholder="Ex.2"
                    defaultValue={listing?.bathroom}
                    name="bathroom" onChange={handleChange} />
                </div>
                <div className='flex gap-2 flex-col'>
                  <h2 className='text-gray-500'>Built In</h2>
                  <Input type="number" placeholder="Ex. 1900 Sq. ft"
                    defaultValue={listing?.builtIn}
                    name="builtIn" onChange={handleChange} />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                <div className='flex gap-2 flex-col'>
                  <h2 className='text-gray-500'>Parking</h2>
                  <Input type="number" placeholder="Ex. 1900 Sq. ft"
                    defaultValue={listing?.parking}
                    name="parking" onChange={handleChange} />
                </div>
                <div className='flex gap-2 flex-col'>
                  <h2 className='text-gray-500'>Lot Size</h2>
                  <Input type="number" placeholder="Ex. 1900"
                    defaultValue={listing?.lotSize}
                    name="lotSize" onChange={handleChange} />
                </div>
                <div className='flex gap-2 flex-col'>
                  <h2 className='text-gray-500'>Area</h2>
                  <Input type="number" placeholder="Ex. 1900 Sq. ft"
                    defaultValue={listing?.area}
                    name="area" onChange={handleChange} />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                <div className='flex gap-2 flex-col'>
                  <h2 className='text-gray-500'>Selling Price</h2>
                  <Input type="number" placeholder="400000"
                    defaultValue={listing?.price}
                    name="price" onChange={handleChange} />
                </div>
                <div className='flex gap-2 flex-col'>
                  <h2 className='text-gray-500'>HOA</h2>
                  <Input type="number" placeholder="100"
                    defaultValue={listing?.hoa}
                    name="hoa" onChange={handleChange} />
                </div>
              </div>

              <div className='grid grid-cols-1 gap-10'>
                <div className='flex gap-2 flex-col'>
                  <h2 className='text-gray-500'>Description</h2>
                  <Textarea placeholder=""
                    defaultValue={listing?.description}
                    name="description" onChange={handleChange} />
                </div>
              </div>
              <div>
                <h2 className='text-gray-500'>アップロード画像</h2>
                <FileUpload 
                setImages={(value) => setImages(value)}
                imageList={listing.listingImages}
                />
              </div>
              <div className='flex gap-7 justify-end'>
                <Button variant="outline" className="text-primary border-purple-500">Save</Button>
                <Button disabled={loading} className="">
                  {loading?<Loader className="animate-spin"/>:'Save & Publish'}
                </Button>
              </div>

            </div>
          </form>)}
      </Formik>
    </div>
  )
}

export default EditListing