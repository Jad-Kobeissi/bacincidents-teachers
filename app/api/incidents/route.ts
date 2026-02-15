import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { isEmpty } from "../isEmpty";
import { TIncident } from "@/app/types";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    const decoded = verify(authHeader!, process.env.JWT_SECRET!);

    if (!authHeader) return new Response("Unauthorized", { status: 401 });

    const url = new URL(req.url);
    const page = JSON.parse(url.searchParams.get("page") as string) || 1;
    const skip = (page - 1) * 5;
    const incidents = await prisma.incident.findMany({
      include: {
        Child: true,
      },
      take: 5,
      skip,
    });

    if (incidents.length == 0)
      return new Response("No incidents found", { status: 404 });

    return Response.json(incidents);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    const decoded = verify(authHeader!, process.env.JWT_SECRET!) as any;

    if (!authHeader) return new Response("Unauthorized", { status: 401 });

    const { title, description, childrenId, category, severity } =
      await req.json();

    if (
      !title ||
      !description ||
      !childrenId ||
      !category ||
      !severity ||
      isEmpty([title, description, category, severity])
    )
      return new Response("Please fill all missing fields", { status: 400 });

    if (childrenId.length == 0)
      return new Response("Please provide at least one child id", {
        status: 400,
      });

    if (
      category.toLocaleLowerCase() !== "warning" &&
      category.toLocaleLowerCase() !== "information" &&
      category.toLocaleLowerCase() !== "urgent" &&
      category.toLocaleLowerCase() !== "positive"
    )
      return new Response("Invalid category", { status: 400 });

    let incidents: TIncident[] = [];
    await Promise.all(
      childrenId.map(async (childId: number) => {
        const child = await prisma.child.findUnique({
          where: {
            id: childId,
          },
        });

        if (!child)
          throw new Response(`Child with id ${childId} not found`, {
            status: 404,
          });
        console.log(decoded.id);

        const newIncident = await prisma.incident.create({
          data: {
            title,
            description,
            childId,
            occurredAt: new Date(),
            severity,
            category:
              category.split("")[0].toLocaleUpperCase() + category.slice(1),
            adminId: decoded.id,
          },
          include: {
            Child: true,
            Admin: true,
          },
        });
        incidents.push(newIncident as any);
      }),
    );
    return Response.json(incidents);
  } catch (error: any) {
    if (error instanceof Response) return error;
    return new Response(error, { status: 500 });
  }
}
