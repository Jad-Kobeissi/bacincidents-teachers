import axios from "axios";
import { isEmpty } from "../isEmpty";
import { sign } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password || isEmpty([identifier, password]))
      return new Response("All fields are required", { status: 400 });

    let BACToken;
    let user;
    try {
      const res = await axios.post(`https://sisapi.bac.edu.lb/api/login`, {
        identifier,
        password,
      });
      BACToken = res.data.data._token;

      // if (res.data.data.is_advisor && res.data.data.is_staff)
      //   return new Response("Unauthorized", { status: 401 });

      const admin = await prisma.admin.findFirst({
        where: {
          identifier,
        },
      });

      if (!admin) {
        const newAdmin = await prisma.admin.create({
          data: {
            identifier,
          },
        });
        user = newAdmin;
      } else {
        user = admin;
      }
    } catch (error: any) {
      return new Response(error.response.data.message, {
        status: error.response.status,
      });
    }

    const token = sign({ id: user.id }, process.env.JWT_SECRET!);

    return Response.json({ token, BACToken, user });
  } catch (error: any) {
    console.log(error);
    return new Response(error, { status: 500 });
  }
}
