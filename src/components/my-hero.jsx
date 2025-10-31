import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Button } from "@/components/ui/button"
  import Image from "next/image"

export default function MyHero() {
    return(
        <div className="flex justify-center">
            <Card className="w-max">
      <CardContent className="flex flex-row items-center gap-4">
        <Image src="/kamil-avatar.png" alt="Kamil Bozkurt" width={100} height={100}></Image>
        <p className="font-mono text-lg">Hello I am Kamil Bozkurt. I am a full stack developer.</p>
      </CardContent>
    </Card>
        </div>
    )
}