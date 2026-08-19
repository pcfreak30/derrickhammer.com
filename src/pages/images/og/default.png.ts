import type { APIRoute } from "astro";
import { generateOGImage } from "../../../lib/og-template";

const NAME = "Derrick Hammer";
const TITLE = "Senior Product & Systems Engineer";
const DESCRIPTION =
  "Backend, infrastructure, storage, and complex web systems. Senior engineering help on hard technical problems.";
const SOCIALS = ["@pcfreak30", "in/derrickhammer"];

export const GET: APIRoute = async () => {
  const png = await generateOGImage({
    name: NAME,
    title: TITLE,
    description: DESCRIPTION,
    socials: SOCIALS,
  });

  return new Response(png as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
