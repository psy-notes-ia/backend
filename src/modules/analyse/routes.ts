
import CheckAnalyseStatus from "./check-analyse-status";
import CreateAnalyse from "./generate-analyse";


function AnalyseRouter(fastify: any, opts: any, done: any) {
  fastify.post("/analyse/:id", CreateAnalyse);
  fastify.get("/analyse/:id/:status", CheckAnalyseStatus);

  done();
}

export default AnalyseRouter;
