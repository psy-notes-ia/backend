import FormController from "./controller";
import rateLimit from "@fastify/rate-limit";

const handler = new FormController();

function NotesRouter(router: any, opts: any, done: any) {

  router.post("/", handler.createNote);
  router.get("/", handler.getNotes);
  router.get("/:id", handler.getNotesById);
  router.patch("/:id", handler.updateNote);
  done();
}

export { NotesRouter };
