"use client";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Restaurants() {
  return (
    <>
      <section className="section items-center">
        <h1>Start ordering</h1>
      </section>

      <section className="section items-center lg:mt-12">
        <article className="flex flex-col items-center gap-6 lg:flex-row lg:justify-center lg:gap-32">
          <Card>
            <CardHeader>
              <CardTitle>Scan the code</CardTitle>
              <CardDescription>
                Scan restaurants code with{" "}
                <span className="font-display-median font-black">tapnosh</span>{" "}
                logo below it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted relative flex aspect-square w-md justify-center overflow-clip rounded-lg">
                <div className="border-primary-foreground absolute inset-[10%] z-[1] rounded-lg border-2" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2Icon className="animate-spin" />
                </div>

                <Scanner
                  styles={{
                    finderBorder: 0,
                    container: {
                      width: "100%",
                      borderRadius: "2rem",
                    },
                  }}
                  components={{
                    finder: false,
                  }}
                  onScan={(result) => console.log(result)}
                />
              </div>
            </CardContent>
            {/* <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Deploy</Button>
            </CardFooter> */}
          </Card>

          <div className="bg-muted flex h-0.5 w-full max-w-3xs shrink-0 md:mx-4 md:my-0 md:h-40 md:w-0.5" />

          <Card>
            <CardHeader>
              <CardTitle>Or type it</CardTitle>
              <CardDescription>Input 8 characters code below.</CardDescription>
            </CardHeader>
            <CardContent>
              <InputOTP maxLength={8}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                  <InputOTPSlot index={6} />
                  <InputOTPSlot index={7} />
                </InputOTPGroup>
              </InputOTP>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Accept</Button>
            </CardFooter>
          </Card>
        </article>
      </section>
    </>
  );
}
