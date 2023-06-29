"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { addressValidator } from "@/lib/addressValidator";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { nanoid } from "nanoid";
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormLabel,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ClientOnly from "./clientOnly";
import { db } from "@/lib/db";
import { addressLists } from "@/lib/db/schema";

async function onSubmit(values: z.infer<typeof formValidationSchema>) {
  "use server";
  const { listName, addresses } = values;

  await db.insert(addressLists).values({
    id: nanoid(),
    name: listName,
    addresses: addresses.split(/[\n,]/).map((address) => address.trim()),
  });
}

const formValidationSchema = z.object({
  listName: z
    .string()
    .min(1, { message: "List name is required" })
    .refine((val) => {
      return !val.includes(" ");
    }, "List name must not contain spaces"),
  addresses: addressValidator,
});

export default function Home() {


  return <div className="h-full flex items-center justify-center"></div>;
}
