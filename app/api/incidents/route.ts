import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { isEmpty } from "../isEmpty";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    const decoded = verify(authHeader!, process.env.JWT_SECRET!);

    if (!authHeader) return new Response("Unauthorized", { status: 401 });

    const incidents = await prisma.incident.findMany({
      include: {
        Child: true,
      },
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

    const decoded = verify(authHeader!, process.env.JWT_SECRET!);

    if (!authHeader) return new Response("Unauthorized", { status: 401 });

    const { title, description, childrenId, category, type } = await req.json();

    if (
      !title ||
      !description ||
      !childrenId ||
      !category ||
      !type ||
      isEmpty([title, description, category, type])
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

    if (
      type.toLocaleLowerCase() !== "positive" &&
      type.toLocaleLowerCase() !== "negative" &&
      type.toLocaleLowerCase() !== "informational"
    )
      return new Response("Invalid type", { status: 400 });

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

        await prisma.incident.create({
          data: {
            title,
            description,
            childId,
            occurredAt: new Date(),
            category:
              category.split("")[0].toLocaleUpperCase() + category.slice(1),
            type,
          },
        });
      }),
    );
    return new Response("Incidents created successfully", { status: 201 });
  } catch (error: any) {
    if (error instanceof Response) return error;
    return new Response(error, { status: 500 });
  }
}
