import ListingMapView from "@/app/_components/ListingMapView";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="p-10">
      <ListingMapView type='Sell'/>
    </div>
  );
}
