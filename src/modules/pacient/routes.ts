import PacientController from "./controller";
import rateLimit from "@fastify/rate-limit";

const handler = new PacientController();

function PacientsRouter(router: any, opts: any, done: any) {

  router.post("/", handler.createPacient);
  router.get("/", handler.getAllPacients);
  router.get("/:q", handler.getByQuery);
  router.delete("/:id", handler.deletePacient);
  done();
}

export { PacientsRouter };
