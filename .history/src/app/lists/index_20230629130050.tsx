export default function Home() {
  const form = useForm<z.infer<typeof formValidationSchema>>({
    resolver: zodResolver(formValidationSchema),
    defaultValues: {
      listName: nanoid(4),
    },
  });

  async function onSubmit(values: z.infer<typeof formValidationSchema>) {
    createListAction(values);
  }

  return (
    <div className="flex h-full items-center justify-center">
      <ClientOnly>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to Monitorus!</CardTitle>
                <CardDescription>
                  Create your first monitor list. You can add more later.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="listName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>List Name</FormLabel>
                      <FormControl>
                        <Input placeholder="list name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addresses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Addresses</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="one per line or coma separated."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="ghost">
                  <Link href="/lists">Cancel</Link>
                </Button>
                <Button type="submit">Continue</Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </ClientOnly>
    </div>
  );
}
