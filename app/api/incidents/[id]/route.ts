import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET!))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;
    const incident = await prisma.incident.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        Admin: true,
        Child: true,
      },
    });

    if (!incident) return new Response("Incident not found", { status: 404 });

    return Response.json(incident);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
