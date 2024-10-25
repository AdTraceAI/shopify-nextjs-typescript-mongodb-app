import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;
let isProd = process.env.NODE_ENV === "production";

if (isProd) {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
