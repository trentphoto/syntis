"use client";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SupplierForm, type SupplierFormData } from "@/components/SupplierForm";

export function SupplierSignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (formData: SupplierFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/supplier/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          address: formData.address,
          businessType: formData.businessType,
          ein: formData.ein,
          domain: formData.domain,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create supplier account");
      }

      // Redirect to success page
      router.push("/supplier/signup-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Supplier Registration</CardTitle>
          <CardDescription>
            Create your supplier account to join our network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SupplierForm
            onSubmit={handleSignUp}
            isLoading={isLoading}
            error={error}
            submitButtonText="Create Supplier Account"
            showPasswordFields={true}
          />
          
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
