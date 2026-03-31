"use client";
import React from 'react'
import { formSchema } from '../schema/form.schema'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import Image from 'next/image';


const AuthForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    console.log(data)
  }

  return (
    <div className='card-border  lg:min-w-139 '>
      <div className='flex flex-col gap-6 card py-14 px-10 '>
        <div className=' flex flex-row gap-2 justify-center  ' >
          <Image src="/logo.svg" alt="Logo" width={32} height={38} />
          <h2 className='text-primary-100 '>
            Interview Prep Platform
          </h2>

        </div>
        <h3>Form Platform</h3>

      </div>
      <div className='w-full '>
          <Card className="w-full sm:max-w-md">
       
        <CardContent>
          <form id="form-rhf-demo"  onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              
             
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" form="form-rhf-demo">
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
      </div>
    


    </div>

  )
}

export default AuthForm