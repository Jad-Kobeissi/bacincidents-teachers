import { TChild } from "@/app/types";
import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_SECRET as string))
      return new Response("Unauthorized", { status: 401 });

    const url = new URL(req.url);
    const grade = url.searchParams.get("grade");

    let students: any[] = [];
    if (grade == "") {
      students = await prisma.child.findMany({
        include: {
          Incident: true,
        },
      });
    } else if (grade) {
      students = await prisma.child.findMany({
        where: {
          grade: {
            contains: grade,
          },
        },
        include: {
          Incident: true,
        },
      });
    }

    if (students.length == 0)
      return new Response("No students found", { status: 404 });

    return Response.json(students);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
