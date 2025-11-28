import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { getHero, HERO_PLACEHOLDER_AVATAR, defaultHeroContent } from "@/lib/db";
import Image from "next/image";

export default async function MyHeroSection() {
  let hero = null;
  
  try {
    hero = await getHero();
  } catch (error) {
    console.error("Error fetching hero:", error);
    // Use defaults on error
  }

  // Use DB values when present, otherwise use defaults
  const avatar = hero?.avatar && hero.avatar.trim() && hero.avatar !== HERO_PLACEHOLDER_AVATAR
    ? hero.avatar
    : HERO_PLACEHOLDER_AVATAR;
  
  const fullName = hero?.fullName || defaultHeroContent.fullName;
  const shortDescription = hero?.shortDescription || defaultHeroContent.shortDescription;
  const longDescription = hero?.longDescription || defaultHeroContent.longDescription;

  return (
    <div className="flex justify-center mt-4">
      <Card className="w-full sm:w-[calc(100%-2rem)] max-w-5xl">
        <CardContent className="flex flex-row items-start gap-4 p-6">
          {avatar && avatar.startsWith("data:") ? (
            <img
              src={avatar}
              alt={fullName}
              width={100}
              height={100}
              className="rounded-full object-cover shrink-0"
            />
          ) : (
            <Image 
              src={avatar} 
              alt={fullName} 
              width={100} 
              height={100}
              className="rounded-full object-cover shrink-0"
            />
          )}
          <div className="flex flex-col gap-2 min-w-0 flex-1">
            <p className="font-mono text-lg font-bold wrap-break-word">{fullName}</p>
            <p className="font-mono text-base wrap-break-word">{shortDescription}</p>
            {longDescription && longDescription !== defaultHeroContent.longDescription && (
              <p className="font-mono text-sm text-gray-600 dark:text-gray-400 mt-2 wrap-break-word whitespace-pre-wrap">{longDescription}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

