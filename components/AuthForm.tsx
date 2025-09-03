"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField from "./CustomFormField";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { SignIn, SignUp } from "@/lib/actions/user.actions";
import PlaidLink from "./PlaidLink";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const userData = {
        firstName: data.firstName!,
        lastName: data.lastName!,
        address1: data.address1!,
        city: data.city!,
        state: data.state!,
        postalCode: data.postalCode!,
        dateOfBirth: data.dateOfBirth!,
        ssn: data.ssn!,
        email: data.email,
        password: data.password,
      };

      //SignUp and/or SignIn with Appwrite & create a plaid token
      if (type === "sign-up") {
        const newUser = await SignUp(userData);
        setUser(newUser);
      }

      if (type === "sign-in") {
        const loginData = { email: data.email, password: data.password };
        const response = await SignIn(loginData);
        if (response) router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="flex cursor-pointer items-center gap-1">
          <Image
            src={"/icons/logo.svg"}
            width={34}
            height={34}
            alt="Horizon Logo"
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo">Horizon</h1>
        </Link>
        <div className="flex flex-col gap md:gap-3">
          <h1 className="text-24 lg:text-36 font-bold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant="primary" />
        </div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <CustomFormField
                      control={form.control}
                      name={"firstName"}
                      placeholder={"Enter your first name"}
                      label={"First Name"}
                    />
                    <CustomFormField
                      control={form.control}
                      name={"lastName"}
                      placeholder={"Enter your last name"}
                      label={"Last Name"}
                    />
                  </div>
                  <CustomFormField
                    control={form.control}
                    name={"address1"}
                    placeholder={"Enter your specific address"}
                    label={"Address"}
                  />
                  <CustomFormField
                    control={form.control}
                    name={"city"}
                    placeholder={"Enter your city"}
                    label={"CIty"}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <CustomFormField
                      control={form.control}
                      name={"state"}
                      placeholder={"Example: Niger"}
                      label={"State"}
                    />
                    <CustomFormField
                      control={form.control}
                      name={"postalCode"}
                      placeholder={"Example: 100001"}
                      label={"Postal Code"}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <CustomFormField
                      control={form.control}
                      name={"dateOfBirth"}
                      placeholder={"YYYY-MM-DD"}
                      label={"Date of Birth"}
                    />
                    <CustomFormField
                      control={form.control}
                      name={"ssn"}
                      placeholder={"Example: 1234567890"}
                      label={"SSN"}
                    />
                  </div>
                </>
              )}
              <CustomFormField
                control={form.control}
                name={"email"}
                placeholder={"Enter your email"}
                label={"Email"}
              />
              <CustomFormField
                control={form.control}
                name={"password"}
                placeholder={"Enter your password"}
                label={"Password"}
              />
              <div className="flex flex-col gap-4">
                <Button disabled={isLoading} type="submit" className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account ?"
                : "Already have an account ?"}
            </p>
            <Link
              className="form-link"
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            >
              {type === "sign-in" ? "Sign up" : "Sign in"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
