import FormController from "./controller";
import rateLimit from "@fastify/rate-limit";

const handler = new FormController();

function NotesRouter(router: any, opts: any, done: any) {

  router.post("/", handler.createNote);
  router.get("/", handler.getNotes);
  router.get("/:pacientId", handler.getNotes);
  router.get("/single/:noteId", handler.getNotesById);
  router.delete("/:noteId", handler.deleteNote);
  router.patch("/:pacientId", handler.updateNote);
  done();
}

export { NotesRouter };
