import { Router } from "express";
import { db } from "../config/firebase";

const router = Router();

router.get("/test-firebase", async (req, res) => {
  try {
    const docRef = db.collection("test").doc();
    await docRef.set({
      message: "API conectada ao Firebase com sucesso!",
      timestamp: Date.now(),
    });

    res.json({ ok: true, id: docRef.id });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
