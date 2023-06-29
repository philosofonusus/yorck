import StyledAvatar from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";
import { TrashIcon } from "lucide-react";


export default async function AddressLists() {
  const listData = await db.select().from(addressLists);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="mx-6 w-full max-w-md">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold">
            Address Lists
          </CardTitle>
        </CardHeader>
      </Card>
      <CardContent>
        
      </CardContent>
    </div>
  );
}
