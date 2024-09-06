import prisma from "../../lib/prisma";
import { protectRoute } from "../middleware/auth";

async function handler(req, res) {
  const { userId } = req.user;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
}

export default protectRoute(handler);
