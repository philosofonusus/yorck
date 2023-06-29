import { CardHeader, Card, CardContent, CardTitle } from "@/components/ui/card";
export default async function ListPage() {
  return (
    <div className="flex w-full items-center justify-center overflow-y-scroll py-6">
      <Card className="mx-6 w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Link href="/lists">
                <ChevronLeft />
              </Link>
              <input
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="w-fit space-x-2 bg-transparent text-2xl font-semibold outline-none first-letter:uppercase"
              />
            </div>
            <div className="flex items-center gap-3">
              <Badge>{(list.data?.items as string[]).length}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
