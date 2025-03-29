"use client";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Camera, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLayoutEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useCamera } from "@/hooks/useCamera";

export default function Restaurants() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tapnoshCode, setTapnoshCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validateCode = (code: string) => {
    const codeRegex = /([a-zA-Z0-9]{6})/;
    return codeRegex.test(code);
  };

  const handleScan = (result: IDetectedBarcode[]) => {
    const code =
      new URL(result[0].rawValue).searchParams.get("tapnoshId") ?? "";

    if (validateCode(code)) {
      setTapnoshCode(code);
      handleAccept(code);
    } else {
      toast.error("Invalid code", {
        description: "The code you scanned is invalid. Please try again.",
      });
    }
  };

  const handleAccept = (code: string) => {
    if (validateCode(code)) {
      setLoading(true);
    } else {
      toast.error("Invalid code", {
        description: "The code you've provided is invalid. Please try again.",
      });
    }

    setTimeout(() => {
      router.push(`/order/restaurant-name/${code}`);
    }, 100);
  };

  useLayoutEffect(() => {
    const codeFromUrl = searchParams.get("tapnoshId");

    if (codeFromUrl) {
      if (validateCode(codeFromUrl)) {
        setTapnoshCode(codeFromUrl);
        handleAccept(codeFromUrl);
      } else {
        toast.error("Invalid code", {
          description: "The code in the URL is invalid. Please try again.",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const { isCameraAllowed, requestCamera } = useCamera();

  return (
    <>
      <section className="section items-center">
        <h1>Hungry?</h1>
        <h6>Start by scanning the QR code or typing the code below it</h6>
      </section>

      <section className="section items-center lg:mt-12">
        <article className="lg:gap:12 flex flex-col items-center gap-6 lg:flex-row lg:justify-center xl:gap-24 2xl:gap-32">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Scan the code</CardTitle>
              <CardDescription>
                Scan restaurants code with{" "}
                <span className="font-display-median font-black">tapnosh</span>{" "}
                logo below it.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="bg-muted relative flex aspect-square w-full max-w-md justify-center overflow-clip rounded-lg">
                {!isCameraAllowed && (
                  <div className="absolute inset-0 z-[2] flex items-center justify-center">
                    <Button onClick={() => requestCamera()}>
                      Allow Camera <Camera />
                    </Button>
                  </div>
                )}

                <div className="border-primary-foreground absolute inset-[15%] z-[1] flex justify-center rounded-lg border-2">
                  <div className="text-primary-foreground font-display-median absolute bottom-0 m-auto flex h-[22%] translate-y-full items-center text-lg font-black sm:text-xl">
                    Tapnosh
                  </div>
                </div>

                <div className="absolute inset-0 -z-10 flex items-center justify-center">
                  <Loader2Icon className="animate-spin" />
                </div>

                {isCameraAllowed && (
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
                    onScan={handleScan}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted flex h-0.5 w-full max-w-3xs shrink-0 md:my-0 lg:mx-4 lg:h-40 lg:w-0.5" />

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Type it</CardTitle>
              <CardDescription>
                Input 6 character long code below.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <InputOTP
                onChange={setTapnoshCode}
                value={tapnoshCode}
                maxLength={6}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={() => handleAccept(tapnoshCode)}
                isLoading={loading}
              >
                Accept
              </Button>
            </CardFooter>
          </Card>
        </article>
      </section>
    </>
  );
}
